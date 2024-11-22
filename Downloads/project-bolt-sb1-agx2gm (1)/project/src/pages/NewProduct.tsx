import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const NewProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    description: '',
    taxPercentage: '0', // Establecer un valor inicial para el taxPercentaje
    category: '',
  });

  const [categories, setCategories] = useState<string[]>([]); // Categorías disponibles
  const [loadingCategories, setLoadingCategories] = useState(false); // Indicador de carga para categorías

  // Obtener categorías desde el servidor
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await fetch('http://localhost:8080/categories');

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        if (data && Array.isArray(data)) {
          // Extraer las descripciones de las categorías
          const categoryDescriptions = data.map((category: { description: string }) => category.description);
          setCategories(categoryDescriptions);
        } else {
          throw new Error('Invalid categories data format');
        }
      } catch (error) {
        toast.error('Failed to load categories');
        console.error(error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { name, quantity, price, description, taxPercentage, category } = formData;

    if (!name || !quantity || !price || !description || !taxPercentage || !category) {
      toast.error('Please fill in all fields');
      return false;
    }

    if (Number(quantity) <= 0 || Number(price) <= 0 || Number(taxPercentage) < 0) {
      toast.error('Quantity, Price, and Tax Percentage must be positive values');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:8080/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Product created successfully');
        setFormData({
          name: '',
          quantity: '',
          price: '',
          description: '',
          taxPercentage: '0', // Restablecer a 0
          category: '',
        }); // Limpiar formulario
      } else {
        toast.error('Failed to create product');
      }
    } catch (error) {
      toast.error('An error occurred while creating the product');
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">New Product</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[ 
          { label: 'Name', type: 'text', name: 'name', value: formData.name },
          { label: 'Quantity', type: 'number', name: 'quantity', value: formData.quantity },
          { label: 'Price', type: 'number', name: 'price', value: formData.price, step: '1' },
          { label: 'Description', type: 'text', name: 'description', value: formData.description },
          { label: 'IVA (%)', type: 'number', name: 'taxPercentage', value: formData.taxPercentage, step: '1' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
            <input
              type={field.type}
              step={field.step || undefined}
              name={field.name}
              value={field.name === 'taxPercentage' ? formData.taxPercentage : field.value} // Mostrar el valor del taxPercentaje correctamente
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2"
            required
          >
            <option value="">Select Category</option>
            {loadingCategories ? (
              <option disabled>Loading categories...</option>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProduct;
