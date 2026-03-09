export function validateContact(data: any) {
  const errors: any = {};

  // Validation du nom
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Le nom est requis';
  }

  // Validation de l'email
  if (!data.email || data.email.trim() === '') {
    errors.email = 'L\'email est requis';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email invalide';
  }

  // Validation du message
  if (!data.message || data.message.trim() === '') {
    errors.message = 'Le message est requis';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Le message doit contenir au moins 10 caractères';
  }

  // Validation conditionnelle pour partenaires
  if (data.userType === 'partner' && (!data.organizationName || data.organizationName.trim() === '')) {
    errors.organizationName = 'Le nom de l\'organisation est requis pour les partenaires';
  }

  // Validation conditionnelle pour artistes
  if (data.userType === 'artist' && data.portfolio && !/^https?:\/\/.+/.test(data.portfolio)) {
    errors.portfolio = 'URL du portfolio invalide';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
