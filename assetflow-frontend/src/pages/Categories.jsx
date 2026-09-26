import { useEffect, useState } from 'react';
import { categoryApi } from '../api/services';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Categories() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const { hasRole } = useAuth();

  const load = () => categoryApi.list().then(setList);
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) await categoryApi.update(editing.id, form);
      else await categoryApi.create(form);
      toast.success('Saved');
      setOpen(false); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete category?')) return;
    try { await categoryApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const canEdit = hasRole('ROLE_ADMIN') || hasRole('ROLE_MANAGER');

  return (
    <div>
      <div className="row between mb-16">
        <h2>Categories</h2>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm({ name: '', description: '' }); setOpen(true); }}>
            <FiPlus /> Add Category
          </button>
        )}
      </div>

      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Description</th><th></th></tr></thead>
          <tbody>
            {list.map(c => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.description || '—'}</td>
                <td>
                  {canEdit && (
                    <div className="row">
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(c); setForm(c); setOpen(true); }}>
                        <FiEdit2 size={12} />
                      </button>
                      {hasRole('ROLE_ADMIN') && (
                        <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>
                          <FiTrash2 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editing ? 'Edit Category' : 'Add Category'} onClose={() => setOpen(false)}>
        <form onSubmit={save}>
          <div className="form-group">
            <label>Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}