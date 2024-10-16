// useTeamMembers.ts
import { useState, useEffect } from 'react';
import { getTeamMembersRequest } from '@/app/api/team';
import { TeamMember } from '@/types/interfaces/TeamMember';

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await getTeamMembersRequest();
        setTeamMembers(response.data);
      } catch (error) {
        setError('Error fetching team members');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  return { teamMembers, loading, error, setTeamMembers };
};
