export function validatePartnership(data: any) {
  const errors: any = {};

  // Validation du nom de l'organisation
  if (!data.organizationName || data.organizationName.trim() === '') {
    errors.organizationName = 'Le nom de l\'organisation est requis';
  }

  // Validation du nom de contact
  if (!data.contactName || data.contactName.trim() === '') {
    errors.contactName = 'Le nom de contact est requis';
  }

  // Validation de l'email
  if (!data.contactEmail || data.contactEmail.trim() === '') {
    errors.contactEmail = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
    errors.contactEmail = 'Email invalide';
  }

  // Validation de la description
  if (!data.description || data.description.trim() === '') {
    errors.description = 'La description de l\'organisation est requise';
  } else if (data.description.trim().length < 20) {
    errors.description = 'La description doit contenir au moins 20 caractères';
  }

  // Validation des domaines d'intérêt
  if (!data.interestedAreas || data.interestedAreas.length === 0) {
    errors.interestedAreas = 'Sélectionnez au moins un domaine d\'intérêt';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
