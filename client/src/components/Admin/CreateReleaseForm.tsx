import { ReleaseFormData } from '@/types/interfaces/Form';
import React, { useState, ChangeEvent, FormEvent } from 'react';


const CreateReleaseForm: React.FC = () => {
  const [formData, setFormData] = useState<ReleaseFormData>({
    release_name: '',
    artist_name: '',
    release_date: '',
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
    setFormData({ release_name: '', artist_name: '', release_date: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="release_name"
          className="block text-sm font-medium text-metallic-gray"
        >
          Release Name
        </label>
        <input
          type="text"
          id="release_name"
          name="release_name"
          value={formData.release_name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-[#0A0A0A] border border-metallic-gray/30 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-metallic-gray"
        />
      </div>
      <div>
        <label
          htmlFor="artist_name"
          className="block text-sm font-medium text-metallic-gray"
        >
          Artist Name
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
          htmlFor="release_date"
          className="block text-sm font-medium text-metallic-gray"
        >
          Release Date
        </label>
        <input
          type="date"
          id="release_date"
          name="release_date"
          value={formData.release_date}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 bg-[#0A0A0A] border border-metallic-gray/30 rounded-md text-white focus:outline-none focus:ring-1 focus:ring-metallic-gray"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-metallic-gray text-black rounded-md hover:bg-white focus:outline-none focus:ring-1 focus:ring-metallic-gray uppercase tracking-wider font-semibold"
      >
        Create Release
      </button>
    </form>
  );
};

export default CreateReleaseForm;
