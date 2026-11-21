/**
 * Tests de POST /api/submit-demo.
 *
 * Nodemailer va mockeado: no hay credenciales de Gmail en CI y no queremos
 * mandar correos de verdad al correr la suite. Lo que se verifica es el
 * contrato de la ruta (qué status devuelve y con qué opciones llama a
 * sendMail), no que Gmail entregue.
 */
import express from 'express'
import request from 'supertest'
import nodemailer from 'nodemailer'

const mockSendMail = jest.fn()

jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(() => ({ sendMail: mockSendMail })),
  },
}))

import demoFormRouter from '../src/routes/demo-form.routes.js'

const app = express()
app.use(express.json())
app.use('/api', demoFormRouter)

const DEMO_VALIDO = {
  artistName: 'Nova',
  email: 'nova@example.com',
  country: 'Chile',
  trackTitle: 'Muro de Kick',
  genre: 'Schranz',
  bpm: '155',
  demoLink: 'https://soundcloud.com/nova/muro-de-kick/s-privado',
  socialLinks: 'https://instagram.com/nova',
  message: 'Hola, mando este tema para el sello.',
  consent: true,
}

beforeEach(() => {
  mockSendMail.mockReset()
  mockSendMail.mockResolvedValue({ response: '250 OK' })
  process.env.EMAIL = 'sello@example.com'
  process.env.DEMOS_EMAIL = 'atkl.demos@gmail.com'
})

describe('envío válido', () => {
  test('responde 200 y manda el correo a DEMOS_EMAIL con replyTo del artista', async () => {
    const res = await request(app).post('/api/submit-demo').send(DEMO_VALIDO)

    expect(res.status).toBe(200)
    expect(mockSendMail).toHaveBeenCalledTimes(1)

    const opciones = mockSendMail.mock.calls[0][0]
    expect(opciones.to).toBe('atkl.demos@gmail.com')
    expect(opciones.from).toBe('sello@example.com')
    // Responder el correo le tiene que escribir al artista, no al sello.
    expect(opciones.replyTo).toBe('nova@example.com')
    expect(opciones.subject).toBe('[DEMO] Nova – Muro de Kick')
    // El link viaja clickeable en el HTML y en texto plano en el fallback.
    expect(opciones.html).toContain(`href="${DEMO_VALIDO.demoLink}"`)
    expect(opciones.text).toContain(DEMO_VALIDO.demoLink)
    expect(opciones.text).toContain('BPM: 155')
  })

  test('sin DEMOS_EMAIL los demos caen en EMAIL en vez de perderse', async () => {
    delete process.env.DEMOS_EMAIL

    const res = await request(app).post('/api/submit-demo').send(DEMO_VALIDO)

    expect(res.status).toBe(200)
    expect(mockSendMail.mock.calls[0][0].to).toBe('sello@example.com')
  })

  test('escapa el HTML de lo que escribe el usuario', async () => {
    await request(app)
      .post('/api/submit-demo')
      .send({ ...DEMO_VALIDO, artistName: '<img src=x onerror=alert(1)>' })

    const { html } = mockSendMail.mock.calls[0][0]
    expect(html).not.toContain('<img src=x')
    expect(html).toContain('&lt;img src=x')
  })

  test('no deja inyectar cabeceras con un salto de línea en el asunto', async () => {
    await request(app)
      .post('/api/submit-demo')
      .send({ ...DEMO_VALIDO, trackTitle: 'Kick\r\nBcc: otro@example.com' })

    expect(mockSendMail.mock.calls[0][0].subject).not.toMatch(/[\r\n]/)
  })
})

describe('validación', () => {
  test.each(['artistName', 'email', 'trackTitle', 'demoLink'])(
    'responde 400 con el error de %s cuando falta y no manda nada',
    async (campo) => {
      const res = await request(app)
        .post('/api/submit-demo')
        .send({ ...DEMO_VALIDO, [campo]: '' })

      expect(res.status).toBe(400)
      expect(res.body.errors[campo]).toBeDefined()
      expect(mockSendMail).not.toHaveBeenCalled()
    }
  )

  test('responde 400 si el link no es una URL', async () => {
    const res = await request(app)
      .post('/api/submit-demo')
      .send({ ...DEMO_VALIDO, demoLink: 'no-es-una-url' })

    expect(res.status).toBe(400)
    expect(res.body.errors.demoLink).toBeDefined()
    expect(mockSendMail).not.toHaveBeenCalled()
  })

  test('rechaza http: el link del correo tiene que ser https', async () => {
    const res = await request(app)
      .post('/api/submit-demo')
      .send({ ...DEMO_VALIDO, demoLink: 'http://soundcloud.com/nova/track' })

    expect(res.status).toBe(400)
    expect(res.body.errors.demoLink).toMatch(/https/)
    expect(mockSendMail).not.toHaveBeenCalled()
  })

  test('responde 400 si consent viene en false', async () => {
    const res = await request(app)
      .post('/api/submit-demo')
      .send({ ...DEMO_VALIDO, consent: false })

    expect(res.status).toBe(400)
    expect(res.body.errors.consent).toBeDefined()
    expect(mockSendMail).not.toHaveBeenCalled()
  })

  test('responde 400 si el BPM no es numérico', async () => {
    const res = await request(app).post('/api/submit-demo').send({ ...DEMO_VALIDO, bpm: 'rapido' })

    expect(res.status).toBe(400)
    expect(res.body.errors.bpm).toBeDefined()
  })

  test('acepta los campos opcionales vacíos', async () => {
    const res = await request(app).post('/api/submit-demo').send({
      artistName: 'Nova',
      email: 'nova@example.com',
      trackTitle: 'Muro de Kick',
      demoLink: 'https://dropbox.com/s/abc/demo.wav',
      country: '',
      genre: '',
      bpm: '',
      socialLinks: '',
      message: '',
      consent: true,
    })

    expect(res.status).toBe(200)
    expect(mockSendMail).toHaveBeenCalledTimes(1)
    // Un campo vacío no aparece como fila huérfana en el correo.
    expect(mockSendMail.mock.calls[0][0].text).not.toMatch(/BPM:/)
  })
})

describe('honeypot', () => {
  test('con el campo oculto lleno responde 200 sin mandar correo', async () => {
    // 200 a propósito: con un error el bot reintenta con otro payload.
    const res = await request(app)
      .post('/api/submit-demo')
      .send({ ...DEMO_VALIDO, website: 'http://spam.example' })

    expect(res.status).toBe(200)
    expect(mockSendMail).not.toHaveBeenCalled()
  })
})

describe('fallo del envío', () => {
  test('responde 500 cuando sendMail se cae', async () => {
    mockSendMail.mockRejectedValue(new Error('SMTP caído'))

    const res = await request(app).post('/api/submit-demo').send(DEMO_VALIDO)

    expect(res.status).toBe(500)
    expect(res.body.message).toMatch(/no se pudo enviar/i)
  })

  test('usa las credenciales de Gmail del entorno', async () => {
    await request(app).post('/api/submit-demo').send(DEMO_VALIDO)

    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ service: 'gmail' })
    )
  })
})
