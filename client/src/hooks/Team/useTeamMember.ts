// useTeamMember.ts
import { useState, useEffect } from 'react';
import { getTeamMemberRequest, updateTeamMemberRequest, deleteTeamMemberRequest } from '@/app/api/team';
import { TeamMember } from '@/types/interfaces/TeamMember';

export const useTeamMember = (id: string) => {
    const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTeamMember = async () => {
            try {
                const response = await getTeamMemberRequest(id);
                setTeamMember(response.data);
            } catch (error) {
                setError('Error fetching team member');
            } finally {
                setLoading(false);
            }
        };

        fetchTeamMember();
    }, [id]);

    // Aquí usamos teamMemberId para evitar confusión con id que ya es parte de la función
    const deleteTeamMember = async (teamMemberId: string) => {
        try {
            await deleteTeamMemberRequest(teamMemberId); // Eliminar miembro del equipo por su id
        } catch (error) {
            console.error('Error deleting team member:', error);
        }
    };

    return { teamMember, loading, error, deleteTeamMember };
};
