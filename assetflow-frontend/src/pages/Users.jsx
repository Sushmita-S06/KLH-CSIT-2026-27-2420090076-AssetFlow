import { useEffect, useState } from 'react';
import { authApi } from '../api/services';

export default function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => { authApi.users().then(setUsers); }, []);

  return (
    <div>
      <h2 className="mb-16">Users</h2>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Username</th><th>Full Name</th><th>Email</th>
              <th>Department</th><th>Phone</th><th>Roles</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td><strong>{u.username}</strong></td>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.department || '—'}</td>
                <td>{u.phone || '—'}</td>
                <td>{u.roles?.map(r => r.name).join(', ')}</td>
                <td>
                  <span className={`badge badge-${u.enabled ? 'AVAILABLE' : 'RETIRED'}`}>
                    {u.enabled ? 'Active' : 'Disabled'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}