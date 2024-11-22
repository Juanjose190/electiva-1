import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import NewUser from './pages/NewUser';
import Products from './pages/Products';
import NewProduct from './pages/NewProduct';
import UpdateStock from './pages/UpdateStock';
import Clients from './pages/Clients';
import NewClient from './pages/NewClient';
import Categories from './pages/Categories';
import NewCategory from './pages/NewCategory';
import Billing from './pages/Billing';
import ManageSales from './pages/ManageSales';
import Reports from './pages/Reports';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
            <Route path="users" element={<Users />} />
            <Route path="users/new" element={<NewUser />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<NewProduct />} />
            <Route path="products/stock" element={<UpdateStock />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/new" element={<NewClient />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/new" element={<NewCategory />} />
            <Route path="billing" element={<Billing />} />
            <Route path="billing/manage" element={<ManageSales />} />
            <Route path="reports/*" element={<Reports />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;