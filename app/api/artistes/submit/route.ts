import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { prisma } from '../../../../../../lib/prisma'
import { UPLOAD_CONSTRAINTS } from '../../../../../../lib/artistes/schema'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

function ensureUploadDir() {
    if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

function slugify(name: string) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
}

export async function POST(req: Request) {
    ensureUploadDir()

    const formData = await req.formData()

    const name = String(formData.get('name') ?? '')
    const email = String(formData.get('email') ?? '')
    const phone = formData.get('phone') ? String(formData.get('phone')) : null
    const bio = String(formData.get('bio') ?? '')
    const website = formData.get('website') ? String(formData.get('website')) : null
    const agree = formData.get('agreeToTerms')

    if (!name || !email || !bio) {
        return NextResponse.json({ message: 'Champs requis manquants' }, { status: 400 })
    }

    if (!agree) {
        return NextResponse.json({ message: 'Vous devez accepter les conditions' }, { status: 400 })
    }

    // disciplines can be multiple
    const disciplinesRaw = formData.getAll('disciplines') as string[]
    const disciplines = disciplinesRaw.filter(Boolean)

    // handle profileImage (single)
    const profileFile = formData.get('profileImage') as File | null

    const savedFiles: string[] = []

    async function saveFile(file: File) {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        // validate size
        if (buffer.length > UPLOAD_CONSTRAINTS.MAX_FILE_SIZE) {
            throw new Error('Fichier trop volumineux')
        }
        // validate type for images
        if (file.type && UPLOAD_CONSTRAINTS.ALLOWED_IMAGE_TYPES.includes(file.type)) {
            // ok
        } else if (file.type && UPLOAD_CONSTRAINTS.ALLOWED_VIDEO_TYPES.includes(file.type)) {
            // ok
        } else if (file.type && UPLOAD_CONSTRAINTS.ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
            // ok
        } else if (!file.type) {
            // allow unknown but warn
        } else {
            throw new Error('Type de fichier non autorisé: ' + file.type)
        }

        const ext = path.extname(file.name) || ''
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`
        const filePath = path.join(UPLOAD_DIR, filename)
        await fs.promises.writeFile(filePath, buffer)
        return `/uploads/${filename}`
    }

    try {
        if (profileFile && profileFile.size > 0) {
            const saved = await saveFile(profileFile)
            savedFiles.push(saved)
        }

        // mediaFiles may be multiple
        const mediaFiles = formData.getAll('mediaFiles') as File[]
        for (const mf of mediaFiles) {
            if (mf && mf.size > 0) {
                const saved = await saveFile(mf)
                savedFiles.push(saved)
            }
        }

        // Create artist record in DB with status DRAFT
        const baseSlug = slugify(name || 'artist')
        let slug = baseSlug
        // ensure unique slug
        let count = 0
        while (true) {
            const existing = await prisma.artist.findUnique({ where: { slug } })
            if (!existing) break
            count += 1
            slug = `${baseSlug}-${count}`
        }

        const artist = await prisma.artist.create({
            data: {
                name,
                slug,
                disciplines: disciplines.length ? disciplines : [],
                bio,
                profileImage: savedFiles.length ? savedFiles[0] : null,
                email,
                phone,
                socialLinks: null,
                publicProfile: false,
                featured: false,
                status: 'DRAFT',
            },
        })

        // create media records
        for (let i = 0; i < savedFiles.length; i++) {
            const url = savedFiles[i]
            await prisma.artistMedia.create({
                data: {
                    artistId: artist.id,
                    type: 'IMAGE',
                    title: path.basename(url),
                    description: null,
                    url,
                    order: i,
                    isPublic: false,
                },
            })
        }

        return NextResponse.json({ message: 'Soumission enregistrée', artistId: artist.id })
    } catch (err: any) {
        console.error('Submission error', err)
        return NextResponse.json({ message: err?.message || 'Erreur serveur' }, { status: 500 })
    }
}
