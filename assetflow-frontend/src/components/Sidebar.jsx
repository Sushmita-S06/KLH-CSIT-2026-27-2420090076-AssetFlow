import { NavLink } from 'react-router-dom';
import { FiHome, FiBox, FiTag, FiUsers, FiTruck, FiPackage } from 'react-icons/fi';

const items = [
  { to: '/', label: 'Dashboard', icon: FiHome },
  { to: '/assets', label: 'Assets', icon: FiBox },
  { to: '/categories', label: 'Categories', icon: FiTag },
  { to: '/assignments', label: 'Assignments', icon: FiTruck },
  { to: '/inventory', label: 'Inventory', icon: FiPackage },
  { to: '/users', label: 'Users', icon: FiUsers }
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>AssetFlow</h2>
      <nav>
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}