import { UserFormData } from '@/types/interfaces/Form';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';



const CreateUserForm: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<UserFormData>({
    artist_name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormData({ artist_name: '', email: '', password: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="artist_name"
          className="block text-sm font-medium text-gray-300"
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
          className="mt-1 block w-full px-3 py-2 bg-[#1a3d14] border border-[#2e7728] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#8bd685]"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
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
          className="mt-1 block w-full px-3 py-2 bg-[#1a3d14] border border-[#2e7728] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#8bd685]"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-300"
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
          className="mt-1 block w-full px-3 py-2 bg-[#1a3d14] border border-[#2e7728] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#8bd685]"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-[#2e7728] text-white rounded-md hover:bg-[#3a9934] focus:outline-none focus:ring-2 focus:ring-[#8bd685]"
      >
        {t('admin.create_user')}
      </button>
    </form>
  );
};

export default CreateUserForm;
