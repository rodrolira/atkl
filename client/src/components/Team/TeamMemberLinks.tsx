// TeamMemberLinks.tsx
import React from 'react';
import { TeamMember } from '@/types/interfaces/TeamMember';

interface TeamMemberLinksProps {
  teamMember: TeamMember;
}

const TeamMemberLinks: React.FC<TeamMemberLinksProps> = ({ teamMember }) => {
  return (
    <div className="flex justify-center space-x-4 mt-4">
      {teamMember.twitter_link && (
        <a href={teamMember.twitter_link} target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
      )}
      {teamMember.linkedin_link && (
        <a href={teamMember.linkedin_link} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      )}
      {/* Agrega más enlaces según lo necesites */}
    </div>
  );
};

export default TeamMemberLinks;
