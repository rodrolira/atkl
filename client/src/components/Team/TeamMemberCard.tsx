// client/src/components/Team/TeamMemberCard.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Modal from '@/components/Modal/Modal';
import { getTeamMemberRequest, deleteTeamMemberRequest } from '@/app/api/team';
import { Button } from 'react-bootstrap';
import BaseCard from '../Layout/BaseCard';
import { useTranslation } from 'react-i18next'; // Translation hook
import { TeamMember } from '@/types/interfaces/TeamMember'; // Assuming you have these types defined
import TeamMemberLinks from './TeamMemberLinks'; // Assuming this is another component
import EditTeamMemberModal from './EditTeamMemberModal'; // Assuming this is the edit modal component
import { Role } from '@/types/interfaces/Role';
import { useTeamMember } from '@/hooks/Team/useTeamMember'; // Solo usamos para obtener los datos del miembro
import { useTeamMembers } from '@/hooks/Team/useTeamMembers';

interface TeamMemberCardProps {
  teamMember: TeamMember;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ teamMember }) => {
  const [currentTeamMember, setCurrentTeamMember] = useState<TeamMember>(teamMember);
  const { setTeamMembers } = useTeamMembers(); // Assuming this is a context hook
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const { t } = useTranslation(); // Hook for translations

  useEffect(() => {
    const fetchTeamMember = async () => {
      try {
        const response = await getTeamMemberRequest(teamMember.id);
        setCurrentTeamMember(response.data);
      } catch (error) {
        console.error('Error fetching team member:', error);
      }
    };

    fetchTeamMember();
  }, [teamMember.id]);

  const handleDelete = async () => {
    if (
      window.confirm(
        t('delete_confirmation', { memberName: teamMember.member_name }),
      )
    ) {
      try {
        await deleteTeamMemberRequest(teamMember.id); // Aquí llamamos directamente a la función de eliminació
        setTeamMembers((prevMembers) =>
          prevMembers.filter((m) => m.id !== teamMember.id), // Actualizar lista
        );
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    const fetchTeamMember = async () => {
      try {
        const response = await getTeamMemberRequest(currentTeamMember.id);
        setCurrentTeamMember(response.data);
      } catch (error) {
        console.error('Error fetching team member:', error);
      }
    };
    fetchTeamMember();
  };

  const rolesText = currentTeamMember.Roles && currentTeamMember.Roles.length > 0
    ? currentTeamMember.Roles.map((role: Role) => role.label).join(' / ')
    : t('no_roles_assigned');

  return (
    <>
      <BaseCard>
        <div className="w-full rounded-t-lg relative">
          <Link to={`/team/${currentTeamMember.id}`} className="block relative z-0">
            <img
              className="rounded-t-lg w-full h-auto object-cover"
              src={`http://localhost:3000/${currentTeamMember.image}`}
              alt={currentTeamMember.member_name}
            />
          </Link>

          {adminAuthenticated && (
            <div className="absolute right-2 top-2 flex">
              <Button
                className="!px-2"
                aria-label={t('edit_member')}
                onClick={openEditModal}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-yellow-400 hover:text-yellow-500 text-xl"
                />
              </Button>

              <Button
                className="!px-2"
                onClick={handleDelete}
                aria-label={t('delete_member')}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-red-400 hover:text-red-500 text-xl"
                />
              </Button>
            </div>
          )}
        </div>

        <Link to={`/team/${currentTeamMember.id}`} className="block relative">
          <h5 className="text-2xl font-bold tracking-tight text-white text-center mb-2">
            {currentTeamMember.member_name}
          </h5>
        </Link>

        <div className="mb-2 text-xl font-bold tracking-tight text-white text-center">
          {rolesText}
        </div>

        <TeamMemberLinks teamMember={currentTeamMember} />
      </BaseCard>

      {showEditModal && (
        <Modal onClose={closeEditModal}>
          <EditTeamMemberModal id={currentTeamMember.id.toString()} onClose={closeEditModal} />
        </Modal>
      )}
    </>
  );
};

export default TeamMemberCard;
