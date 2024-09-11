import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        english: 'English',
        spanish: 'Spanish',
        logout: 'Logout',
        subscribe: 'Subscribe',
        name: 'Name',
        email: 'Email',
        description: 'Description (Optional)',
        submit: 'Submit',
        subscribe_message: 'Subscribe to receive the latest releases for free by email',
        description_optional: 'Description (Optional)',
        form_sent_success: 'Form successfully submitted',
        send_demo: 'Send Demo',
        upload_cover_image: 'Upload Cover Image',
        upload_profile_image: 'Upload Profile Image',
        artistName: 'Artist Name',
        image: 'Image',
        bandcamp_link: 'Bandcamp Link',
        facebook_link: 'Facebook Link',
        instagram_link: 'Instagram Link',
        soundcloud_link: 'SoundCloud Link',
        twitter_link: 'Twitter Link',
        youtube_link: 'YouTube Link',
        spotify_link: 'Spotify Link',
        beatport_link: 'Beatport Link',
        apple_music_link: 'Apple Music Link',
        languageMenu: {
          english: 'EN',
          spanish: 'ES',
          language: 'EN'
        },
        aboutSection: {
          title: 'About',
          text: "ATKL Records, founded by <a href=\"https://soundcloud.com/rodro_music\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"hover:text-red-500\">RODRO</a> in December 2022 in Chile, is characterized by its distinctive blend of hardcore techno, industrial, and schranz genres, known for their heavy, energetic, and dynamic soundscapes. The label's inaugural release, \"<a href=\"https://open.spotify.com/album/unknown-va-i\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"hover:text-red-500\">Unknown VA I</a>\", a compilation featuring 10 emerging artists from Chile, Colombia, and Spain, was launched in March 2023, marking the beginning of its journey. Since then, ATKL Records has grown to showcase over 12 diverse releases and hosts two popular podcasts on SoundCloud, highlighting both established and up-and-coming talents in the global electronic music scene. In mid-2023, the label expanded its influence by organizing energetic events and parties, further solidifying its role not only as a record label but also as a vibrant community hub where local DJs and music enthusiasts converge."
        },
        contactSection: {
          title: 'Contact Us'
        },
        footer: {
          label: 'Sitemap',
          aboutUs: 'About Us',
          artists: 'Artists',
          releases: 'Releases',
          sendDemo: 'Send Demo',
          instagram: 'Instagram',
          soundcloud: 'SoundCloud',
          beatport: 'Beatport',
          bandcamp: 'Bandcamp',
          booking: 'Booking',
          mastering: 'Mastering',
          freeReleases: 'Free Releases',
          affiliateProgram: 'Affiliate Program',
          events: 'Events',
          discography: 'Discography',
          merchandising: 'Merchandising',
          samplePacks: 'Sample Packs',
          rightsReserved: 'All Rights Reserved'
        },
        login: {
          email: 'Email Address',
          password: 'Password',
          login: 'Login',
          failed: 'Login failed. Please check your credentials and try again.',
          welcome: 'Welcome to ATKL Records',
        },
        addArtist: {
          title: 'Add Artist',
          username: 'Username',
          password: 'Password',
          bio: 'Bio',
          selectRole: 'Select Role',
          role: {
            role: 'Role',
            dj: 'DJ',
            producer: 'Producer'
          },
          validation: {
            artistNameRequired: 'Artist name is required',
            usernameRequired: 'Username is required',
            emailRequired: 'Email is required',
            invalidEmail: 'Invalid email address',
            passwordRequired: 'Password is required',
            passwordMin: 'Password must be at least 6 characters',
            roleRequired: 'At least one role is required',
          },
          label: {
            artist_name: 'Artist Name',
            username: 'Username',
            password: 'Password',
            email: 'Email',
            bio: 'Bio',
            role: 'Role',
            dj: 'DJ',
            producer: 'Producer'
          }
        },
      },
    },
    es: {
      translation: {
        english: 'Inglés',
        spanish: 'Español',
        logout: 'Cerrar sesión',
        subscribe: 'Suscribirse',
        name: 'Nombre',
        email: 'Correo electrónico',
        description: 'Descripción (Opcional)',
        submit: 'Enviar',
        subscribe_message: 'Suscríbete para recibir las últimas actualizaciones gratis por correo electrónico',
        description_optional: 'Descripción (Opcional)',
        form_sent_success: 'Formulario enviado con éxito',
        send_demo: 'Enviar Demo',
        upload_cover_image: 'Subir Portada',
        upload_profile_image: 'Subir Imagen de Perfil',
        artistName: 'Nombre del Artista',
        image: 'Imagen',
        bandcamp_link: 'Enlace de Bandcamp',
        facebook_link: 'Enlace de Facebook',
        instagram_link: 'Enlace de Instagram',
        soundcloud_link: 'Enlace de SoundCloud',
        twitter_link: 'Enlace de Twitter',
        youtube_link: 'Enlace de YouTube',
        spotify_link: 'Enlace de Spotify',
        beatport_link: 'Enlace de Beatport',
        apple_music_link: 'Enlace de Apple Music',
        languageMenu: {
          english: 'EN',
          spanish: 'ES',
          language: 'ES'
        },
        aboutSection: {
          title: 'Acerca de',
          text: 'ATKL Records, fundada por <a href="https://soundcloud.com/rodro_music" target="_blank" rel="noopener noreferrer" class="hover:text-red-500">RODRO</a> en diciembre de 2022 en Chile, se caracteriza por su distintiva fusión de géneros como hardcore techno, industrial y schranz, reconocidos por sus paisajes sonoros pesados, energéticos y dinámicos. El primer lanzamiento del sello, "<a href="https://open.spotify.com/album/unknown-va-i" target="_blank" rel="noopener noreferrer" class="hover:text-red-500">Unknown VA I</a>", un compilado que incluye a 10 artistas emergentes de Chile, Colombia y España, se lanzó en marzo de 2023, marcando el inicio de su trayectoria. Desde entonces, ATKL Records ha crecido hasta exhibir más de 12 lanzamientos diversos y cuenta con dos podcasts populares en SoundCloud, destacando tanto talentos establecidos como prometedores en la escena global de la música electrónica. A mediados de 2023, el sello expandió su influencia al organizar eventos y fiestas enérgicas, consolidando aún más su rol no solo como sello discográfico sino también como un vibrante punto de encuentro comunitario donde DJs locales y entusiastas de la música convergen.'
        },
        contactSection: {
          title: 'Contáctanos'
        },
        footer: {
          label: 'Mapa del sitio',
          aboutUs: 'Sobre Nosotros',
          artists: 'Artistas',
          releases: 'Lanzamientos',
          sendDemo: 'Enviar Demo',
          instagram: 'Instagram',
          soundcloud: 'SoundCloud',
          beatport: 'Beatport',
          bandcamp: 'Bandcamp',
          booking: 'Booking',
          mastering: 'Mastering',
          freeReleases: 'Lanzamientos Gratuitos',
          affiliateProgram: 'Programa de Afiliados',
          events: 'Eventos',
          discography: 'Discografía',
          merchandising: 'Merchandising',
          samplePacks: 'Paquetes de Muestras',
          rightsReserved: 'Todos los Derechos Reservados'
        },
        login: {
          email: 'Correo electrónico',
          password: 'Contraseña',
          login: 'Iniciar sesión',
          failed: 'Inicio de sesión fallido. Por favor, verifica tus credenciales y vuelve a intentarlo.',
          welcome: 'Bienvenido a ATKL Records',
        },
        addArtist: {
          title: 'Agregar Artista',
          username: 'Nombre de Usuario',
          password: 'Contraseña',
          bio: 'Bio',
          role: {
            role: 'Rol',
            dj: 'DJ',
            producer: 'Productor'
          },
          selectRole: 'Seleccionar Rol',
          validation: {
            artistNameRequired: 'El nombre del artista es requerido',
            usernameRequired: 'El nombre de usuario es requerido',
            emailRequired: 'El correo electrónico es requerido',
            invalidEmail: 'Correo electrónico inválido',
            passwordRequired: 'La contraseña es requerida',
            passwordMin: 'La contraseña debe tener al menos 6 caracteres',
            roleRequired: 'Se requiere al menos un rol',

          },
          label: {
            artist_name: 'Nombre del Artista',
            username: 'Nombre de Usuario',
            password: 'Contraseña',
            email: 'Correo electrónico',
            bio: 'Bio',
            role: 'Rol',
            dj: 'DJ',
            producer: 'Productor'
          }
        },

      }

    }
  },
  lng: 'en', // idioma por defecto
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // React ya se encarga de esto
  }
})

export default i18n
