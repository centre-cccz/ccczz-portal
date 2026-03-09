import React from 'react';
import HeroSection from '../components/home/HeroSection';
import MissionSection from '../components/home/MissionSection';
import EventsSection from '../components/home/EventsSection';
import SpacesSection from '../components/home/SpacesSection';

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <MissionSection />
      <EventsSection />
      <SpacesSection />
    </div>
  );
}
