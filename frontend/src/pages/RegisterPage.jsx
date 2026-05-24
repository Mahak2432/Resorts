import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuth((s) => s.register);
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try { await register(f.name, f.email, f.password); navigate('/dashboard'); }
    catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
  };

  return (
    <div className="min-h-screen pt-32 px-6 max-w-md mx-auto">
      <h1 className="text-4xl text-forest-700 font-display text-center">Create your account</h1>
      <form onSubmit={submit} className="card-luxe p-8 mt-8 space-y-4">
        <input required placeholder="Full name"
               className="w-full px-4 py-3 rounded-lg border border-forest-200 focus:border-gold-400 outline-none"
               value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input type="email" required placeholder="Email"
               className="w-full px-4 py-3 rounded-lg border border-forest-200 focus:border-gold-400 outline-none"
               value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <input type="password" required minLength={6} placeholder="Password"
               className="w-full px-4 py-3 rounded-lg border border-forest-200 focus:border-gold-400 outline-none"
               value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="btn-primary w-full">Begin journey</button>
        <p className="text-center text-sm text-stone-500">
          Already a guest? <Link to="/login" className="text-gold-500">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
