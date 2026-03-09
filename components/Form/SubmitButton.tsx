import React from 'react';

export function SubmitButton({label='Envoyer'}:{label?:string}){
  return <button type="submit" className="btn primary">{label}</button>;
}

export const ContactForm = () => null; // placeholder for import convenience
