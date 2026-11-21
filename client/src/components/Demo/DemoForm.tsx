import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { sendDemoForm } from '@/app/api/demo';
import Button from '@/components/Button/Button';

/**
 * Formulario de envío de demos.
 *
 * Solo links: no se aceptan archivos de audio (Gmail corta en 25 MB y el disco
 * de Render es efímero). El artista pega la URL de SoundCloud privado, Dropbox,
 * Drive o WeTransfer.
 *
 * Las reglas de validación son las mismas que las de
 * server/src/routes/demo-form.routes.js: acá evitan un viaje al servidor, allá
 * son las que mandan.
 */

type Valores = {
  artistName: string;
  email: string;
  country: string;
  trackTitle: string;
  genre: string;
  bpm: string;
  demoLink: string;
  socialLinks: string;
  message: string;
};

type Campo = keyof Valores;
type Errores = Partial<Record<Campo | 'consent', string>>;

const VALORES_INICIALES: Valores = {
  artistName: '',
  email: '',
  country: '',
  trackTitle: '',
  genre: '',
  bpm: '',
  demoLink: '',
  socialLinks: '',
  message: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MENSAJE_MAX = 1000;

const esHttps = (valor: string) => {
  try {
    return new URL(valor).protocol === 'https:';
  } catch {
    return false;
  }
};

const DemoForm: React.FC = () => {
  const { t } = useTranslation();
  const [valores, setValores] = useState<Valores>(VALORES_INICIALES);
  const [consent, setConsent] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  // Honeypot: oculto para una persona, visible para un bot que llena todo.
  const [website, setWebsite] = useState('');

  const validar = (): Errores => {
    const e: Errores = {};

    if (!valores.artistName.trim()) e.artistName = t('demoForm.errors.artistName');
    if (!valores.email.trim()) e.email = t('demoForm.errors.emailRequired');
    else if (!EMAIL_REGEX.test(valores.email.trim())) e.email = t('demoForm.errors.emailInvalid');
    if (!valores.trackTitle.trim()) e.trackTitle = t('demoForm.errors.trackTitle');

    if (!valores.demoLink.trim()) e.demoLink = t('demoForm.errors.demoLinkRequired');
    else if (!esHttps(valores.demoLink.trim())) e.demoLink = t('demoForm.errors.demoLinkHttps');

    if (valores.bpm.trim()) {
      const bpm = Number(valores.bpm);
      if (!Number.isInteger(bpm) || bpm < 60 || bpm > 300) e.bpm = t('demoForm.errors.bpm');
    }

    if (valores.message.length > MENSAJE_MAX) e.message = t('demoForm.errors.message');
    if (!consent) e.consent = t('demoForm.errors.consent');

    return e;
  };

  const handleChange = (
    evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = evento.target;
    setValores((previos) => ({ ...previos, [name]: value }));
    // El error del campo se va al escribir: dejarlo puesto mientras se corrige
    // hace que el formulario se sienta roto.
    setErrores((previos) => ({ ...previos, [name]: undefined }));
  };

  const handleSubmit = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (enviando) return;

    const encontrados = validar();
    if (Object.keys(encontrados).length > 0) {
      setErrores(encontrados);
      setEnviado(false);
      return;
    }

    setEnviando(true);
    setErrorEnvio(null);
    setErrores({});

    try {
      await sendDemoForm({ ...valores, bpm: valores.bpm || undefined, consent, website });
      setValores(VALORES_INICIALES);
      setConsent(false);
      setEnviado(true);
    } catch (error) {
      const respuesta = (error as { response?: { data?: { message?: string; errors?: Errores } } })
        .response;
      // El server valida de nuevo y puede rechazar algo que acá pasó: sus
      // errores por campo se muestran donde corresponde.
      if (respuesta?.data?.errors) setErrores(respuesta.data.errors);
      setErrorEnvio(respuesta?.data?.message || t('demoForm.errors.submit'));
    } finally {
      setEnviando(false);
    }
  };

  /** Cablea id, valor y el ARIA de cada input en un solo lugar. */
  const propsDe = (campo: Campo, tieneAyuda = false) => ({
    id: campo,
    name: campo,
    value: valores[campo],
    onChange: handleChange,
    className: 'input-style w-full px-3 py-2 leading-tight',
    'aria-invalid': errores[campo] ? true : undefined,
    'aria-describedby': errores[campo]
      ? `${campo}-error`
      : tieneAyuda
        ? `${campo}-hint`
        : undefined,
  });

  return (
    <div>
      {enviado && (
        <div
          role="status"
          className="mb-6 border-l-2 border-accent bg-surface p-4 text-sm text-text"
        >
          {t('demoForm.success')}
        </div>
      )}
      {errorEnvio && (
        <div
          role="alert"
          className="mb-6 border-l-2 border-accent bg-surface p-4 text-sm text-text"
        >
          {errorEnvio}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Honeypot. Fuera de pantalla en vez de display:none: algunos bots
            saltean los campos ocultos por CSS. */}
        <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="grid gap-x-6 sm:grid-cols-2">
          <Campo campo="artistName" etiqueta={t('demoForm.artistName')} error={errores.artistName} obligatorio>
            <input {...propsDe('artistName')} type="text" autoComplete="nickname" />
          </Campo>

          <Campo campo="email" etiqueta={t('demoForm.email')} error={errores.email} obligatorio>
            <input {...propsDe('email')} type="email" inputMode="email" autoComplete="email" />
          </Campo>

          <Campo campo="trackTitle" etiqueta={t('demoForm.trackTitle')} error={errores.trackTitle} obligatorio>
            <input {...propsDe('trackTitle')} type="text" />
          </Campo>

          <Campo campo="country" etiqueta={t('demoForm.country')} error={errores.country}>
            <input {...propsDe('country')} type="text" autoComplete="country-name" />
          </Campo>

          <Campo
            campo="genre"
            etiqueta={t('demoForm.genre')}
            error={errores.genre}
            ayuda={t('demoForm.genreHint')}
          >
            <input {...propsDe('genre', true)} type="text" />
          </Campo>

          <Campo campo="bpm" etiqueta={t('demoForm.bpm')} error={errores.bpm}>
            <input {...propsDe('bpm')} type="number" inputMode="numeric" min={60} max={300} step={1} />
          </Campo>
        </div>

        <Campo
          campo="demoLink"
          etiqueta={t('demoForm.demoLink')}
          error={errores.demoLink}
          ayuda={t('demoForm.demoLinkHint')}
          obligatorio
        >
          <input {...propsDe('demoLink', true)} type="url" inputMode="url" placeholder="https://" />
        </Campo>

        <Campo
          campo="socialLinks"
          etiqueta={t('demoForm.socialLinks')}
          error={errores.socialLinks}
          ayuda={t('demoForm.socialLinksHint')}
        >
          <input {...propsDe('socialLinks', true)} type="text" />
        </Campo>

        <Campo
          campo="message"
          etiqueta={t('demoForm.message')}
          error={errores.message}
          ayuda={`${valores.message.length}/${MENSAJE_MAX}`}
        >
          <textarea {...propsDe('message', true)} rows={4} maxLength={MENSAJE_MAX} />
        </Campo>

        <div className="mt-6 border-t border-muted/20 pt-5">
          <div className="flex items-start gap-3">
            <input
              id="consent"
              name="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked);
                setErrores((previos) => ({ ...previos, consent: undefined }));
              }}
              aria-invalid={errores.consent ? true : undefined}
              aria-describedby={errores.consent ? 'consent-error' : undefined}
              className="mt-0.5 h-5 w-5 flex-shrink-0 accent-accent"
            />
            <label htmlFor="consent" className="text-sm leading-snug text-text">
              {t('demoForm.consent')}
            </label>
          </div>
          {errores.consent && (
            <p id="consent-error" role="alert" className="error-message mt-2 text-xs">
              {errores.consent}
            </p>
          )}
        </div>

        <div className="mt-8">
          <Button type="submit" variant="primary" disabled={enviando}>
            {enviando ? t('demoForm.sending') : t('demoForm.send')}
          </Button>
        </div>
      </form>
    </div>
  );
};

