import React from 'react';
import { FaUser, FaUserMinus, FaUserPlus, FaCompactDisc } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

const ProfileImage = () => (
  <div
    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12"
    style={{
      backgroundImage:
        'url("https://cdn.usegalileo.ai/stability/34d07dcb-88b2-4284-9481-ff71a462aa2e.png")',
    }}
  />
);

const SidebarItem = ({ icon, text, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 w-full text-left ${active ? 'bg-[#22581d]' : ''}`}
  >
    <div className="text-white">{icon}</div>
    <p className="text-white text-sm font-medium leading-normal">{text}</p>
  </button>
);

const Sidebar = ({ isOpen, onClose, onItemClick, currentView }) => (
  <div
    className={`fixed inset-y-0 left-0 bg-[#122e0f] p-4 w-64 transition-transform transform ${
      isOpen ? 'translate-x-0' : '-translate-x-[80%]'
    } md:translate-x-0 md:relative md:flex md:flex-col md:justify-between h-[calc(100vh-5rem)] top-20 sm:top-0 z-0`}
  >
    <button
      onClick={onClose}
      className="md:hidden absolute top-4 right-4 text-white text-2xl"
    >
      <FiX />
    </button>
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 ml-8 md:ml-0">
        <ProfileImage />
        <div className="flex flex-col">
          <h1 className="text-white text-base font-medium leading-normal">
            Admin Dashboard
          </h1>
          <p className="text-[#8bd685] text-sm font-normal leading-normal">
            Manage Users
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <SidebarItem
          icon={<FaUser size={24} />}
          text="View Users"
          onClick={() => onItemClick('view-users')}
          active={currentView === 'view-users'}
        />
        <SidebarItem
          icon={<FaUserPlus size={24} />}
          text="Create User"
          onClick={() => onItemClick('create-user')}
          active={currentView === 'create-user'}
        />
        <SidebarItem
          icon={<FaCompactDisc size={24} />}
          text="View Releases"
          onClick={() => onItemClick('view-releases')}
          active={currentView === 'view-releases'}
        />
        <SidebarItem
          icon={<FaCompactDisc size={24} />}
          text="Create Release"
          onClick={() => onItemClick('create-release')}
          active={currentView === 'create-release'}
        />
      </div>
    </div>
  </div>
);

export default Sidebar;
