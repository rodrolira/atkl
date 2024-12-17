import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface FormData {
  name: string;
  email: string;
  description: string;
}

const ContactForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    description: '',
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:3000/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(t('error_submitting_form'));
      }

      setFormData({ name: '', email: '', description: '' });
      setFormSubmitted(true);
      console.log(t('form_sent_success'));
    } catch (error) {
      console.error(t('error_submitting_form'), error);
    }
  };

  return (
    <div>
      {formSubmitted && (
        <div className="text-green-600 font-bold text-center bg-green-100 w-fit p-2 mx-auto rounded">{t('form_sent_success')}</div>
      )}
      <div className="max-w-md mx-auto rounded sm:px-8 sm:pt-6 sm:pb-8 p-4 mb-4">
        <h2 className="text-2xl font-bold mb-4 text-center">{t('subscribe')}</h2>
        <p className="text-center mb-4">{t('subscribe_message')}</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="name">
              {t('name')}
            </label>
            <input
              className="shadow appearance-none border border-purple-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="shadow appearance-none border border-purple-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              className="shadow appearance-none border border-purple-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between mx-auto">
            <button
              disabled={isSubmitting}
              className="bg-[#881CBA] hover:bg-purple-700 text-white mx-auto font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {isSubmitting ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(ContactForm);
