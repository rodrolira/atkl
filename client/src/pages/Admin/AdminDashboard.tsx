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

// Define types for artist, release, and other state-related variables
export interface Artist {
  id: number;
  email: string;
  artist_name: string;
  [key: string]: any; // Include any other artist-related fields
}

interface Release {
  id: number;
  title: string;
  [key: string]: any; // Include any other release-related fields
}

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('view-users');
  const [currentArtist, setCurrentArtist] = useState<Artist | null>(null);
  const [currentRelease, setCurrentRelease] = useState<Release | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
  const [selectedReleases, setSelectedReleases] = useState<Release[]>([]);

  const { t } = useTranslation();
  const { artists, fetchArtists, setArtists } = useArtists();
  const { releases, fetchReleases, setReleases } = useReleases();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchArtists(), fetchReleases()]);
      } catch (error) {
        setError(t('errors.fetchData'));
      }
    };
    fetchData();
  }, [fetchArtists, fetchReleases, t]);

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), []);

  const handleDeleteArtist = async (artistId: number) => {
    if (window.confirm(t('confirmation.deleteArtist'))) {
      try {
        await deleteArtistRequest(artistId.toString()); // Elimina el artista desde la API
        setArtists((prevArtists: Artist[]) =>
          prevArtists.filter((artist: Artist) => artist.id !== artistId),
        ); // Actualiza la lista localmente
      } catch (error) {
        setError(t('errors.deleteArtist'));
      }
    }
  };

  const handleEditArtist = useCallback((artist: Artist) => {
    setCurrentArtist(artist);
    setShowEditModal(true);
  }, []);

  const handleEditRelease = useCallback((release: React.SetStateAction<Release | null>) => {
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
              onDelete={handleDeleteArtist}
              selectedArtists = {[]}
              setSelectedArtists={setSelectedArtists as React.Dispatch<React.SetStateAction<Artist[]>>} // Add this line
              isDeleteMode={true}
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
            <ReleasesTable releases={releases} onEdit={handleEditRelease} onDelete={handleDeleteArtist} />
          </ContentSection>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#122e0f] text-white min-h-screen">
      <Navbar />
      <div className="flex flex-col md:flex-row h-[calc(100vh-5rem)] mt-20">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onItemClick={setCurrentView}
          currentView={currentView}
        />
        <main
          className={`flex-1 transition-all duration-300 overflow-y-auto p-4 md:ml-0 ${sidebarOpen ? 'ml-[20%]' : 'ml-[51px]'}`}
        >
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
            <div
              className="bg-red-500 text-white p-4 mb-4 rounded"
              role="alert"
            >
              {error}
            </div>
          )}
          {renderContent()}
        </main>
      </div>
      {showEditModal && (currentArtist || currentRelease) && (
        <EditArtistModal
          onClose={closeEditModal} id={currentArtist?.id || currentRelease?.id} />
      )}
    </div>
  );
};

export default AdminDashboard;
