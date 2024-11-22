import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

// Definición de la interfaz Product
interface Product {
  idProduct: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  taxPercentage: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Cargar productos desde la API
  useEffect(() => {
    fetch("http://localhost:8080/products")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched products:", data);
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Función para eliminar un producto
  const handleDelete = async (productId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/products/${productId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Product deleted successfully");
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.idProduct !== productId)
        );
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred while deleting the product");
    }
  };

  // Función para editar un producto
  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditing(true);
  };

  // Guardar los cambios de edición
  const handleEditSave = async () => {
    if (selectedProduct) {
      try {
        const response = await fetch(`http://localhost:8080/products/${selectedProduct.idProduct}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedProduct),
        });
        if (response.ok) {
          toast.success("Product updated successfully");
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.idProduct === selectedProduct.idProduct ? selectedProduct : product
            )
          );
          setIsEditing(false);
          setSelectedProduct(null);
        } else {
          toast.error("Failed to update product");
        }
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("An error occurred while updating the product");
      }
    }
  };

  // Calcular el precio total con impuestos
  const calculateTotalPrice = (price: number, quantity: number, taxPercentage: number) => {
    return price * quantity * (1 + taxPercentage / 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Products</h2>

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total (with Tax)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.idProduct}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.idProduct}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.price}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.description}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{product.taxPercentage}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {calculateTotalPrice(product.price, product.quantity, product.taxPercentage).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <button onClick={() => handleEditClick(product)} className="text-indigo-600 hover:text-indigo-900">
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.idProduct)}
                    className="ml-4 text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && selectedProduct && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={selectedProduct.name}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={selectedProduct.description}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={selectedProduct.price}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                type="number"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={selectedProduct.quantity}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: parseInt(e.target.value) })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Tax Percentage</label>
              <input
                type="number"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                value={selectedProduct.taxPercentage}
                onChange={(e) => setSelectedProduct({ ...selectedProduct, taxPercentage: parseFloat(e.target.value) })}
              />
            </div>
            <div className="mb-4">
              <button
                type="button"
                onClick={handleEditSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Products;
