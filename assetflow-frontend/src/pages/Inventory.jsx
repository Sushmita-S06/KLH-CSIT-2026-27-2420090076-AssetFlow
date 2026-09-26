import { useEffect, useState } from 'react';
import { inventoryApi } from '../api/services';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const empty = { sku: '', name: '', category: '', quantity: 0, reorderLevel: 5, supplier: '', unitPrice: '' };

export default function Inventory() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const { hasRole } = useAuth();

  const load = () => inventoryApi.list().then(setList);
  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      quantity: Number(form.quantity),
      reorderLevel: Number(form.reorderLevel),
      unitPrice: form.unitPrice ? Number(form.unitPrice) : null
    };
    try {
      if (editing) await inventoryApi.update(editing.id, payload);
      else await inventoryApi.create(payload);
      toast.success('Saved'); setOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
  };

  const remove = async (id) => {
    if (!confirm('Delete item?')) return;
    try { await inventoryApi.remove(id); toast.success('Deleted'); load(); }
    catch { toast.error('Delete failed'); }
  };

  const canEdit = hasRole('ROLE_ADMIN') || hasRole('ROLE_MANAGER');

  return (
    <div>
      <div className="row between mb-16">
        <h2>Inventory</h2>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => { setEditing(null); setForm(empty); setOpen(true); }}>
            <FiPlus /> Add Item
          </button>
        )}
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>SKU</th><th>Name</th><th>Category</th>
              <th>Qty</th><th>Reorder</th><th>Supplier</th><th>Unit Price</th><th></th>
            </tr>
          </thead>
          <tbody>
            {list.map(i => (
              <tr key={i.id}>
                <td><strong>{i.sku}</strong></td>
                <td>{i.name}</td>
                <td>{i.category || '—'}</td>
                <td>
                  {i.quantity}
                  {i.quantity <= i.reorderLevel && (
                    <FiAlertTriangle style={{ color: '#ef4444', marginLeft: 6 }} size={12} />
                  )}
                </td>
                <td>{i.reorderLevel}</td>
                <td>{i.supplier || '—'}</td>
                <td>{i.unitPrice ?? '—'}</td>
                <td>
                  {canEdit && (
                    <div className="row">
                      <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(i); setForm(i); setOpen(true); }}>
                        <FiEdit2 size={12} />
                      </button>
                      {hasRole('ROLE_ADMIN') && (
                        <button className="btn btn-danger btn-sm" onClick={() => remove(i.id)}>
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

      <Modal open={open} title={editing ? 'Edit Item' : 'Add Item'} onClose={() => setOpen(false)}>
        <form onSubmit={save}>
          <div className="form-grid">
            <div className="form-group"><label>SKU *</label><input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required disabled={!!editing} /></div>
            <div className="form-group"><label>Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div className="form-group"><label>Category</label><input value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
            <div className="form-group"><label>Quantity</label><input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
            <div className="form-group"><label>Reorder Level</label><input type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} /></div>
            <div className="form-group"><label>Supplier</label><input value={form.supplier || ''} onChange={(e) => setForm({ ...form, supplier: e.target.value })} /></div>
            <div className="form-group"><label>Unit Price</label><input type="number" step="0.01" value={form.unitPrice || ''} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} /></div>
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