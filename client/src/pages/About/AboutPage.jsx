import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import { useTranslation } from 'react-i18next';
import Title from '@/components/atoms/Title/Title';
import Navbar from '@/components/Navbar/Navbar';
import TeamMemberCard from '@/components/Team/TeamMemberCard'; // Adjust the import path as necessary

function AboutPage() {
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState([]); // State to hold team members

  useEffect(() => {
    // Datos locales para los miembros del equipo
    const localTeamMembers = [
      { id: 1, name: 'John Doe', role: 'CEO', bio: 'Leader and visionary.', imageUrl: 'https://example.com/john.jpg' },
      { id: 2, name: 'Jane Smith', role: 'CTO', bio: 'Tech expert and strategist.', imageUrl: 'https://example.com/jane.jpg' },
      { id: 3, name: 'Alice Johnson', role: 'CFO', bio: 'Financial guru and operations leader.', imageUrl: 'https://example.com/alice.jpg' },
      // Agregar más miembros si es necesario
    ];

    setTeamMembers(localTeamMembers); // Establecer los miembros del equipo en el estado
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <section id="about" className="container mx-auto p-4 sm:p-16">
          <Title>{t('aboutSection.title')}</Title>
          <p className="text-sm sm:text-xl">
            <span dangerouslySetInnerHTML={{ __html: t('aboutSection.text') }} />
          </p>

          {/* Información adicional de la empresa */}
          <div className="mt-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              {t('aboutSection.missionTitle')}
            </h2>
            <p className="text-sm sm:text-lg">
              {t('aboutSection.missionText')}
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold mt-8 mb-4">
              {t('aboutSection.visionTitle')}
            </h2>
            <p className="text-sm sm:text-lg">
              {t('aboutSection.visionText')}
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold mt-8 mb-4">
              {t('aboutSection.teamTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"> {/* Grid layout for cards */}
              {teamMembers.map((member) => (
                <TeamMemberCard key={member.id} teamMember={member} /> // Render TeamMemberCard for each member
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default AboutPage;
