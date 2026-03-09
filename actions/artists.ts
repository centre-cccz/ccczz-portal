'use server';

import { prisma } from '@/lib/prisma';
import {
    artistSubmissionSchema,
    adminReviewSchema,
    featuredToggleSchema,
    mediaUploadSchema,
    artistProfileSchema,
    RATE_LIMITS,
} from '@/lib/artistes/schema';
import { generateSlug } from '@/lib/utils/slug';
import { sendEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// ============================================================================
// ERROR HANDLING
// ============================================================================

export interface ServerActionResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    code?: string;
}

function createError<T>(
    message: string,
    code: string = 'INTERNAL_ERROR'
): ServerActionResult<T> {
    return {
        success: false,
        error: message,
        code,
    };
}

function createSuccess<T>(data: T): ServerActionResult<T> {
    return {
        success: true,
        data,
    };
}

// ============================================================================
// RATE LIMITING (IP-based, simple in-memory cache)
// ============================================================================

const submissionCache = new Map<string, number[]>();

function checkRateLimit(
    identifier: string,
    limit: number,
    windowMs: number
): boolean {
    const now = Date.now();
    const requests = submissionCache.get(identifier) || [];

    // Filter out old requests outside the window
    const recentRequests = requests.filter((t) => now - t < windowMs);

    if (recentRequests.length >= limit) {
        return false;
    }

    recentRequests.push(now);
    submissionCache.set(identifier, recentRequests);
    return true;
}

// ============================================================================
// SUBMISSION ACTIONS
// ============================================================================

/**
 * Create a new artist submission from form input
 * Validates form, creates artist + media records, sends confirmation email
 */
