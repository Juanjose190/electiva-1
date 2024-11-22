import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const NewCategory = () => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const categoryData = { description, status: 1 }; 


    axios
      .post('http://localhost:8080/categories', categoryData)
      .then((response) => {
        toast.success('Category created successfully');
        setDescription('');
      })
      .catch((error) => {
        toast.error('Error creating category');
        console.error('Error creating category:', error);
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Create Category
        </button>
      </form>
    </div>
  );
};

export default NewCategory; 