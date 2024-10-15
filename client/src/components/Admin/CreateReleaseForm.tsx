import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  release_name: string;
  artist_name: string;
  release_date: string;
}

const CreateReleaseForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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
          className="block text-sm font-medium text-gray-300"
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
          className="mt-1 block w-full px-3 py-2 bg-[#1a3d14] border border-[#2e7728] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#8bd685]"
        />
      </div>
      <div>
        <label
          htmlFor="artist_name"
          className="block text-sm font-medium text-gray-300"
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
          className="mt-1 block w-full px-3 py-2 bg-[#1a3d14] border border-[#2e7728] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#8bd685]"
        />
      </div>
      <div>
        <label
          htmlFor="release_date"
          className="block text-sm font-medium text-gray-300"
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
          className="mt-1 block w-full px-3 py-2 bg-[#1a3d14] border border-[#2e7728] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#8bd685]"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-[#2e7728] text-white rounded-md hover:bg-[#3a9934] focus:outline-none focus:ring-2 focus:ring-[#8bd685]"
      >
        Create Release
      </button>
    </form>
  );
};

export default CreateReleaseForm;