export async function createArtistSubmission(
    formData: unknown,
    ipAddress: string
): Promise<ServerActionResult<{ submissionId: string; artistSlug: string }>> {
    try {
        // Rate limiting check
        if (
            !checkRateLimit(
                ipAddress,
                RATE_LIMITS.SUBMISSION_FORM_REQUESTS_PER_HOUR,
                60 * 60 * 1000
            )
        ) {
            return createError(
                'Trop de demandes. Réessayez dans une heure.',
                'RATE_LIMIT_EXCEEDED'
            );
        }

        // Validate input
        const validated = await artistSubmissionSchema.parseAsync(formData);

        // Check if artist already exists with this email
        const existingArtist = await prisma.artist.findUnique({
            where: { email: validated.email },
        });

        if (existingArtist) {
            return createError(
                'Un artiste avec cette adresse email existe déjà',
                'ARTIST_EXISTS'
            );
        }

        // Check submission rate per email per month
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const recentSubmissions = await prisma.artistSubmission.count({
            where: {
                artist: { email: validated.email },
                submittedAt: { gte: thirtyDaysAgo },
            },
        });

        if (recentSubmissions >= RATE_LIMITS.SUBMISSIONS_PER_EMAIL_PER_MONTH) {
            return createError(
                `Limite de ${RATE_LIMITS.SUBMISSIONS_PER_EMAIL_PER_MONTH} soumissions par mois atteinte`,
                'SUBMISSION_LIMIT_EXCEEDED'
            );
        }

        // Generate unique slug from artist name
        const baseSlug = generateSlug(validated.name);
        let slug = baseSlug;
        let counter = 1;

        while (await prisma.artist.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        // Create artist + media + submission in transaction
        const result = await prisma.$transaction(async (tx) => {
            const artist = await tx.artist.create({
                data: {
                    slug,
                    name: validated.name,
                    email: validated.email,
                    phone: validated.phone,
                    disciplines: validated.disciplines,
                    bio: validated.bio,
                    website: validated.website,
                    profileImage: validated.profileImage,
                    socialLinks: validated.socialLinks || {},
                    publicProfile: false, // Not public until approved
                },
            });

            // Create media items
            const media = await Promise.all(
                validated.mediaFiles.map((file, index) =>
                    tx.artistMedia.create({
                        data: {
                            artistId: artist.id,
                            title: file.title,
                            description: file.description,
                            url: file.url,
                            type: file.type,
                            isPublic: false, // Not public until approved
                            order: index,
                        },
                    })
                )
            );

            // Create submission record
            const submission = await tx.artistSubmission.create({
                data: {
                    artistId: artist.id,
                    status: 'PENDING',
                    submittedAt: new Date(),
                },
            });

            return { artist, submission, media };
        });

        // Send confirmation email to artist
        await sendEmail({
            to: validated.email,
            subject: 'Confirmation de votre soumission au CCCZ',
            template: 'artist-submission-received',
            data: {
                artistName: validated.name,
                submissionId: result.submission.id,
                statusPageUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/artistes/${slug}/status`,
            },
        });

        // Send notification to admin
        await sendEmail({
            to: process.env.ADMIN_EMAIL_OVERRIDE || 'admin@cccz.org',
            subject: `Nouvelle soumission d'artiste: ${validated.name}`,
            template: 'admin-new-submission',
            data: {
                artistName: validated.name,
                email: validated.email,
                disciplines: validated.disciplines.join(', '),
                adminUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/artistes/${result.submission.id}`,
            },
        });

        // Revalidate the artists directory
        revalidatePath('/artistes');

        return createSuccess({
            submissionId: result.submission.id,
            artistSlug: slug,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const fieldError = error.errors[0];
            return createError(
                `${fieldError.path.join('.')}: ${fieldError.message}`,
                'VALIDATION_ERROR'
            );
        }

        console.error('createArtistSubmission error:', error);
        return createError(
            'Une erreur s\'est produite lors du traitement de votre soumission',
            'INTERNAL_ERROR'
        );
    }
}

// ============================================================================
// ADMIN ACTIONS - REVIEW & APPROVAL
// ============================================================================

/**
 * Admin action: Review and approve/reject artist submission
 * Only callable by DACPA/DG roles
 */
export async function reviewArtistSubmission(
    reviewData: unknown,
    reviewerId: string
): Promise<ServerActionResult<{ status: string }>> {
    try {
        const validated = await adminReviewSchema.parseAsync(reviewData);

        // Verify reviewer has permission (in real app, check user role)
        // TODO: Integrate with auth system to verify role

        const submission = await prisma.artistSubmission.findUnique({
            where: { id: validated.submissionId },
            include: { artist: true },
        });

        if (!submission) {
            return createError('Soumission non trouvée', 'NOT_FOUND');
        }

        // Update submission based on status
        const updates: any = {
            status: validated.status === 'APPROVED' ? 'APPROVED' : 'REJECTED',
            reviewedAt: new Date(),
            reviewedBy: reviewerId,
            notes: validated.notes,
        };

        if (validated.status === 'REJECTED') {
            updates.rejectionReason = validated.rejectionReason;
        }

        const updatedSubmission = await prisma.$transaction(async (tx) => {
            // Update submission
            const submission = await tx.artistSubmission.update({
                where: { id: validated.submissionId },
                data: updates,
            });

            // If approved, make artist public
            if (validated.status === 'APPROVED') {
                await tx.artist.update({
                    where: { id: submission.artistId },
                    data: {
                        publicProfile: true,
                        featured: validated.featured || false,
                    },
                });

                // Make media public
                await tx.artistMedia.updateMany({
                    where: { artistId: submission.artistId },
                    data: { isPublic: true },
                });
            }

            return submission;
        });

        // Send email notification to artist
        if (validated.status === 'APPROVED') {
            await sendEmail({
                to: submission.artist.email,
                subject: 'Votre profil artiste a été approuvé!',
                template: 'artist-approved',
                data: {
                    artistName: submission.artist.name,
                    profileUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/artistes/${submission.artist.slug}`,
                    featured: validated.featured,
                },
            });
        } else {
            await sendEmail({
                to: submission.artist.email,
                subject: 'Concernant votre soumission au CCCZ',
                template: 'artist-rejected',
                data: {
                    artistName: submission.artist.name,
                    reason: validated.rejectionReason,
                    resubmitUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/artistes/soumettre`,
                },
            });
        }

        // Revalidate artist page
        revalidatePath(`/artistes/${submission.artist.slug}`);
        revalidatePath('/artistes');

        return createSuccess({ status: updatedSubmission.status });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return createError('Erreur de validation des données', 'VALIDATION_ERROR');
        }

        console.error('reviewArtistSubmission error:', error);
        return createError(
            'Une erreur est survenue lors de l\'examen',
            'INTERNAL_ERROR'
        );
    }
}

// ============================================================================
// FEATURED MANAGEMENT
// ============================================================================

/**
 * Toggle featured status for an artist
 */
export async function toggleFeaturedArtist(
    data: unknown
): Promise<ServerActionResult<{ featured: boolean }>> {
    try {
        const validated = await featuredToggleSchema.parseAsync(data);

        const artist = await prisma.artist.update({
            where: { id: validated.artistId },
            data: { featured: validated.featured },
        });

        // Update submission to record featured action
        const lastSubmission = await prisma.artistSubmission.findFirst({
            where: { artistId: validated.artistId },
            orderBy: { submittedAt: 'desc' },
        });

        if (lastSubmission && validated.featured) {
            await prisma.artistSubmission.update({
                where: { id: lastSubmission.id },
                data: { featuredAt: new Date() },
            });
        }

        revalidatePath('/artistes');
        revalidatePath(`/artistes/${artist.slug}`);

        return createSuccess({ featured: artist.featured });
    } catch (error) {
        console.error('toggleFeaturedArtist error:', error);
        return createError('Erreur lors de la mise à jour', 'INTERNAL_ERROR');
    }
}

// ============================================================================
// ARTIST UPDATE ACTIONS
// ============================================================================

/**
 * Artist updates their own profile (protected endpoint)
 */
export async function updateArtistProfile(
    artistId: string,
    profileData: unknown
): Promise<ServerActionResult<{ slug: string }>> {
    try {
        const validated = await artistProfileSchema.parseAsync(profileData);

        const artist = await prisma.artist.update({
            where: { id: artistId },
            data: {
                ...(validated.name && { name: validated.name }),
                ...(validated.bio && { bio: validated.bio }),
                ...(validated.disciplines && { disciplines: validated.disciplines }),
                ...(validated.website && { website: validated.website }),
                ...(validated.profileImage && { profileImage: validated.profileImage }),
                ...(validated.socialLinks && { socialLinks: validated.socialLinks }),
            },
        });

        revalidatePath(`/artistes/${artist.slug}`);

        return createSuccess({ slug: artist.slug });
    } catch (error) {
        console.error('updateArtistProfile error:', error);
        return createError('Erreur lors de la mise à jour du profil', 'INTERNAL_ERROR');
    }
}

// ============================================================================
// MEDIA MANAGEMENT
// ============================================================================

/**
 * Add media to artist portfolio
 */
export async function addArtistMedia(
    artistId: string,
    mediaData: unknown
): Promise<ServerActionResult<{ mediaId: string }>> {
    try {
        const validated = await mediaUploadSchema.parseAsync(mediaData);

        const media = await prisma.artistMedia.create({
            data: {
                artistId,
                ...validated,
            },
        });

        revalidatePath(`/artistes/${(await prisma.artist.findUnique({ where: { id: artistId } }))?.slug}`);

        return createSuccess({ mediaId: media.id });
    } catch (error) {
        console.error('addArtistMedia error:', error);
        return createError('Erreur lors de l\'ajout du média', 'INTERNAL_ERROR');
    }
}

/**
 * Delete media from artist portfolio
 */
export async function deleteArtistMedia(
    mediaId: string
): Promise<ServerActionResult<null>> {
    try {
        const media = await prisma.artistMedia.delete({
            where: { id: mediaId },
        });

        const artist = await prisma.artist.findUnique({
            where: { id: media.artistId },
        });

        if (artist) {
            revalidatePath(`/artistes/${artist.slug}`);
        }

        return createSuccess(null);
    } catch (error) {
        console.error('deleteArtistMedia error:', error);
        return createError('Erreur lors de la suppression du média', 'INTERNAL_ERROR');
    }
}

// ============================================================================
// QUERY ACTIONS (for data fetching)
// ============================================================================

/**
 * Get artist details with all media and submission history
 * Public data only if approved
 */
export async function getArtistBySlug(slug: string, includePrivate = false) {
    try {
        const artist = await prisma.artist.findUnique({
            where: { slug },
            include: {
                mediaItems: {
                    where: { isPublic: !includePrivate ? true : undefined },
                    orderBy: { order: 'asc' },
                },
                submissions: {
                    orderBy: { submittedAt: 'desc' },
                },
            },
        });

        if (!artist) {
            return createError('Artiste non trouvé', 'NOT_FOUND');
        }

        // If not approved and not requesting private data, return error
        if (!artist.publicProfile && !includePrivate) {
            return createError('Ce profil artiste n\'est pas disponible', 'NOT_FOUND');
        }

        return createSuccess(artist);
    } catch (error) {
        console.error('getArtistBySlug error:', error);
        return createError('Erreur lors de la récupération', 'INTERNAL_ERROR');
    }
}

/**
 * Get paginated list of featured/public artists for directory
 */
export async function getFeaturedArtists(page = 1, limit = 12) {
    try {
        const skip = (page - 1) * limit;

        const [artists, total] = await Promise.all([
            prisma.artist.findMany({
                where: {
                    publicProfile: true,
                    featured: true,
                },
                include: {
                    mediaItems: {
                        where: { isPublic: true },
                        take: 1, // Just featured image
                        orderBy: { order: 'asc' },
                    },
                },
                skip,
                take: limit,
                orderBy: { updatedAt: 'desc' },
            }),
            prisma.artist.count({
                where: {
                    publicProfile: true,
                    featured: true,
                },
            }),
        ]);

        return createSuccess({
            artists,
            total,
            pages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('getFeaturedArtists error:', error);
        return createError('Error fetching artists', 'INTERNAL_ERROR');
    }
}
