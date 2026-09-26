import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/services';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    dashboardApi.stats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <div className="card">Loading...</div>;

  const statusChart = {
    labels: Object.keys(stats.assetsByStatus || {}),
    datasets: [{
      data: Object.values(stats.assetsByStatus || {}),
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#6b7280', '#ef4444']
    }]
  };

  const categoryChart = {
    labels: Object.keys(stats.assetsByCategory || {}),
    datasets: [{
      label: 'Assets',
      data: Object.values(stats.assetsByCategory || {}),
      backgroundColor: '#4f46e5'
    }]
  };

  return (
    <div>
      <h2 className="mb-16">Dashboard</h2>

      <div className="stat-grid">
        <StatCard label="Total Assets" value={stats.totalAssets} color="#4f46e5" />
        <StatCard label="Available" value={stats.availableAssets} color="#10b981" />
        <StatCard label="Assigned" value={stats.assignedAssets} color="#3b82f6" />
        <StatCard label="Maintenance" value={stats.maintenanceAssets} color="#f59e0b" />
        <StatCard label="Retired" value={stats.retiredAssets} color="#6b7280" />
        <StatCard label="Lost" value={stats.lostAssets} color="#ef4444" />
        <StatCard label="Users" value={stats.totalUsers} color="#8b5cf6" />
        <StatCard label="Low Stock" value={stats.lowStockItems} color="#dc2626" />
      </div>

      <div className="chart-grid">
        <div className="card">
          <h3>Assets by Status</h3>
          <Doughnut data={statusChart} />
        </div>
        <div className="card">
          <h3>Assets by Category</h3>
          <Bar data={categoryChart} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="label">{label}</div>
      <div className="value" style={{ color }}>{value}</div>
    </div>
  );
}