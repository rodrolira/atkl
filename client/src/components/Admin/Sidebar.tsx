import React from 'react';
import { FaUser, FaUserMinus, FaUserPlus, FaCompactDisc } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

interface ProfileImageProps { }

const ProfileImage: React.FC<ProfileImageProps> = () => (
  <div
    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12"
    style={{
      backgroundImage:
        'url("https://cdn.usegalileo.ai/stability/34d07dcb-88b2-4284-9481-ff71a462aa2e.png")',
    }}
  />
);

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 w-full text-left ${active ? 'bg-[#22581d]' : ''}`}
  >
    <div className="text-white">{icon}</div>
    <p className="text-white text-sm font-medium leading-normal">{text}</p>
  </button>
);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onItemClick: (view: string) => void;
  currentView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onItemClick, currentView }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`mt-6 fixed inset-y-0 left-0 bg-[#122e0f] p-4 w-64 transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-[80%]'
        } md:translate-x-0 md:relative md:flex md:flex-col md:justify-between lg:justify-start h-[calc(100vh-5rem)] top-20 sm:top-0 z-0`}
    >
      <button onClick={onClose} className="md:hidden absolute top-4 right-4 text-white text-2xl"
      >
        <FiX size={24} />
      </button>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 ml-8 md:ml-0">
          <ProfileImage />
          <div className="flex flex-col">
            <h1 className="text-white text-base font-medium leading-normal">
              {t('admin.admin_dashboard')}
            </h1>
            <p className="text-[#8bd685] text-sm font-normal leading-normal">
              {t('admin.manage_users')}
            </p>
          </div>
        </div>
      </div>

      <nav>
        <SidebarItem
          icon={<FaUser />}
          text={t('admin.users')}
          onClick={() => onItemClick('users')}
          active={currentView === 'users'}
        />
        <SidebarItem
          icon={<FaUserPlus />}
          text={t('admin.create_user')}
          onClick={() => onItemClick('create-user')}
          active={currentView === 'create-user'}
        />
        <SidebarItem
          icon={<FaUserMinus />}
          text={t('admin.delete_user')}
          onClick={() => onItemClick('delete-user')}
          active={currentView === 'delete-user'}
        />
        <SidebarItem
          icon={<FaCompactDisc />}
          text={t('admin.releases')}
          onClick={() => onItemClick('releases')}
          active={currentView === 'releases'}
        />
      </nav>
    </div>
  );
};

export default Sidebar;
