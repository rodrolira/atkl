import React from 'react';
import LanguageMenu from '@/components/Language/LanguageMenu';
import DemoButton from '@/components/Button/DemoButton';
import NavbarLinks from './NavbarLinks';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useTranslation } from 'react-i18next';
import Button from '@/components/Button/Button';
import AddArtistButton from '@/components/Button/AddArtistButton';
import AddReleaseButton from '@/components/Button/AddReleaseButton';
import AdminLogoutButton from '@/components/Button/AdminLogoutButton';
import {
  AddArtistButton as AddArtistButtonMobile,
  AddReleaseButton as AddReleaseButtonMobile,
  AdminLogoutButton as AdminLogoutButtonMobile,
} from '../Button/CircularButtons';
import AddTeamMemberButton from '@/components/Button/AddTeamMemberButton';

interface NavbarMenuProps {
  isDialogOpen: boolean;
  handleClose: () => void;
  handleArtistAdded: () => void;
}

const NavbarMenu: React.FC<NavbarMenuProps> = ({ isDialogOpen, handleClose, handleArtistAdded }) => {
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const { t } = useTranslation();

  return (
    <div className="xs:flex lg:block hidden justify-start md:justify-end xs:flex-wrap items-center h-full w-full me-3">
      <div className="flex items-end h-12 px-2 flex-col">
        <div className="z-10 flex divide-y rounded-lg text-center items-end h-full">
          <ul
            className="text-sm hidden sm:flex text-white dark:text-white sm:font-normal"
            aria-labelledby="dropdownHoverButton"
          >
            {adminAuthenticated && (
              <>
                <li className="mx-1">
                  <AddArtistButton className="!capitalize" openPopup={isDialogOpen} closePopup={handleClose} onArtistAdded={handleArtistAdded}>
                    {t('add_artist')}
                  </AddArtistButton>
                </li>
                <li className="mx-1">
                  <AddReleaseButton className="btn-add" openPopup={isDialogOpen} closePopup={handleClose} onReleaseAdded={() => {}}>
                    {t('add_release')}
                  </AddReleaseButton>
                </li>
                <li className="mx-1">
                  <AddTeamMemberButton />
                </li>
                <li className="mx-1">
                  <Button
                    to="/admin"
                    className="mx-auto flex justify-center"
                    colorClass="bg-[#22581d] text-white"
                  >
                    {t('navbar.admin_dashboard')}
                  </Button>
                </li>
              </>
            )}
            {!adminAuthenticated && (
              <li className="mx-1 hidden md:block ">
                <DemoButton />
              </li>
            )}
            <li className="mx-1 hidden md:block">
            <LanguageMenu />
            </li>
            {adminAuthenticated && (
              <li className="mx-1">
                <AdminLogoutButton />
              </li>
            )}
          </ul>
        </div>
        {adminAuthenticated && (
          <div className="xs:hidden">
            <AddArtistButtonMobile />
            <AddReleaseButtonMobile />
          </div>
        )}
      </div>
      <NavbarLinks />
    </div>
  );
};

export default NavbarMenu;
