import React from 'react';

type MissionCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

function MissionCard({ title, description, icon }: MissionCardProps) {
  return (
    <article className="mission-card">
      <div className="mission-icon" aria-hidden="true">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

export default function MissionSection() {
  return (
    <section className="section mission-section">
      <div className="container">
        <div className="mission-head">
          <span className="mission-kicker">NOTRE MISSION</span>
          <h2>Promouvoir la culture congolaise</h2>
          <p>
            Une action institutionnelle pour préserver, transmettre et faire rayonner l’héritage
            congolais auprès de toutes les générations.
          </p>
        </div>
        <div className="mission-grid">
          <MissionCard
            title="Préservation"
            description="Sauvegarder les mémoires, les gestes et les récits qui fondent notre patrimoine."
            icon={
              <svg viewBox="0 0 24 24" role="img" aria-label="Préservation">
                <path d="M12 3l7 3v6c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z" />
                <path d="M8.5 12.5l2.2 2.2 4.8-4.8" />
              </svg>
            }
          />
          <MissionCard
            title="Communauté"
            description="Rassembler artistes, familles et institutions autour d’un lien culturel partagé."
            icon={
              <svg viewBox="0 0 24 24" role="img" aria-label="Communauté">
                <path d="M7.5 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm9 0a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                <path d="M3 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
                <path d="M15 20c0-2.5 2-4.2 4.5-4.2 1.2 0 2.3.3 3.2 1" />
              </svg>
            }
          />
          <MissionCard
            title="Rayonnement"
            description="Porter la culture congolaise au-delà des frontières, avec fierté et exigence."
            icon={
              <svg viewBox="0 0 24 24" role="img" aria-label="Rayonnement">
                <path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9z" />
                <path d="M3 12h18M12 3a12 12 0 0 1 0 18M12 3a12 12 0 0 0 0 18" />
              </svg>
            }
          />
          <MissionCard
            title="Création"
            description="Soutenir les nouvelles voix et l’expression contemporaine."
            icon={
              <svg viewBox="0 0 24 24" role="img" aria-label="Création">
                <path d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.2l5-.7L12 3z" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}
