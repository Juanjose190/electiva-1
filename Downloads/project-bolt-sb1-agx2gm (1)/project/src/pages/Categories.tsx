import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);  
  const [description, setDescription] = useState('');
  const [editingCategory, setEditingCategory] = useState<any | null>(null); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/categories');
        setCategories(response.data);  
      } catch (error) {
        toast.error('Failed to fetch categories');
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      try {
        const response = await axios.put(`http://localhost:8080/categories/${editingCategory.idCategory}`, {
          description,
        });
        toast.success('Category updated successfully');
        setCategories(categories.map(category => 
          category.idCategory === response.data.idCategory ? response.data : category
        ));
      } catch (error) {
        toast.error('Failed to update category');
        console.error('Error updating category:', error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:8080/categories', { description });
        toast.success('Category created successfully');
        setCategories([...categories, response.data]);
      } catch (error) {
        toast.error('Failed to create category');
        console.error('Error creating category:', error);
      }
    }

    setDescription('');
    setEditingCategory(null);
  };

  const handleDelete = async (id: number) => {
    if (typeof id === 'undefined' || id === null || isNaN(id)) {
      toast.error('Invalid category ID');
      console.error('Invalid ID:', id);
      return;
    }

    console.log('Deleting category with id:', id);

    try {
      await axios.delete(`http://localhost:8080/categories/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toast.success('Category deleted successfully');
      setCategories(categories.filter(category => category.idCategory !== id));
    } catch (error) {
      toast.error(`Failed to delete category: ${error.response?.data?.message || error.message}`);
      console.error('Error deleting category:', error);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setDescription(category.description);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Categories</h2>
      
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category, index) => {
              console.log('Category:', category);
              return (
                <tr key={category.idCategory}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{category.description}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => handleDelete(category.idCategory)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            {editingCategory ? 'Update' : 'Create'} Category
          </button>
          {editingCategory && (
            <button
              type="button"
              onClick={() => {
                setDescription('');
                setEditingCategory(null);
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Categories;
