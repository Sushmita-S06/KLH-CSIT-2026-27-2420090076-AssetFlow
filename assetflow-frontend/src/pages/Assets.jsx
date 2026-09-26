import { useEffect, useState } from 'react';
import { assetApi, categoryApi, authApi } from '../api/services';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  assetId: '', name: '', categoryId: '', manufacturer: '', model: '',
  serialNumber: '', purchaseDate: '', purchaseCost: '', warrantyExpiry: '',
  location: '', status: 'AVAILABLE', condition: 'NEW', assignedToId: '', notes: ''
};

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const { hasRole } = useAuth();

  const load = async () => {
    const [a, c, u] = await Promise.all([
      assetApi.list(), categoryApi.list(), authApi.users()
    ]);
    setAssets(a); setCategories(c); setUsers(u);
  };

  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({
      assetId: a.assetId, name: a.name, categoryId: a.categoryId,
      manufacturer: a.manufacturer || '', model: a.model || '',
      serialNumber: a.serialNumber || '', purchaseDate: a.purchaseDate || '',
      purchaseCost: a.purchaseCost || '', warrantyExpiry: a.warrantyExpiry || '',
      location: a.location || '', status: a.status, condition: a.condition,
      assignedToId: a.assignedToId || '', notes: a.notes || ''
    });
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        purchaseCost: form.purchaseCost ? Number(form.purchaseCost) : null,
        assignedToId: form.assignedToId ? Number(form.assignedToId) : null,
        purchaseDate: form.purchaseDate || null,
        warrantyExpiry: form.warrantyExpiry || null
      };
      if (editing) {
        await assetApi.update(editing.id, payload);
        toast.success('Asset updated');
      } else {
        await assetApi.create(payload);
        toast.success('Asset created');
      }
      setOpen(false); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this asset?')) return;
    try {
      await assetApi.remove(id);
      toast.success('Asset deleted');
      load();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filtered = assets.filter(a =>
    a.assetId.toLowerCase().includes(search.toLowerCase()) ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.serialNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  const canEdit = hasRole('ROLE_ADMIN') || hasRole('ROLE_MANAGER');

  return (
    <div>
      <div className="row between mb-16">
        <h2>Assets</h2>
        {canEdit && (
          <button className="btn btn-primary" onClick={openCreate}>
            <FiPlus /> Add Asset
          </button>
        )}
      </div>

      <div className="card">
        <input
          placeholder="Search by asset ID, name, or serial..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '9px 12px', border: '1px solid #e5e7eb', borderRadius: 6, width: '100%', marginBottom: 14 }}
        />

        <table>
          <thead>
            <tr>
              <th>Asset ID</th><th>Name</th><th>Category</th>
              <th>Serial</th><th>Assigned To</th><th>Status</th>
              <th>Condition</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td><strong>{a.assetId}</strong></td>
                <td>{a.name}</td>
                <td>{a.category}</td>
                <td>{a.serialNumber || '—'}</td>
                <td>{a.assignedToName || '—'}</td>
                <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                <td>{a.condition}</td>
                <td>
                  {canEdit && (
                    <div className="row">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}>
                        <FiEdit2 size={12} />
                      </button>
                      {hasRole('ROLE_ADMIN') && (
                        <button className="btn btn-danger btn-sm" onClick={() => remove(a.id)}>
                          <FiTrash2 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24 }}>No assets found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editing ? 'Edit Asset' : 'Add Asset'} onClose={() => setOpen(false)}>
        <form onSubmit={save}>
          <div className="form-grid">
            <div className="form-group">
              <label>Asset ID *</label>
              <input value={form.assetId} onChange={set('assetId')} required disabled={!!editing} />
            </div>
            <div className="form-group">
              <label>Name *</label>
              <input value={form.name} onChange={set('name')} required />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select value={form.categoryId} onChange={set('categoryId')} required>
                <option value="">Select</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Manufacturer</label>
              <input value={form.manufacturer} onChange={set('manufacturer')} />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input value={form.model} onChange={set('model')} />
            </div>
            <div className="form-group">
              <label>Serial Number</label>
              <input value={form.serialNumber} onChange={set('serialNumber')} />
            </div>
            <div className="form-group">
              <label>Purchase Date</label>
              <input type="date" value={form.purchaseDate} onChange={set('purchaseDate')} />
            </div>
            <div className="form-group">
              <label>Purchase Cost</label>
              <input type="number" step="0.01" value={form.purchaseCost} onChange={set('purchaseCost')} />
            </div>
            <div className="form-group">
              <label>Warranty Expiry</label>
              <input type="date" value={form.warrantyExpiry} onChange={set('warrantyExpiry')} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input value={form.location} onChange={set('location')} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={set('status')}>
                <option>AVAILABLE</option><option>ASSIGNED</option>
                <option>UNDER_MAINTENANCE</option><option>RETIRED</option><option>LOST</option>
              </select>
            </div>
            <div className="form-group">
              <label>Condition</label>
              <select value={form.condition} onChange={set('condition')}>
                <option>NEW</option><option>GOOD</option><option>FAIR</option>
                <option>POOR</option><option>DAMAGED</option>
              </select>
            </div>
            <div className="form-group">
              <label>Assigned To</label>
              <select value={form.assignedToId} onChange={set('assignedToId')}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.fullName} ({u.username})</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea rows="3" value={form.notes} onChange={set('notes')} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}