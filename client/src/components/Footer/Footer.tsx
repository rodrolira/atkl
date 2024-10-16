import React from 'react';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SocialMediaIcons from '@/components/atoms/Icon/SocialMediaIcons';

interface FooterProps {
  isAdminLogin: boolean;
}

const SITEMAP: Record<string, { title: string; links: string[] }[]> = {
  en: [
    {
      title: 'Label',
      links: ['About Us', 'Artists', 'Releases', 'Send Demo'],
    },
    {
      title: 'Links',
      links: ['Instagram', 'Soundcloud', 'Beatport', 'Bandcamp'],
    },
    {
      title: 'Services',
      links: ['Booking', 'Mastering', 'Free Releases', 'Affiliate Program'],
    },
    {
      title: 'Products',
      links: ['Events', 'Discography', 'Merchandising', 'Sample Packs'],
    },
  ],
  es: [
    {
      title: 'Sello Discográfico',
      links: ['Sobre nosotros', 'Artistas', 'Lanzamientos', 'Envía tu Demo'],
    },
    {
      title: 'Redes Sociales',
      links: ['Instagram', 'Soundcloud', 'Beatport', 'Bandcamp'],
    },
    {
      title: 'Servicios',
      links: [
        'Booking',
        'Mastering',
        'Lanzamientos gratuitos',
        'Programa de afiliados',
      ],
    },
    {
      title: 'Productos',
      links: ['Eventos', 'Discografía', 'Merchandising', 'Pack de Samples'],
    },
  ],
};

const currentYear = new Date().getFullYear();

const Footer: React.FC<FooterProps> = ({ isAdminLogin }) => {
  const { t, i18n } = useTranslation();
  const { language } = i18n;
  const sitemap = SITEMAP[language] || SITEMAP.en;

  const footerClass = isAdminLogin ? 'admin-login-footer' : '';

  return (
    <footer className={`relative footer w-full ${footerClass}`}>
      <div className="mx-auto w-full max-w-full 2xl:max-w-7xl border-t border-green-600">
        <div className="mx-auto grid w-full grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {sitemap.map(({ title, links }, index) => (
            <div key={index} className="w-full">
              <Typography
                variant="h6"
                color="green"
                className="mb-4 font-bold uppercase opacity-50"
              >
                {t(title)}
              </Typography>
              <ul className="space-y-1">
                {links.map((link, linkIndex) => (
                  <Typography
                    key={linkIndex}
                    component="li"
                    color="white"
                    className="font-normal"
                  >
                    <Link
                      to={link}
                      className="inline-block py-1 transition-transform hover:scale-105"
                    >
                      {t(link)}
                    </Link>
                  </Typography>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex w-full flex-col items-center justify-center border-t px-4 border-green-600 py-4 md:flex-row md:justify-between">
          <Typography
            variant="body1"
            className="!mb-2 !ms-2 text-center font-normal text-white md:mb-0"
          >
            &copy; {currentYear}{' '}
            <Link
              to="https://material-tailwind.com/"
              className="hover:text-green-600"
            >
              ATKL Records
            </Link>
            . {t('All Rights Reserved.')}
          </Typography>
          <SocialMediaIcons />
        </div>
      </div>
    </footer>
  );
};

export default Footer;