import { z } from 'zod';

// ============================================================================
// DISCIPLINE ENUM
// ============================================================================
export const disciplineValues = [
    'VISUAL_ARTS',
    'PERFORMING_ARTS',
    'MUSIC',
    'DANCE',
    'THEATER',
    'FILM',
    'LITERATURE',
    'PHOTOGRAPHY',
    'SCULPTURE',
    'PAINTING',
    'DIGITAL_MEDIA',
    'INSTALLATION',
    'OTHER',
] as const;

export type Discipline = (typeof disciplineValues)[number];

// ============================================================================
// SUBMISSION STATUS ENUM
// ============================================================================
export const submissionStatusValues = [
    'PENDING',
    'UNDER_REVIEW',
    'APPROVED',
    'FEATURED',
    'ARCHIVED',
    'REJECTED',
] as const;

export type SubmissionStatus = (typeof submissionStatusValues)[number];

// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================

/**
 * Artist Submission Form Schema
 * Validates form input from the submission page
 */
export const artistSubmissionSchema = z.object({
    name: z
        .string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(255, 'Le nom doit contenir au maximum 255 caractères')
        .trim(),

    email: z
        .string()
        .email('Adresse email invalide')
        .toLowerCase(),

    phone: z
        .string()
        .optional()
        .refine(
            (val) => !val || /^[+\d\s\-()]{7,20}$/.test(val),
            'Numéro de téléphone invalide'
        ),

    disciplines: z
        .array(z.enum(disciplineValues))
        .min(1, 'Sélectionnez au moins une discipline')
        .max(3, 'Sélectionnez au maximum 3 disciplines'),

    bio: z
        .string()
        .min(50, 'La biographie doit contenir au moins 50 caractères')
        .max(2000, 'La biographie doit contenir au maximum 2000 caractères')
        .trim(),

    website: z
        .string()
        .optional()
        .refine(
            (val) =>
                !val ||
                /^https?:\/\/.+\..+/.test(val),
            'URL invalide'
        ),

    socialLinks: z
        .record(
            z.string(),
            z
                .string()
                .url('URL de réseau social invalide')
                .optional()
        )
        .optional()
        .default({}),

    profileImage: z
        .string()
        .url('URL d\'image invalide')
        .optional(),

    mediaFiles: z
        .array(
            z.object({
                url: z.string().url('URL de fichier invalid'),
                title: z.string().min(1).max(255),
                description: z.string().optional(),
                type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'PORTFOLIO']),
                isPublic: z.boolean().default(false),
            })
        )
        .min(1, 'Ajoutez au moins un fichier média')
        .max(20, 'Maximum 20 fichiers médias'),

    agreeToTerms: z
        .boolean()
        .refine((val) => val === true, 'Vous devez accepter les conditions'),
});

export type ArtistSubmissionInput = z.infer<typeof artistSubmissionSchema>;

/**
 * Artist Profile Update Schema
 * Allows artists to update their published profile
 */
export const artistProfileSchema = z.object({
    name: z
        .string()
        .min(2)
        .max(255)
        .trim()
        .optional(),

    disciplines: z
        .array(z.enum(disciplineValues))
        .min(1)
        .max(3)
        .optional(),

    bio: z
        .string()
        .min(50)
        .max(2000)
        .trim()
        .optional(),

    website: z
        .string()
        .url()
        .optional(),

    profileImage: z
        .string()
        .url()
        .optional(),

    socialLinks: z
        .record(z.string(), z.string().url().optional())
        .optional(),
});

export type ArtistProfileUpdate = z.infer<typeof artistProfileSchema>;

/**
 * Admin Review Schema
 * Allows DACPA/DG to review and approve/reject submissions
 */
export const adminReviewSchema = z.object({
    submissionId: z.string().cuid('ID de soumission invalide'),

    status: z.enum(['APPROVED', 'REJECTED', 'REQUEST_CHANGES']),

    notes: z
        .string()
        .max(2000, 'Les notes doivent contenir au maximum 2000 caractères')
        .optional(),

    rejectionReason: z
        .string()
        .min(10, 'Une raison de rejet doit contenir au moins 10 caractères')
        .max(1000)
        .optional(),

    featured: z.boolean().default(false),
});

