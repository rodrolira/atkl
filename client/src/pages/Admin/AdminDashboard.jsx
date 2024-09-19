import React, { useState, useEffect, useCallback } from 'react';
import { FiMenu } from 'react-icons/fi';
import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Admin/Sidebar';
import ContentSection from '@/components/Admin/ContentSection';
import ArtistsTable from '@/components/Admin/ArtistsTable';
import ReleasesTable from '@/components/Admin/ReleasesTable';
import CreateUserForm from '@/components/Admin/CreateUserForm';
import EditArtistModal from '@/components/Artist/EditArtist/EditArtistModal';
import { useArtists } from '@/contexts/ArtistContext';
import { useReleases } from '@/contexts/ReleaseContext';
import { deleteArtistRequest } from '@/app/api/artists'; // Importar función de eliminación
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('view-users'); // default view to 'view-users'
  const [currentArtist, setCurrentArtist] = useState(null);
  const [currentRelease, setCurrentRelease] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [selectedReleases, setSelectedReleases] = useState([]);

  const { t } = useTranslation()
  const { artists, fetchArtists, setArtists } = useArtists();
  const { releases, fetchReleases, setReleases } = useReleases();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchArtists(), fetchReleases()]);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
      }
    };
    fetchData();
  }, [fetchArtists, fetchReleases]);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

  const handleDeleteArtist = async (artistId) => {
    if (window.confirm('Are you sure you want to delete this artist?')) {
      try {
        await deleteArtistRequest(artistId); // Elimina el artista desde la API
        setArtists(prevArtists => prevArtists.filter(artist => artist.id !== artistId)); // Actualiza la lista localmente
      } catch (error) {
        setError('Failed to delete artist. Please try again.');
      }
    }
  };

  const handleEditArtist = useCallback((artist) => {
    setCurrentArtist(artist);
    setShowEditModal(true);
  }, []);

  const handleEditRelease = useCallback((release) => {
    setCurrentRelease(release);
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setCurrentArtist(null);
    setCurrentRelease(null);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'view-users':
        return (
          <ContentSection title="Artists">
            <ArtistsTable
              artists={artists}
              onEdit={handleEditArtist}
              onDelete={handleDeleteArtist}  // Pasar la función de eliminación aquí
              selectedArtists={selectedArtists}
              setSelectedArtists={setSelectedArtists}
            />
          </ContentSection>
        );
      case 'create-user':
        return (
          <ContentSection title="Create User">
            <CreateUserForm />
          </ContentSection>
        );
      case 'view-releases':
        return (
          <ContentSection title="Releases">
            <ReleasesTable
              releases={releases}
              onEdit={handleEditRelease}
            />
          </ContentSection>
        );
      // More cases for 'delete-user', 'create-release', etc.
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#122e0f] text-white min-h-screen">
      <Navbar onMenuClick={toggleSidebar} />
      <div className="flex flex-col md:flex-row h-[calc(100vh-5rem)] mt-20">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onItemClick={setCurrentView}
          currentView={currentView}
        />
        <main className={`flex-1 transition-all duration-300 overflow-y-auto p-4 md:ml-0 ${sidebarOpen ? 'ml-[20%]' : 'ml-[51px]'}`}>
          {!sidebarOpen && (
            <button
              onClick={toggleSidebar}
              className="md:hidden fixed left-0 top-24 z-30 text-white text-2xl p-2 rounded"
              aria-label="Open sidebar"
            >
              <FiMenu className="w-full" />
            </button>
          )}
          {error && (
            <div className="bg-red-500 text-white p-4 mb-4 rounded" role="alert">
              {error}
            </div>
          )}
          {renderContent()}
        </main>
      </div>
      {showEditModal && (currentArtist || currentRelease) && (
        <EditArtistModal
          artist={currentArtist}
          release={currentRelease}
          onClose={closeEditModal}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
