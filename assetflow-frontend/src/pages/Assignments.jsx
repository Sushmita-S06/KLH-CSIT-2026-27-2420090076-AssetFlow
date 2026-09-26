import { useEffect, useState } from 'react';
import { assignmentApi, assetApi, authApi } from '../api/services';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { FiPlus, FiCornerDownLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Assignments() {
  const [list, setList] = useState([]);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ assetId: '', userId: '', remarks: '' });
  const { hasRole } = useAuth();

  const load = async () => {
    const [a, s, u] = await Promise.all([
      assignmentApi.list(), assetApi.list(), authApi.users()
    ]);
    setList(a); setAssets(s); setUsers(u);
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await assignmentApi.assign({
        assetId: Number(form.assetId),
        userId: Number(form.userId),
        remarks: form.remarks
      });
      toast.success('Assigned');
      setOpen(false); setForm({ assetId: '', userId: '', remarks: '' }); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed');
    }
  };

  const returnAsset = async (assetId) => {
    if (!confirm('Return this asset?')) return;
    try {
      await assignmentApi.return(assetId, 'Returned via UI');
      toast.success('Returned');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Return failed');
    }
  };

  const canEdit = hasRole('ROLE_ADMIN') || hasRole('ROLE_MANAGER');

  return (
    <div>
      <div className="row between mb-16">
        <h2>Assignments</h2>
        {canEdit && (
          <button className="btn btn-primary" onClick={() => setOpen(true)}>
            <FiPlus /> New Assignment
          </button>
        )}
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Asset</th><th>User</th><th>Assigned At</th>
              <th>Returned At</th><th>Status</th><th>By</th><th></th>
            </tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr key={a.id}>
                <td><strong>{a.asset?.assetId}</strong> — {a.asset?.name}</td>
                <td>{a.user?.fullName}</td>
                <td>{new Date(a.assignedAt).toLocaleString()}</td>
                <td>{a.returnedAt ? new Date(a.returnedAt).toLocaleString() : '—'}</td>
                <td>
                  <span className={`badge badge-${a.status === 'ACTIVE' ? 'ASSIGNED' : a.status === 'RETURNED' ? 'AVAILABLE' : 'RETIRED'}`}>
                    {a.status}
                  </span>
                </td>
                <td>{a.assignedBy || '—'}</td>
                <td>
                  {canEdit && a.status === 'ACTIVE' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => returnAsset(a.asset.id)}>
                      <FiCornerDownLeft size={12} /> Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24 }}>No assignments</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} title="New Assignment" onClose={() => setOpen(false)}>
        <form onSubmit={save}>
          <div className="form-group">
            <label>Asset *</label>
            <select value={form.assetId} onChange={(e) => setForm({ ...form, assetId: e.target.value })} required>
              <option value="">Select asset</option>
              {assets.filter(a => a.status === 'AVAILABLE').map(a => (
                <option key={a.id} value={a.id}>{a.assetId} — {a.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>User *</label>
            <select value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} required>
              <option value="">Select user</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.fullName} ({u.username})</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Remarks</label>
            <textarea rows="3" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button className="btn btn-primary">Assign</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}