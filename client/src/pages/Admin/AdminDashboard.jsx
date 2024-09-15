import React from 'react'
import { FaUser, FaUserMinus, FaUserPlus } from 'react-icons/fa'
import { FiActivity, FiMenu } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import Logo from '@/components/atoms/Logo/Logo'
import { AddArtistButton, AddReleaseButton } from '@/components/Button/CircularButtons'
import Navbar from '@/components/Navbar/Navbar'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { useArtists } from '@/contexts/ArtistContext'; // Asegúrate de importar el contexto de artistas
import { useEffect } from 'react'
import { handleEditArtist, handleDeleteArtist } from '@/utils/artistActions';
import EditArtistModal from '@/components/Artist/EditArtistModal'
import { useReleases } from '@/contexts/ReleaseContext'


const Button = ({ onClick, text, colorClass }) => (
  <button
    className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 ${colorClass} text-sm font-bold leading-normal tracking-[0.015em]`}
    onClick={onClick}
  >
    <span className="truncate">{text}</span>
  </button>
)


const ProfileImage = () => (
  <div
    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
    style={{
      backgroundImage:
        'url("https://cdn.usegalileo.ai/stability/34d07dcb-88b2-4284-9481-ff71a462aa2e.png")',
    }}
  />
)

const Sidebar = ({ isOpen, onClose }) => (
  <div
    className={`fixed inset-y-0 left-0 bg-[#122e0f] p-4 transition-transform transform ${isOpen ? 'translate-x-0 z-50' : '-translate-x-full'
      } md:translate-x-0 md:relative md:flex md:h-full md:min-h-[700px] md:flex-col md:justify-between`}
  >
    <button
      onClick={onClose}
      className="md:hidden absolute top-4 right-4 text-white text-2xl"
    >
      <FiMenu />
    </button>
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        <ProfileImage />
        <div className="flex flex-col">
          <h1 className="text-white text-base font-medium leading-normal">Admin Dashboard</h1>
          <p className="text-[#8bd685] text-sm font-normal leading-normal">Manage Users</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <SidebarItem icon={<FaUserPlus size={24} />} text="Create User" />
        <SidebarItem icon={<FaUser size={24} />} text="View Users" active />
        <SidebarItem icon={<FaUser size={24} />} text="Edit User" />
        <SidebarItem icon={<FaUserMinus size={24} />} text="Delete User" />
      </div>
    </div>
  </div>
);

const SidebarItem = ({ icon, text, active }) => (
  <div
    className={`flex items-center gap-3 px-3 py-2 ${active ? 'bg-[#22581d]' : ''}`}
  >
    <div className="text-white">{icon}</div>
    <p className="text-white text-sm font-medium leading-normal">{text}</p>
  </div>
);


const ContentSection = ({ title, children }) => (
  <div className="layout-content-container items-center flex flex-col max-w-[960px] flex-1">
    <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
      {title}
    </h2>
    {children}
  </div>
)

const Table = ({ rows, onEdit, onDelete }) => (
  <div className="flex w-full sm:w-[80%] rounded-xl border h-full border-[#2e7728] bg-[#122e0f]">
    <table className="flex-1 flex flex-col items-center w-[80%]">
      <thead>
        <tr className="bg-[#194116] h-full inline-block relative rounded-t-xl z-0">
          <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">
            Artist Name
          </th>
          <th className="px-4 py-3 text-left text-white w-[400px] text-sm font-medium leading-normal">
            Email
          </th>
          <th className="px-4 py-3 text-left w-60 text-[#8bd685] text-sm font-medium leading-normal">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr className="border-t border-t-[#2e7728]" key={index}>
            <td className="h-[72px] px-4 py-2 w-[400px] text-white text-sm font-normal leading-normal">
              {row.artist_name}
            </td>
            <td className="h-[72px] px-4 py-2 w-[400px] text-[#8bd685] text-sm font-normal leading-normal">
              {row.email}
            </td>
            <td className="px-4 py-2 text-[#8bd685] text-sm font-normal leading-normal">
              <div className="flex space-x-2">
                <button
                  className='text-xl mx-2 text-yellow-400 hover:text-yellow-500'
                  onClick={() => onEdit(row)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => onDelete(row.id)}
                  aria-label='Delete'
                  className='text-red-400 hover:text-red-500 text-xl mx-2'
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentArtist, setCurrentArtist] = useState(null);
  const [currentRelease, setCurrentRelease] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Usar el contexto de artistas
  const { artists, fetchArtists, setArtists } = useArtists();

  const { releases, fetchReleases, setReleases } = useReleases();

  useEffect(() => {
    fetchArtists()
    fetchReleases()
  }, [fetchArtists, fetchReleases]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleDeleteRelease = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar el release?')) {
      try {
        await deleteRelease(id);
        setReleases(prevReleases => prevReleases.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting release:', error);
      }
    }
  };


  const openEditModalForRelease = (release) => {
    setCurrentRelease(release);
    setShowEditModal(true);
  };

  const closeEditModal = async () => {
    setShowEditModal(false);
    if (currentRelease?.id) {
      try {
        const response = await getReleaseRequest(currentRelease.id);
        setCurrentRelease(response.data);
      } catch (error) {
        console.error('Error fetching release:', error);
      }
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#122e0f] dark group/design-root overflow-x-hidden">
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 justify-center mt-16 py-5 px-6">
        <div className="layout-content-container flex flex-col items-center w-[80%] sm:w-full">
          <ContentSection title="Artists">
            <Table
              rows={artists}
              onEdit={(artist) => handleEditArtist(artist.id, setCurrentArtist, setShowEditModal)}
              onDelete={(artistId) => handleDeleteArtist(artistId, setArtists)}
            />
            {/* Modal for editing artist */}
            {showEditModal && (
              <EditArtistModal
                artist={currentArtist}
                onClose={() => setShowEditModal(false)} 
              />
            )}
          </ContentSection>
          <ContentSection title="Releases">
            <Table
              rows={releases}
              onEdit={openEditModalForRelease}
              onDelete={handleDeleteRelease}
            />
            {/* Modal for editing release */}
            {showEditModal && (
              <EditArtistModal
                release={currentRelease}
                artist={currentArtist}
                onClose={closeEditModal}
              />
            )}
          </ContentSection>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
