import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SocialMediaIcons from '@/components/atoms/Icon/SocialMediaIcons';

interface FooterProps {
  isAdminLogin: boolean;
}

type FooterLink = { label: string; to?: string; href?: string };
type FooterColumn = { title: string; links: FooterLink[] };

const SOCIAL = {
  instagram: 'https://www.instagram.com/atkl.records/',
  soundcloud: 'https://soundcloud.com/atkl.records',
  bandcamp: 'https://atklrecords.bandcamp.com',
  youtube: 'https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQyHvryaw',
};

// Antes los links eran la etiqueta ("About Us"), así que el router navegaba a
// "/About Us" y todo el footer caía en el 404. Ahora cada entrada declara su
// destino; las que no tienen destino se muestran como texto.
const SITEMAP: Record<string, FooterColumn[]> = {
  en: [
    {
      title: 'Label',
      links: [
        { label: 'About Us', to: '/about' },
        { label: 'Artists', to: '/artists' },
        { label: 'Releases', to: '/releases' },
        { label: 'Send Demo', to: '/#demo' },
      ],
    },
    {
      title: 'Links',
      links: [
        { label: 'Instagram', href: SOCIAL.instagram },
        { label: 'Soundcloud', href: SOCIAL.soundcloud },
        { label: 'Bandcamp', href: SOCIAL.bandcamp },
        { label: 'YouTube', href: SOCIAL.youtube },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'Booking', to: '/#contact' },
        { label: 'Mastering', to: '/#contact' },
      ],
    },
    {
      title: 'Products',
      links: [{ label: 'Discography', to: '/releases' }],
    },
  ],
  es: [
    {
      title: 'Sello Discográfico',
      links: [
        { label: 'Sobre nosotros', to: '/about' },
        { label: 'Artistas', to: '/artists' },
        { label: 'Lanzamientos', to: '/releases' },
        { label: 'Envía tu Demo', to: '/#demo' },
      ],
    },
    {
      title: 'Redes Sociales',
      links: [
        { label: 'Instagram', href: SOCIAL.instagram },
        { label: 'Soundcloud', href: SOCIAL.soundcloud },
        { label: 'Bandcamp', href: SOCIAL.bandcamp },
        { label: 'YouTube', href: SOCIAL.youtube },
      ],
    },
    {
      title: 'Servicios',
      links: [
        { label: 'Booking', to: '/#contact' },
        { label: 'Mastering', to: '/#contact' },
      ],
    },
    {
      title: 'Productos',
      links: [{ label: 'Discografía', to: '/releases' }],
    },
  ],
};

const currentYear = new Date().getFullYear();

const linkClass =
  'inline-block py-1 transition-transform hover:scale-105 hover:text-metallic-gray focus-visible:outline focus-visible:outline-2 focus-visible:outline-white';

const Footer: React.FC<FooterProps> = React.memo(({ isAdminLogin }) => {
  const { t, i18n } = useTranslation();
  const { language } = i18n;
  const sitemap = SITEMAP[language] || SITEMAP.en;

  const footerClass = isAdminLogin ? 'admin-login-footer' : '';

  return (
    <footer className={`relative footer w-full ${footerClass}`}>
      <div className="mx-auto w-full max-w-full 2xl:max-w-7xl border-t border-metallic-gray/30">
        <div className="mx-auto grid w-full grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {sitemap.map(({ title, links }) => (
            <div key={title} className="w-full">
              <Typography
                variant="h2"
                color="#FFFFFF"
                fontWeight="bold"
                className="mb-4 font-bold uppercase xs:text-3xl md:text-4xl"
              >
                {title}
              </Typography>
              <ul className="space-y-1">
                {links.map(({ label, to, href }) => (
                  <Typography key={label} component="li" color="white" className="font-normal">
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {label}
                      </a>
                    ) : to ? (
                      <Link to={to} className={linkClass}>
                        {label}
                      </Link>
                    ) : (
                      <span className="inline-block py-1">{label}</span>
                    )}
                  </Typography>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col items-center justify-center border-t px-4 border-metallic-gray/30 py-4 md:flex-row md:justify-between">
          <Typography
            variant="body1"
            className="!mb-2 !ms-2 text-center font-normal text-white md:mb-0"
          >
            &copy; {currentYear} ATKL Records. {t('rights_reserved')}
          </Typography>
          <SocialMediaIcons />
        </div>
      </div>
    </footer>
  );
});

export default Footer;
