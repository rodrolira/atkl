import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

const ContactForm = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState({ name: '', email: '', description: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(t('error_submitting_form'))
      }

      setFormData({ name: '', email: '', description: '' })
      setFormSubmitted(true)
      console.log(t('form_sent_success'))
    } catch (error) {
      console.error(t('error_submitting_form'), error)
    }
  }

  return (
    <div>
      {formSubmitted && <div className="text-green-500">{t('form_sent_success')}</div>}
      <div className="max-w-md mx-auto rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4 text-center">{t('subscribe')}</h2>
        <p className="text-center mb-4">{t('subscribe_message')}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              {t('name')}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              autoComplete="true"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              {t('email')}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              autoComplete="true"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="description">
              {t('description_optional')}
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between mx-auto">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white mx-auto font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
