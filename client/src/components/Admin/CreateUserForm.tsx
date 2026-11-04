import { UserFormData } from '@/types/interfaces/Form';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useArtists } from '@/contexts/ArtistContext';
import { createArtistRequest } from '@/app/api/artists';

interface CreateUserFormProps {
  onCreated?: () => void;
}

const emptyValues: UserFormData = {
  artist_name: '',
  username: '',
  email: '',
  password: '',
};

const CreateUserForm: React.FC<CreateUserFormProps> = ({ onCreated }) => {
  const { t } = useTranslation();
  const { fetchArtists } = useArtists();

  const [formData, setFormData] = useState<UserFormData>(emptyValues);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      await createArtistRequest(formData);
      await fetchArtists();
      setSuccess(t('admin.create_user_success'));
      setFormData(emptyValues);
      onCreated?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || t('errors.createUser'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-metallic-gray">{t('admin.create_user_hint')}</p>
      <div>
        <label
          htmlFor="artist_name"
          className="block text-sm font-medium text-metallic-gray"
        >
          {t('label.artist_name')}
        </label>
        <input
          type="text"
          id="artist_name"
          name="artist_name"
          value={formData.artist_name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-[#0A0A0A] border border-metallic-gray/30 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-metallic-gray"
        />
      </div>
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-metallic-gray"
        >
          {t('label.username')}
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-[#0A0A0A] border border-metallic-gray/30 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-metallic-gray"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-metallic-gray"
        >
          {t('label.email')}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-[#0A0A0A] border border-metallic-gray/30 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-metallic-gray"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-metallic-gray"
        >
          {t('label.password')}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          className="mt-1 block w-full px-3 py-2 bg-[#0A0A0A] border border-metallic-gray/30 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-metallic-gray"
        />
      </div>
      {error && <div className="text-red-400 text-sm">{error}</div>}
      {success && <div className="text-metallic-gray text-sm">{success}</div>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-2 bg-metallic-gray text-black rounded-md hover:bg-white focus:outline-none focus:ring-1 focus:ring-metallic-gray disabled:opacity-50 uppercase tracking-wider font-semibold"
      >
        {t('admin.create_user')}
      </button>
    </form>
  );
};

export default CreateUserForm;
