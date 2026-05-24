import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import NavBar from './components/layout/NavBar';
import StickyBookingWidget from './components/layout/StickyBookingWidget';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GuestDashboard from './pages/GuestDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SuitesPage from './pages/SuitesPage';
import SpaPage from './pages/SpaPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import ErrorBoundary from './components/ErrorBoundary';

const pageMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -12 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
};

export default function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <NavBar />
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} {...pageMotion}>
          <Routes location={location}>
            <Route path="/"          element={<HomePage />} />
            <Route path="/suites"    element={<SuitesPage />} />
            <Route path="/spa"       element={<SpaPage />} />
            <Route path="/gallery"   element={<GalleryPage />} />
            <Route path="/contact"   element={<ContactPage />} />
            <Route path="/book"      element={<BookPage />} />
            <Route path="/login"     element={<LoginPage />} />
            <Route path="/register"  element={<RegisterPage />} />
            <Route path="/dashboard" element={<GuestDashboard />} />
            <Route path="/admin"     element={<AdminDashboard />} />
            <Route path="*"          element={<NotFoundPage />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      <StickyBookingWidget />
    </ErrorBoundary>
  );
}
