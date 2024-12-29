// client/src/components/Team/TeamMemberCard.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next'; // Translation hook
import BaseCard from '../Layout/BaseCard';
import TeamMemberLinks from './TeamMemberLinks'; // Assuming this is another component
import EditTeamMemberModal from './EditTeamMemberModal'; // Assuming this is the edit modal component
import Modal from '../Modal/Modal';
import { TeamMember } from '@/types/interfaces/TeamMember';

interface TeamMemberCardProps {
  teamMember: {
    id: number;
    username: string;
    member_name: string;
    image: string;
    Roles: { label: string }[];
    password: string;
    email: string;
    bio: string;
    position: string;
    twitter_link?: string;
    instagram_link?: string;
    facebook_link?: string;
    soundcloud_link?: string;
    spotify_link?: string;
    youtube_link?: string;
    linkedin_link?: string;
  };
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ teamMember }) => {
  const [currentTeamMember, setCurrentTeamMember] = useState(teamMember);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const { t } = useTranslation(); // Hook for translations

  const handleDelete = () => {
    if (
      window.confirm(
        t('delete_confirmation', { memberName: teamMember.member_name })
      )
    ) {
      // Eliminar miembro del equipo directamente desde los datos locales
      alert(`${teamMember.member_name} has been deleted!`);
      // Aquí puedes manejar la eliminación de los datos localmente si es necesario
    }
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    // Aquí también podrías actualizar los datos locales del miembro editado si es necesario
  };

  const rolesText =
    currentTeamMember.Roles && currentTeamMember.Roles.length > 0
      ? currentTeamMember.Roles.map((role) => role.label).join(' / ')
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

          {/* Botones de edición y eliminación solo si se desea mostrar */}
          <div className="absolute right-2 top-2 flex">
            <button
              className="!px-2"
              aria-label={t('edit_member')}
              onClick={openEditModal}
            >
              <FontAwesomeIcon
                icon={faEdit}
                className="text-yellow-400 hover:text-yellow-500 text-xl"
              />
            </button>

            <button
              className="!px-2"
              onClick={handleDelete}
              aria-label={t('delete_member')}
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="text-red-400 hover:text-red-500 text-xl"
              />
            </button>
          </div>
        </div>

        <Link to={`/team/${currentTeamMember.id}`} className="block relative">
          <h5 className="text-2xl font-bold tracking-tight text-white text-center mb-2">
            {currentTeamMember.member_name}
          </h5>
        </Link>

        <div className="mb-2 text-xl font-bold tracking-tight text-white text-center">
          {rolesText}
        </div>

        <TeamMemberLinks teamMember={currentTeamMember as TeamMember} />
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
