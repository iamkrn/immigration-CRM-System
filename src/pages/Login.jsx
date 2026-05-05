import { useState } from "react";
import API from "../services/API";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const role = res.data.user.role;
      if (role === "admin" || role === "superAdmin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Left Side — Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)" }}>

        {/* Background Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(99,102,241,0.1) 0%, transparent 40%)`,
        }} />

        {/* Grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />

        <div className="relative z-10 flex flex-col justify-center px-16">
          {/* Logo */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black"
                style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
                360
              </div>
              <span className="text-white text-xl font-bold tracking-tight">
                College Review
              </span>
            </div>
            <div className="w-12 h-0.5 ml-1 rounded"
              style={{ background: "linear-gradient(90deg, #3b82f6, transparent)" }} />
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-black text-white leading-tight mb-6"
            style={{ letterSpacing: "-2px" }}>
            Manage<br />
            <span style={{ background: "linear-gradient(135deg, #3b82f6, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Everything
            </span><br />
            In One Place
          </h1>

          <p className="text-blue-200 text-base leading-relaxed mb-12 max-w-sm" style={{ opacity: 0.7 }}>
            Complete CRM platform for managing students, applications, and visa processes seamlessly.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { num: "500+", label: "Students" },
              { num: "98%", label: "Success Rate" },
              { num: "50+", label: "Universities" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-2xl font-black text-white">{s.num}</p>
                <p className="text-xs text-blue-300 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-white"
              style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              360
            </div>
            <span className="font-bold text-gray-800">College Review CRM</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 mb-2"
              style={{ letterSpacing: "-1px" }}>
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm outline-none transition-all"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm outline-none transition-all"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                onFocus={e => e.target.style.borderColor = "#3b82f6"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all"
              style={{
                background: loading ? "#94a3b8" : "linear-gradient(135deg, #3b82f6, #6366f1)",
                boxShadow: loading ? "none" : "0 4px 20px rgba(59,130,246,0.4)"
              }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>

          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 font-semibold hover:text-blue-600">
              Register here
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;