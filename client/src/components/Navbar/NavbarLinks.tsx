import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import NavItem from './NavItem';
import links from '@/utils/navbarLinks';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import useActiveNavItem from '@/hooks/useActiveNavItem';

/**
 * Links del navbar de escritorio.
 *
 * Antes esto elegía entre HomeNavbarLinks y OtherPagesNavbarLinks, dos
 * componentes casi idénticos que llevaban su propio estado `activeItem`
 * comparando location.pathname contra `to`. Esa comparación nunca podía
 * acertar con Demo y Contact, porque son anclas (/#demo) y no cambian la ruta.
 * Ahora hay una sola lista y el activo lo resuelve useActiveNavItem, que
 * combina ruta, hash y IntersectionObserver.
 */
const NavbarLinks: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated: adminAuthenticated } = useAdminAuth();
  const activeId = useActiveNavItem();

  const visibles = useMemo(
    () => links.filter((link) => (link.authRequired ? adminAuthenticated : true)),
    [adminAuthenticated]
  );

  return (
    <nav className="hidden h-full w-full items-center justify-end md:flex">
      <ul
        className="m-0 flex list-none flex-row items-center p-0
          space-x-3 sm:space-x-4 md:space-x-6 lg:space-x-8 xl:space-x-10"
      >
        {visibles.map((link) => (
          <NavItem
            key={link.to}
            to={link.to}
            linkId={link.id}
            text={t(`navbar.${link.id}`)}
            isActive={activeId === link.id}
          />
        ))}
      </ul>
    </nav>
  );
};

export default React.memo(NavbarLinks);