export type AdminReviewInput = z.infer<typeof adminReviewSchema>;

/**
 * Featured Toggle Schema
 * Admin can promote/demote artists from featured status
 */
export const featuredToggleSchema = z.object({
    artistId: z.string().cuid('ID artiste invalide'),
    featured: z.boolean(),
});

export type FeaturedToggleInput = z.infer<typeof featuredToggleSchema>;

/**
 * Media Upload Schema
 * Validates individual media file metadata
 */
export const mediaUploadSchema = z.object({
    title: z
        .string()
        .min(1, 'Le titre est requis')
        .max(255, 'Le titre doit contenir au maximum 255 caractères'),

    description: z
        .string()
        .max(1000, 'La description doit contenir au maximum 1000 caractères')
        .optional(),

    type: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT', 'PORTFOLIO']),

    url: z.string().url('URL invalide'),

    isPublic: z.boolean().default(false),

    order: z.number().int().min(0).default(0),
});

export type MediaUploadInput = z.infer<typeof mediaUploadSchema>;

/**
 * Artist Search/Filter Schema
 * Validates query parameters for public artist directory
 */
export const artistSearchSchema = z.object({
    query: z.string().optional(),
    disciplines: z.array(z.enum(disciplineValues)).optional(),
    sortBy: z.enum(['name', 'newest', 'featured']).default('name'),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(50).default(12),
});

export type ArtistSearchParams = z.infer<typeof artistSearchSchema>;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Artist {
    id: string;
    slug: string;
    name: string;
    disciplines: string[];
    bio: string;
    email: string;
    phone?: string | null;
    website?: string | null;
    socialLinks?: Record<string, string> | null;
    profileImage?: string | null;
    publicProfile: boolean;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ArtistMedia {
    id: string;
    artistId: string;
    type: 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'PORTFOLIO';
    title: string;
    description?: string | null;
    url: string;
    order: number;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ArtistSubmission {
    id: string;
    artistId: string;
    status: SubmissionStatus;
    submittedAt: Date;
    reviewedAt?: Date | null;
    approvedAt?: Date | null;
    featuredAt?: Date | null;
    reviewedBy?: string | null;
    notes?: string | null;
    rejectionReason?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface ArtistWithMedia extends Artist {
    mediaItems: ArtistMedia[];
    submissions: ArtistSubmission[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const disciplineLabels: Record<Discipline, string> = {
    VISUAL_ARTS: 'Arts visuels',
    PERFORMING_ARTS: 'Arts de la scène',
    MUSIC: 'Musique',
    DANCE: 'Danse',
    THEATER: 'Théâtre',
    FILM: 'Cinéma',
    LITERATURE: 'Littérature',
    PHOTOGRAPHY: 'Photographie',
    SCULPTURE: 'Sculpture',
    PAINTING: 'Peinture',
    DIGITAL_MEDIA: 'Médias numériques',
    INSTALLATION: 'Installation',
    OTHER: 'Autre',
};

export const submissionStatusLabels: Record<SubmissionStatus, string> = {
    PENDING: 'En attente',
    UNDER_REVIEW: 'En cours d\'examen',
    APPROVED: 'Approuvé',
    FEATURED: 'En vedette',
    ARCHIVED: 'Archivé',
    REJECTED: 'Rejeté',
};

export const submissionStatusColors: Record<SubmissionStatus, string> = {
    PENDING: 'bg-orange-100 text-orange-800 border-orange-300',
    UNDER_REVIEW: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    APPROVED: 'bg-green-100 text-green-800 border-green-300',
    FEATURED: 'bg-blue-100 text-blue-800 border-blue-300',
    ARCHIVED: 'bg-gray-100 text-gray-800 border-gray-300',
    REJECTED: 'bg-red-100 text-red-800 border-red-300',
};

// Rate limiting configuration
export const RATE_LIMITS = {
    SUBMISSIONS_PER_EMAIL_PER_MONTH: 3,
    SUBMISSION_FORM_REQUESTS_PER_HOUR: 10,
    API_CALLS_PER_MINUTE: 60,
} as const;

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    MAX_IMAGE_SIZE: 10 * 1024 * 1024, // 10MB for images
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
} as const;
