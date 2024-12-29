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
import { useArtists } from '@/contexts/ArtistContext';
import { useReleases } from '@/contexts/ReleaseContext';
import { useTranslation } from 'react-i18next';
import Modal from '@/components/Modal/Modal';
import { Artist } from '@/types/interfaces/Artist';
import { Release } from '@/types/interfaces/Release';


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


  const renderContent = () => {
    switch (currentView) {
      case 'view-users':
        return (
          <ContentSection title={t('artists')}>
            <ArtistsTable
              artists={artists}
              onEdit={handleEditArtist}
              selectedArtists={selectedArtists}
              setSelectedArtists={setSelectedArtists as React.Dispatch<React.SetStateAction<Artist[]>>} // Add this line
              isDeleteMode={true} onDelete={function (id: number): void {
                throw new Error('Function not implemented.');
              } }            />
          </ContentSection>
        );
      case 'create-user':
        return (
          <ContentSection title={t('admin.add_user')}>
            <CreateUserForm />
          </ContentSection>
        );
      case 'view-releases':
        return (
          <ContentSection title={t('admin.releases')}>
            <ReleasesTable releases={releases} onEdit={(release: any) => handleEditRelease(release as Release)} onDelete={function (releaseId: number): void {
              throw new Error('Function not implemented.');
            } } />
          </ContentSection>
        );
      case 'create-release':
        return (
          <ContentSection title={t('admin.add_release')}>
            < > </>
          </ContentSection>
        )
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
      {showEditModal && (currentArtist) && (
        <Modal onClose={closeEditModal}>
          <EditArtistModal
            onClose={closeEditModal}
            id={currentArtist?.id}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
