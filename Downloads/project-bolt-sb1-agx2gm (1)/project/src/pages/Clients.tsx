import { useState, useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const Clients = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idCard: '',
    phone: '',
    address: '',
    status: 1,
  });

  const [customers, setCustomers] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch customers on component mount
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/customers')
      .then((response) => {
        const data = response.data || [];
        // Ensure all customers have `idCustomer` defined
        setCustomers(
          data.map((customer: any) => ({
            idCustomer: customer.idCustomer || null, // Default to `null` if `idCustomer` is missing
            ...customer,
          }))
        );
      })
      .catch((error) => {
        console.error('Error fetching customers:', error);
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:8080/api/customers/${editingId}`
      : 'http://localhost:8080/api/customers';
    const method = editingId ? 'put' : 'post';

    // Submit customer data
    axios({
      method: method,
      url: url,
      data: formData,
    })
      .then((response) => {
        if (editingId) {
          // Update the edited customer in the list
          setCustomers(
            customers.map((customer) =>
              customer.idCustomer === editingId ? response.data : customer
            )
          );
        } else {
          // Add new customer to the list
          setCustomers([...customers, response.data]);
        }

        // Reset form and editing state
        setFormData({
          firstName: '',
          lastName: '',
          idCard: '',
          phone: '',
          address: '',
          status: 1,
        });
        setEditingId(null);
      })
      .catch((error) => {
        console.error('Error saving customer:', error);
      });
  };

  const editCustomer = (customer: any) => {
    setFormData({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      idCard: customer.idCard || '',
      phone: customer.phone || '',
      address: customer.address || '',
      status: customer.status || 1,
    });
    setEditingId(customer.idCustomer || null); // Ensure `idCustomer` is not undefined
  };

  const deleteCustomer = (id: number | null) => {
    if (id === null) {
      console.error('Invalid customer ID: null');
      return;
    }

    axios
      .delete(`http://localhost:8080/api/customers/${id}`)
      .then(() => {
        setCustomers(customers.filter((customer) => customer.idCustomer !== id));
      })
      .catch((error) => {
        console.error('Error deleting customer:', error);
      });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Manage Clients
      </h2>

      {editingId && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Edit Customer
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">ID Card</label>
              <input
                type="text"
                value={formData.idCard}
                onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Status</label>
              <input
                type="number"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: +e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Update Customer
          </button>
        </form>
      )}

      <div className="overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.idCustomer}>
                <td className="px-6 py-3">{customer.firstName}</td>
                <td className="px-6 py-3">{customer.lastName}</td>
                <td className="px-6 py-3">{customer.phone}</td>
                <td className="px-6 py-3">{customer.address}</td>
                <td className="px-6 py-3">
                  <button onClick={() => editCustomer(customer)} className="text-indigo-600 mx-1">
                    <Edit />
                  </button>
                  <button onClick={() => deleteCustomer(customer.idCustomer)} className="text-red-600 mx-1">
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clients;
