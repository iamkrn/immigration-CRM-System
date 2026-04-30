import { useEffect, useState } from "react";
import API from "../../services/API";
import {
  MdPersonAdd, MdClose, MdPeople,
  MdCheckCircle, MdCancel, MdAdminPanelSettings
} from "react-icons/md";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "counsellor"
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/user/all-users");
      setUsers(res.data.users);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/user/create-user", form);
      setForm({ name: "", email: "", password: "", role: "counsellor" });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      await API.put(`/user/toggle/${id}`, { isActive: !isActive });
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const roleConfig = {
    superAdmin: { bg: "rgba(139,92,246,0.1)", color: "#8b5cf6", label: "Super Admin" },
    admin: { bg: "rgba(59,130,246,0.1)", color: "#3b82f6", label: "Admin" },
    counsellor: { bg: "rgba(16,185,129,0.1)", color: "#10b981", label: "Counsellor" },
  };

  return (
    <div className="p-6 min-h-screen" style={{ background: "#f8fafc" }}>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: "#3b82f6" }}>
            USER MANAGEMENT
          </p>
          <h1 className="text-2xl font-black text-gray-900" style={{ letterSpacing: "-0.5px" }}>
            Manage Users
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage counsellors and admins
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
          style={{
            background: showForm
              ? "rgba(239,68,68,0.1)"
              : "linear-gradient(135deg, #3b82f6, #6366f1)",
            color: showForm ? "#ef4444" : "white",
            border: showForm ? "1px solid rgba(239,68,68,0.2)" : "none",
            boxShadow: showForm ? "none" : "0 4px 15px rgba(59,130,246,0.3)"
          }}
        >
          {showForm ? <><MdClose size={18} /> Cancel</> : <><MdPersonAdd size={18} /> Create User</>}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Users", value: users.length, color: "#3b82f6", bg: "rgba(59,130,246,0.08)", icon: <MdPeople size={20} /> },
          { label: "Active", value: users.filter(u => u.isActive).length, color: "#10b981", bg: "rgba(16,185,129,0.08)", icon: <MdCheckCircle size={20} /> },
          { label: "Inactive", value: users.filter(u => !u.isActive).length, color: "#ef4444", bg: "rgba(239,68,68,0.08)", icon: <MdCancel size={20} /> },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4"
            style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 mb-6"
          style={{ border: "1px solid rgba(59,130,246,0.2)", boxShadow: "0 4px 20px rgba(59,130,246,0.1)" }}>

          <div className="flex items-center gap-2 mb-6">
            <MdAdminPanelSettings size={20} style={{ color: "#3b82f6" }} />
            <h2 className="font-bold text-gray-800">New User Details</h2>
          </div>

          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
              <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@360crm.com" />
              <Field label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min 6 characters" />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-600">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="px-4 py-2.5 rounded-xl text-sm text-gray-800 outline-none"
                  style={{ border: "1px solid #e2e8f0", background: "#f8fafc" }}
                >
                  <option value="counsellor">Counsellor</option>
                  <option value="admin">Admin</option>
                  <option value="superAdmin">Super Admin</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-semibold text-sm transition-all"
              style={{
                background: loading ? "#94a3b8" : "linear-gradient(135deg, #10b981, #059669)",
                boxShadow: loading ? "none" : "0 4px 15px rgba(16,185,129,0.3)"
              }}
            >
              <MdCheckCircle size={16} />
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 1px 20px rgba(0,0,0,0.04)" }}>

        <div className="px-6 py-4 border-b flex items-center gap-2"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <div className="w-1 h-5 rounded-full"
            style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }} />
          <h2 className="font-bold text-gray-800">All Users</h2>
          <span className="ml-auto text-xs px-3 py-1 rounded-full font-semibold"
            style={{ background: "rgba(59,130,246,0.1)", color: "#3b82f6" }}>
            {users.length} total
          </span>
        </div>

        <table className="w-full text-sm">
          <thead style={{ background: "#f8fafc" }}>
            <tr>
              {["#", "User", "Email", "Role", "Status", "Actions"].map(h => (
                <th key={h} className="p-4 text-left text-xs font-semibold uppercase"
                  style={{ color: "#94a3b8", letterSpacing: "0.5px" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users?.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-10 text-gray-400">
                  <MdPeople size={40} className="mx-auto mb-2 opacity-30" />
                  No users found
                </td>
              </tr>
            ) : (
              users?.map((u, index) => (
                <tr key={u._id}
                  className="border-t transition-all"
                  style={{ borderColor: "rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "white"}
                >
                  <td className="p-4 text-gray-400 text-xs font-semibold">{index + 1}</td>

                  {/* User */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800">{u.name}</span>
                    </div>
                  </td>

                  <td className="p-4 text-gray-500 text-sm">{u.email}</td>

                  {/* Role */}
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: roleConfig[u.role]?.bg || "rgba(0,0,0,0.05)",
                        color: roleConfig[u.role]?.color || "#64748b"
                      }}>
                      {roleConfig[u.role]?.label || u.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: u.isActive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                        color: u.isActive ? "#10b981" : "#ef4444"
                      }}>
                      <span className="w-1.5 h-1.5 rounded-full"
                        style={{ background: u.isActive ? "#10b981" : "#ef4444" }} />
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <button
                      onClick={() => handleToggle(u._id, u.isActive)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: u.isActive ? "rgba(239,68,68,0.08)" : "rgba(16,185,129,0.08)",
                        color: u.isActive ? "#ef4444" : "#10b981",
                        border: `1px solid ${u.isActive ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`
                      }}
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

const Field = ({ label, name, value, onChange, type = "text", placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-gray-600">{label}</label>
    <input
      type={type} name={name} value={value}
      onChange={onChange} placeholder={placeholder}
      className="px-4 py-2.5 rounded-xl text-sm text-gray-800 outline-none transition-all"
      style={{ border: "1px solid #e2e8f0", background: "#f8fafc" }}
      onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.background = "white"; }}
      onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; }}
    />
  </div>
);

export default AdminUsers;