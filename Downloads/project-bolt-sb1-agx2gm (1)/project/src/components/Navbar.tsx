import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, FolderTree, Receipt, FileText, LogOut, 
  ChevronDown, User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8" />
              <span className="font-bold text-xl">POS System</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center justify-between space-x-16"> {/* Más separación aquí */}
              <NavDropdown
                title="Products"
                icon={<Package className="h-5 w-5" />}
                items={[
                  { label: 'New Product', path: '/products/new' },
                  { label: 'Manage Products', path: '/products' },
                  { label: 'Update Stock', path: '/products/stock' },
                ]}
              />

              <NavDropdown
                title="Clients"
                icon={<User className="h-5 w-5" />}
                items={[
                  { label: 'New Client', path: '/clients/new' },
                  { label: 'Manage Clients', path: '/clients' },
                ]}
              />

              <NavDropdown
                title="Categories"
                icon={<FolderTree className="h-5 w-5" />}
                items={[
                  { label: 'New Categories', path: '/categories/new' },
                  { label: 'Edit Categories', path: '/categories' },
                ]}
              />

              <NavDropdown
                title="Billing"
                icon={<Receipt className="h-5 w-5" />}
                items={[
                  { label: 'New Sale', path: '/billing' },
                  { label: 'Manage Sales', path: '/billing/manage' },
                ]}
              />

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavDropdown = ({ title, icon, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-indigo-700 transition-colors"
      >
        {icon}
        <span>{title}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
