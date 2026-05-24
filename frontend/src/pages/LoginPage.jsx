import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault(); setError(null);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Sign-in failed'); }
  };

  return (
    <div className="min-h-screen pt-32 px-6 max-w-md mx-auto">
      <h1 className="text-4xl text-forest-700 font-display text-center">Welcome back</h1>
      <form onSubmit={submit} className="card-luxe p-8 mt-8 space-y-4">
        <input type="email" required placeholder="Email"
               className="w-full px-4 py-3 rounded-lg border border-forest-200 focus:border-gold-400 outline-none"
               value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" required placeholder="Password"
               className="w-full px-4 py-3 rounded-lg border border-forest-200 focus:border-gold-400 outline-none"
               value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn-primary w-full">Sign in</button>
        <p className="text-center text-sm text-stone-500">
          New guest? <Link to="/register" className="text-gold-500">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
