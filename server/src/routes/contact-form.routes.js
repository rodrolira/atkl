import express from 'express'
import nodemailer from 'nodemailer'
import { loadEnv } from '../../config/loadEnv.js'

loadEnv()

const router = express.Router()

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/submit-form', async (req, res) => {
    const { name, email, description } = req.body

    // Validar campos obligatorios
    if (!name || !email || !description) {
        return res.status(400).json({ message: 'name, email y description son obligatorios' })
    }

    // Validar formato de email
    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ message: 'Formato de email inválido' })
    }

    // Sanitizar campos para prevenir inyección de encabezados de email
    const safeName = String(name).replace(/[\r\n]/g, ' ').trim()
    const safeDescription = String(description).replace(/[\r\n]/g, ' ').trim()

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_APP_PASSWORD
            }
        })

        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL, // Enviar siempre a la cuenta del propietario, no al email del usuario
            replyTo: email,        // El usuario queda en reply-to para poder responder
            subject: 'Nuevo formulario de contacto',
            text: `Nombre: ${safeName}\nCorreo electrónico: ${email}\nDescripción: ${safeDescription}`
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent:', info.response)
        res.status(200).json({ message: 'Form submitted successfully' })
    } catch (error) {
        console.error('Error sending email:', error)
        res.status(500).json({ message: 'Error sending email' })
    }
})

export default router
