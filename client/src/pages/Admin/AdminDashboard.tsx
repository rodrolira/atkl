// AdminDashboard.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { FiMenu } from 'react-icons/fi';
import Navbar from '@/components/Navbar/Navbar';
import Sidebar from '@/components/Admin/Sidebar';
import ContentSection from '@/components/Admin/ContentSection';
import ArtistsTable from '@/components/Admin/ArtistsTable';
import ReleasesTable from '@/components/Admin/ReleasesTable';
import CreateUserForm from '@/components/Admin/CreateUserForm';
import EditArtistModal from '@/components/Artist/EditArtistModal';
import AddArtistForm from '@/components/Artist/AddArtistForm';
import AddReleaseForm from '@/components/Release/AddRelease/AddReleaseForm';
import EditReleaseModal from '@/components/Release/EditRelease/EditReleaseModal';
import { useArtists } from '@/contexts/ArtistContext';
import { useReleases } from '@/contexts/ReleaseContext';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/Modal/Modal';
import { Artist } from '@/types/interfaces/Artist';
import { Release } from '@/types/interfaces/Release';


const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('users');
  const [currentArtist, setCurrentArtist] = useState<Artist | null>(null);
  const [currentRelease, setCurrentRelease] = useState<Release | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddArtist, setShowAddArtist] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);

  const { t } = useTranslation();
  const { artists, fetchArtists, deleteArtist } = useArtists();
  const { releases, fetchReleases, deleteRelease } = useReleases();


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


  const handleEditArtist = useCallback((artist: Artist) => {
    setCurrentArtist(artist);
    setShowEditModal(true);
  }, []);

  const handleEditRelease = useCallback((release: Release) => {
    setCurrentRelease(release);
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setCurrentArtist(null);
    setCurrentRelease(null);
  }, []);

  const handleDeleteArtist = useCallback(async (id: number) => {
    const artist = artists.find((item) => item.id === id);
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al artista ${artist?.artist_name ?? id}?`)) {
      return;
    }
    try {
      await deleteArtist(id);
      setSelectedArtists((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError(t('errors.deleteArtist'));
    }
  }, [artists, deleteArtist, t]);

  const handleDeleteSelectedArtists = useCallback(async () => {
    if (selectedArtists.length === 0) {
      return;
    }
    if (!window.confirm(`¿Estás seguro de que deseas eliminar ${selectedArtists.length} artista(s)?`)) {
      return;
    }
    try {
      for (const artist of selectedArtists) {
        await deleteArtist(artist.id);
      }
      setSelectedArtists([]);
    } catch {
      setError(t('errors.deleteArtist'));
    }
  }, [selectedArtists, deleteArtist, t]);

  const handleDeleteRelease = useCallback(async (id: number) => {
    const release = releases.find((item) => item.id === id);
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el lanzamiento ${release?.title ?? id}?`)) {
      return;
    }
    try {
      await deleteRelease(id);
    } catch {
      setError(t('errors.deleteRelease'));
    }
  }, [releases, deleteRelease, t]);

  const renderContent = () => {
    switch (currentView) {
      case 'users':
        return (
          <ContentSection title={t('artists')}>
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowAddArtist(true)}
                className="btn btn-save h-10 px-4 font-bold bg-metallic-gray text-black hover:bg-white"
              >
                {t('add_artist')}
              </button>
            </div>
            <ArtistsTable
              artists={artists}
              onEdit={handleEditArtist}
              selectedArtists={selectedArtists}
              setSelectedArtists={setSelectedArtists}
              isDeleteMode={false}
              onDelete={handleDeleteArtist}
            />
          </ContentSection>
        );
      case 'delete-user':
        return (
          <ContentSection title={t('admin.delete_user')}>
            <div className="mb-4">
              <button
                type="button"
                onClick={handleDeleteSelectedArtists}
                disabled={selectedArtists.length === 0}
                className="btn h-10 px-4 font-bold bg-red-500 text-white disabled:opacity-50"
              >
                {t('delete')} ({selectedArtists.length})
              </button>
            </div>
            <ArtistsTable
              artists={artists}
              onEdit={handleEditArtist}
              selectedArtists={selectedArtists}
              setSelectedArtists={setSelectedArtists}
              isDeleteMode={true}
              onDelete={handleDeleteArtist}
            />
          </ContentSection>
        );
      case 'create-user':
        return (
          <ContentSection title={t('admin.add_user')}>
            <CreateUserForm onCreated={fetchArtists} />
          </ContentSection>
        );
      case 'releases':
        return (
          <ContentSection title={t('admin.releases')}>
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setCurrentView('create-release')}
                className="btn btn-save h-10 px-4 font-bold bg-metallic-gray text-black hover:bg-white"
              >
                {t('admin.add_release')}
              </button>
            </div>
            <ReleasesTable
              releases={releases}
              onEdit={handleEditRelease}
              onDelete={handleDeleteRelease}
            />
          </ContentSection>
        );
      case 'create-release':
        return (
          <ContentSection title={t('admin.add_release')}>
            <AddReleaseForm
              open={true}
              closePopup={() => setCurrentView('releases')}
              onReleaseAdded={() => fetchReleases()}
            />
          </ContentSection>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen">
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
      <AddArtistForm
        openPopup={showAddArtist}
        closePopup={() => setShowAddArtist(false)}
        onArtistAdded={() => fetchArtists()}
      />
      {showEditModal && currentArtist && (
        <Modal onClose={closeEditModal}>
          <EditArtistModal
            onClose={closeEditModal}
            id={currentArtist.id}
          />
        </Modal>
      )}
      {showEditModal && currentRelease && (
        <Modal onClose={closeEditModal}>
          <EditReleaseModal
            onClose={closeEditModal}
            id={currentRelease.id}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
