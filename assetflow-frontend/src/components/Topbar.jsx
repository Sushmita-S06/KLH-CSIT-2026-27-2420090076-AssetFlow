import { FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <header className="topbar">
      <div />
      <div className="user">
        <div>
          <strong>{user?.fullName}</strong>
          <div className="text-muted">{user?.roles?.join(', ')}</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          <FiLogOut size={14} /> Logout
        </button>
      </div>
    </header>
  );
}