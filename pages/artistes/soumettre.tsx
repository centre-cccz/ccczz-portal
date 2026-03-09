import SubmissionForm from '../../../components/artistes/SubmissionForm'
import React from 'react'

export default function SubmitArtistPage() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <h1 className="text-2xl font-bold mb-4">Soumettre un artiste</h1>
            <p className="mb-6">Remplissez le formulaire ci-dessous pour proposer un artiste ou un collectif.</p>
            <SubmissionForm />
        </div>
    )
}
