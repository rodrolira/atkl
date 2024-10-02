import React, { useState } from 'react';

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    artist_name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your API
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ artist_name: '', email: '', password: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
        >
          Email
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
          Password
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
        Create User
      </button>
    </form>
  );
};

export default CreateUserForm;
