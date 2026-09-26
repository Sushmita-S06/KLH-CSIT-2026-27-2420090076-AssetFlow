import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    fullName: '', department: '', phone: '', role: 'ROLE_ADMIN'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const nav = useNavigate();

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      toast.success('Registered successfully');
      nav('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={submit}>
        <h1>Create Account</h1>
        <p>Join AssetFlow</p>

        <div className="form-group">
          <label>Full Name</label>
          <input value={form.fullName} onChange={set('fullName')} required />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input value={form.username} onChange={set('username')} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={form.email} onChange={set('email')} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" value={form.password} onChange={set('password')} required minLength={6} />
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Department</label>
            <input value={form.department} onChange={set('department')} />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input value={form.phone} onChange={set('phone')} />
          </div>
        </div>

        {error && <div className="error-text">{error}</div>}

        <button className="btn btn-primary">Register</button>

        <div className="text-muted" style={{ textAlign: 'center', marginTop: 14 }}>
          Have account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}