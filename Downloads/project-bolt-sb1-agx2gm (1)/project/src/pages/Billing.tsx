import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { Plus, Calculator } from 'lucide-react';
import axios from 'axios';

const Billing = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [change, setChange] = useState<number | null>(null); 

  const [products, setProducts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    
    axios.get('http://localhost:8080/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));

    axios.get('http://localhost:8080/api/customers')
      .then((response) => setClients(response.data))
      .catch((error) => console.error('Error fetching clients:', error));
  }, []);

  const handleAddProduct = () => {
    if (!selectedProduct || quantity <= 0) {
      toast.error('Please select a product and quantity');
      return;
    }

    const product = products.find((p) => p.idProduct === parseInt(selectedProduct, 10));

    if (!product) {
      toast.error('Product not found');
      return;
    }

    const productTotal = product.price * quantity;
    const newItem = { product, quantity, productTotal };

    setItems((prevItems) => [...prevItems, newItem]);
    calculateSubtotal([...items, newItem]);
    setQuantity(1);
    setSelectedProduct(''); 
    toast.success('Product added successfully');
  };

  const calculateSubtotal = (itemsList: any[]) => {
    const newSubtotal = itemsList.reduce((acc, item) => acc + item.productTotal, 0);
    setSubtotal(newSubtotal);
    calculateTotal(newSubtotal);
  };

  const calculateTotal = (newSubtotal: number) => {
    const newIva = newSubtotal * 0.19; 
    const newTotal = newSubtotal + newIva - discount;
    setIva(newIva);
    setTotal(newTotal);
  };

  const calculateChange = () => {
    if (amountPaid < total) {
      setChange(null); 
    } else {
      const changeAmount = amountPaid - total;
      setChange(changeAmount); 
    }
  };

  const handleRegisterSale = async () => {
    if (!selectedClient) {
      toast.error('Please select a client');
      return;
    }

    if (items.length === 0) {
      toast.error('Please add at least one product');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/sales/register', {
        clientId: selectedClient,
        items,
        subtotal,
        iva,
        discount,
        total,
        amountPaid,
        change,
      });

      setShowConfetti(true);
      toast.success('Sale registered successfully!');
      setTimeout(() => setShowConfetti(false), 5000);
      resetForm();
    } catch (error) {
      console.error('Error registering sale:', error);
      toast.error('Failed to register sale');
    }
  };

  const resetForm = () => {
    setItems([]);
    setSelectedClient('');
    setSubtotal(0);
    setDiscount(0);
    setIva(0);
    setTotal(0);
    setAmountPaid(0);
    setChange(null); 
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {showConfetti && <Confetti />}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6">New Sale</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.idCustomer} value={client.idCustomer}>
                  {client.firstName} {client.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2"
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.idProduct} value={product.idProduct}>
                    {product.name} - ${product.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2"
              />
            </div>

            <button
              onClick={handleAddProduct}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{item.product.name}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4">${item.productTotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA:</span>
              <span>${iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-24 px-2 py-1 border rounded-md"
              />
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                className="rounded-md border px-2 py-1 w-24"
              />
            </div>

            <button
              onClick={calculateChange}
              className="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              <Calculator className="h-5 w-5" />
            </button>

            <div className="flex justify-between mt-4 font-bold">
              <span>Change:</span>
           
              <span>{change !== null ? `$${change.toFixed(2)}` : '---'}</span>
            </div>

            <button
              onClick={handleRegisterSale}
              className="mt-6 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Register Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
