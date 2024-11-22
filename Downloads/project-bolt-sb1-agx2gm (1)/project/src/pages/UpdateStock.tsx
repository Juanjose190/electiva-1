import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Product {
 idProduct: number;
 name: string;
 description: string;
 price: number;
 quantity: number;
 taxPercentage: number;
 category: string;
}

const UpdateStock = () => {
 const [products, setProducts] = useState<Product[]>([]);
 const [selectedProduct, setSelectedProduct] = useState<string>('');
 const [currentStock, setCurrentStock] = useState<number>(0);
 const [newStock, setNewStock] = useState<string>('');

 const fetchProducts = async () => {
   try {
     const response = await axios.get('http://localhost:8080/products');
     setProducts(response.data);
   } catch (error) {
     console.error('Error fetching products', error);
     toast.error('Failed to load products');
   }
 };

 useEffect(() => {
   fetchProducts();
 }, []);

 useEffect(() => {
   if (selectedProduct) {
     const fetchStock = async () => {
       try {
         const response = await axios.get(
           `http://localhost:8080/products/${selectedProduct}`
         );
         setCurrentStock(response.data.quantity);
       } catch (error) {
         console.error('Error fetching stock', error);
         toast.error('Failed to load stock information');
       }
     };

     fetchStock();
   }
 }, [selectedProduct]);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();

   if (newStock === '') {
     toast.error('Please enter a new stock value');
     return;
   }

   const updatedStock = parseInt(newStock);

   if (isNaN(updatedStock)) {
     toast.error('Invalid stock value');
     return;
   }

   try {
     const currentProduct = await axios.get(
       `http://localhost:8080/products/${selectedProduct}`
     );

     const updatedProduct = {
       ...currentProduct.data,
       quantity: updatedStock
     };

     const response = await axios.put(
       `http://localhost:8080/products/${selectedProduct}`,
       updatedProduct
     );

     if (response.status === 200) {
       toast.success('Stock updated successfully');
       setCurrentStock(updatedStock);
       fetchProducts();
       setNewStock('');
     } else {
       toast.error('Failed to update stock');
     }
   } catch (error) {
     console.error('Error updating stock', error);
     toast.error('Failed to update stock');
   }
 };

 return (
   <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto">
     <h2 className="text-2xl font-bold mb-6">Update Stock</h2>

     <form onSubmit={handleSubmit} className="space-y-6">
       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           Select Product
         </label>
         <select
           value={selectedProduct}
           onChange={(e) => {
             setSelectedProduct(e.target.value);
             setNewStock('');
           }}
           className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2"
           required
         >
           <option value="">Select Product</option>
           {products.map((product) => (
             <option key={product.idProduct} value={product.idProduct}>
               {product.name}
             </option>
           ))}
         </select>
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           Current Stock
         </label>
         <input
           type="number"
           value={currentStock}
           className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-gray-50"
           disabled
         />
       </div>

       <div>
         <label className="block text-sm font-medium text-gray-700 mb-2">
           New Stock
         </label>
         <input
           type="number"
           value={newStock}
           onChange={(e) => setNewStock(e.target.value)}
           className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2"
           required
         />
       </div>

       <button
         type="submit"
         className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
       >
         Update Stock
       </button>
     </form>
   </div>
 );
};

export default UpdateStock;