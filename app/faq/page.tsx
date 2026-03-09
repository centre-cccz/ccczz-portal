import React from 'react';

const faqs = [
  {q: 'Comment proposer un projet ?', a: "Utilisez la page 'Soumissions' pour envoyer votre proposition avec un descriptif, fichiers et contacts. L'équipe vous répondra sous 2 semaines."},
  {q: 'Qui peut participer aux ateliers ?', a: 'Les ateliers sont ouverts aux jeunes de 16 à 35 ans, avec certaines sessions pour enfants et professionnels. Vérifiez la description du programme.'},
  {q: 'Comment devenir partenaire ?', a: "Rendez-vous sur la page 'Partenariats' et téléchargez notre dossier. Nous proposons des tunnels dédiés aux sponsors et mécènes."},
  {q: 'Est-ce que le centre prête du matériel ?', a: 'Sur demande et selon disponibilité; les prêts pour projets en partenariat sont prioritaires.'},
  {q: 'Comment accéder à la bibliothèque numérique ?', a: 'La bibliothèque numérique sera accessible via notre portail projet — abonnez-vous à la newsletter pour être informé.'},
];

export default function FaqPage(){
  return (
    <section className="container" style={{paddingTop:16}}>
      <h1>FAQ — Questions fréquentes</h1>
      <div className="faq-grid" style={{marginTop:16}}>
        <div>
          {faqs.map((f, i) => (
            <details key={i}>
              <summary>{f.q}</summary>
              <div style={{marginTop:8}}>{f.a}</div>
            </details>
          ))}
        </div>
        <aside>
          <h3>Projets Avenir</h3>
          <iframe src="/projects.html" title="Projets Avenir" className="projects-iframe" />
        </aside>
      </div>
    </section>
  );
}
