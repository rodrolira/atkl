/**
 * POST /api/submit-demo — recibe demos del formulario del sitio y las manda por
 * correo a DEMOS_EMAIL.
 *
 * Solo links: Gmail corta los adjuntos en 25 MB y subir WAVs a Render (disco
 * efímero, plan free) se cae con cualquier archivo serio. El artista sube el
 * tema donde quiera (SoundCloud privado, Dropbox, Drive, WeTransfer) y acá
 * viaja la URL.
 *
 * El rate limit vive en app.js (demoLimiter), igual que el del formulario de
 * contacto.
 */
import express from 'express'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { loadEnv } from '../../config/loadEnv.js'

loadEnv()

const router = express.Router()

/** Campos que terminan en cabeceras del correo: un \r\n acá inyecta cabeceras. */
const sinSaltos = (valor) => String(valor).replace(/[\r\n]+/g, ' ').trim()

/** Todo lo que viene del usuario se escapa antes de entrar al HTML del correo. */
const escaparHtml = (valor) =>
  String(valor).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  )

/** '' y undefined son lo mismo para un campo opcional: ausente. */
const opcional = (esquema) =>
  z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), esquema.optional())

const demoSchema = z.object({
  artistName: z.string().trim().min(1, 'El nombre artístico es obligatorio').max(120),
  email: z.string().trim().min(1, 'El correo es obligatorio').email('Correo electrónico inválido'),
  country: opcional(z.string().trim().max(80)),
  trackTitle: z.string().trim().min(1, 'El título del track es obligatorio').max(200),
  genre: opcional(z.string().trim().max(120)),
  // Llega como string desde el <input type="number">; coerce lo pasa a número.
  bpm: opcional(
    z.coerce
      .number({ invalid_type_error: 'El BPM debe ser un número' })
      .int('El BPM debe ser un número entero')
      .min(60, 'BPM fuera de rango (60-300)')
      .max(300, 'BPM fuera de rango (60-300)')
  ),
  demoLink: z
    .string()
    .trim()
    .min(1, 'El link del demo es obligatorio')
    .url('Ingresa una URL válida')
    // Solo https: un link http en el correo es un click a texto plano, y
    // además descarta de entrada los `javascript:` y `data:`.
    .refine((url) => url.toLowerCase().startsWith('https://'), 'El link tiene que empezar con https://'),
  socialLinks: opcional(z.string().trim().max(500)),
  message: opcional(z.string().trim().max(1000, 'El mensaje no puede pasar de 1000 caracteres')),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Tenés que confirmar que el tema es tuyo y original' }),
  }),
  // Honeypot: invisible en el formulario, así que solo lo llena un bot.
  website: z.string().max(200).optional(),
})

router.post('/submit-demo', async (req, res) => {
  // El bot se va con un 200: si recibe un error, reintenta con otro payload.
  if (req.body?.website) {
    return res.status(200).json({ message: 'Demo recibido' })
  }

  const parsed = demoSchema.safeParse(req.body)

  if (!parsed.success) {
    // Un mensaje por campo: es lo que el formulario muestra bajo cada input.
    const errors = {}
    for (const issue of parsed.error.issues) {
      const campo = issue.path[0]
      if (campo && !errors[campo]) errors[campo] = issue.message
    }
    return res.status(400).json({ message: 'Revisá los datos del formulario', errors })
  }

  const { artistName, email, country, trackTitle, genre, bpm, demoLink, socialLinks, message } =
    parsed.data

  // Sin DEMOS_EMAIL los demos caen en la cuenta del sello en vez de perderse.
  const destinatario = process.env.DEMOS_EMAIL || process.env.EMAIL

  const campos = [
    ['Artista', artistName],
    ['Correo', email],
    ['País', country],
    ['Track', trackTitle],
    ['Género', genre],
    ['BPM', bpm],
    ['Redes', socialLinks],
    ['Mensaje', message],
  ].filter(([, valor]) => valor !== undefined && valor !== '')

  const texto = [
    ...campos.map(([etiqueta, valor]) => `${etiqueta}: ${valor}`),
    `Demo: ${demoLink}`,
  ].join('\n')

  const html = `
    <h2 style="font-family:sans-serif">Nuevo demo: ${escaparHtml(artistName)} – ${escaparHtml(trackTitle)}</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${campos
        .map(
          ([etiqueta, valor]) =>
            `<tr><td style="padding:4px 12px 4px 0;vertical-align:top"><strong>${etiqueta}</strong></td>` +
            `<td style="padding:4px 0">${escaparHtml(valor)}</td></tr>`
        )
        .join('')}
      <tr><td style="padding:4px 12px 4px 0"><strong>Demo</strong></td>
      <td style="padding:4px 0"><a href="${escaparHtml(demoLink)}">${escaparHtml(demoLink)}</a></td></tr>
    </table>
  `

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    })

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: destinatario,
      // Responder el correo le escribe al artista, no a la cuenta del sello.
      replyTo: email,
      subject: sinSaltos(`[DEMO] ${artistName} – ${trackTitle}`),
      text: texto,
      html,
    })

    console.log('Demo enviado:', info.response)
    res.status(200).json({ message: 'Demo recibido' })
  } catch (error) {
    console.error('Error enviando el demo:', error)
    res.status(500).json({ message: 'No se pudo enviar el demo' })
  }
})

export default router
