export function validateSubmission(data:any){
  const errors:any = {};
  if(!data.title) errors.title = 'Titre requis';
  return { valid: Object.keys(errors).length === 0, errors };
}
