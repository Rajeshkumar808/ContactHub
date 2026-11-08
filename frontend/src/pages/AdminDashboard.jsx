
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api/admin";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const loadAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        axios.get(`${API}/stats`, { headers }),
        axios.get(`${API}/users`, { headers }),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const updateRole = async (userId, role) => {
    try {
      await axios.patch(
        `${API}/users/${userId}/role`,
        { role },
        { headers }
      );

      loadAdminData();
    } catch {
      alert("Failed to update role");
    }
  };

  const toggleUser = async (userId, isActive) => {
    try {
      await axios.patch(
        `${API}/users/${userId}/status`,
        { isActive },
        { headers }
      );

      loadAdminData();
    } catch {
      alert("Failed to update user status");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      await axios.delete(`${API}/users/${userId}`, { headers });
      loadAdminData();
    } catch {
      alert("Failed to delete user");
    }
  };

  if (loading) return <h2>Loading Admin Dashboard...</h2>;

  return (
    <div style={{ padding: "30px", color: "white", background: "#080b16", minHeight: "100vh" }}>
      <h1>Super Admin Dashboard</h1>

      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <Stat title="Total Users" value={stats.totalUsers} />
        <Stat title="Total Contacts" value={stats.totalContacts} />
        <Stat title="Administrators" value={stats.totalAdmins} />
      </div>

      <h2>User Management</h2>

      <table width="100%" cellPadding="12" style={{ background: "#111827" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </td>

              <td>
                {user.isActive ? "Active" : "Disabled"}
              </td>

              <td>
                <button
                  onClick={() => toggleUser(user._id, !user.isActive)}
                >
                  {user.isActive ? "Disable" : "Enable"}
                </button>

                <button
                  onClick={() => deleteUser(user._id)}
                  style={{ marginLeft: "8px" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div style={{ background: "#111827", padding: "25px", borderRadius: "10px" }}>
      <h3>{title}</h3>
      <h1>{value ?? 0}</h1>
    </div>
  );
}
