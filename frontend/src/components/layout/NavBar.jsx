import { Link, NavLink } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '../../store/authStore';

export default function NavBar() {
  const { scrollY } = useScroll();
  const bg   = useTransform(scrollY, [0, 120], ['rgba(20,39,25,0)', 'rgba(20,39,25,0.85)']);
  const blur = useTransform(scrollY, [0, 120], ['blur(0px)', 'blur(12px)']);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  const links = [
    ['Home', '/'], ['Suites', '/suites'], ['Spa', '/spa'],
    ['Gallery', '/gallery'], ['Contact', '/contact'],
  ];

  return (
    <motion.nav
      style={{ backgroundColor: bg, backdropFilter: blur }}
      className="fixed top-0 inset-x-0 z-50 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between text-cream">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-gold-400 text-2xl">❋</span>
          <span className="font-display text-xl tracking-wide">
            Whispering Pines
            <span className="block text-[10px] tracking-[0.4em] text-cream/70 -mt-1">RESORT</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest">
          {links.map(([label, to]) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `hover:text-gold-300 transition ${isActive ? 'text-gold-400' : ''}`}>
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm hover:text-gold-300">{user.name?.split(' ')[0]}</Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="text-sm text-gold-400 hover:text-gold-300">Admin</Link>
              )}
              <button onClick={logout} className="text-sm text-cream/70 hover:text-gold-300">Sign out</button>
            </>
          ) : (
            <Link to="/login" className="text-sm hover:text-gold-300">Sign in</Link>
          )}
          <Link to="/book" className="btn-primary !py-2 !px-5 text-sm">Reserve</Link>
        </div>
      </div>
    </motion.nav>
  );
}