/**
 * Fila de la ficha: etiqueta en mono, input, y debajo la ayuda o el error.
 * El error reemplaza a la ayuda en vez de sumarse, para no apilar dos líneas
 * de texto chico bajo cada campo.
 */
const Campo: React.FC<{
  campo: string;
  etiqueta: string;
  error?: string;
  ayuda?: string;
  obligatorio?: boolean;
  children: React.ReactNode;
}> = ({ campo, etiqueta, error, ayuda, obligatorio = false, children }) => {
  const { t } = useTranslation();

  return (
  <div className="mt-6 border-t border-muted/20 pt-4">
    <label
      htmlFor={campo}
      className="mb-2 flex items-baseline justify-between gap-3 font-mono text-xs uppercase tracking-[0.18em]"
    >
      <span className="text-text">
        {etiqueta}
        {obligatorio && (
          <span className="text-accent" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </span>
      {!obligatorio && (
        <span className="text-[0.625rem] text-muted">{t('demoForm.optional')}</span>
      )}
    </label>
    {children}
    {error ? (
      <p id={`${campo}-error`} role="alert" className="error-message mt-1.5 text-xs">
        {error}
      </p>
    ) : (
      ayuda && (
        <p id={`${campo}-hint`} className="mt-1.5 text-xs text-muted">
          {ayuda}
        </p>
      )
    )}
  </div>
  );
};

export default React.memo(DemoForm);
