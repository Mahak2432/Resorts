import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function StickyBookingWidget() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="fixed bottom-6 right-6 z-40"
    >
      {open ? (
        <div className="card-luxe p-5 w-72">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-display text-lg text-forest-700">Quick Reserve</h4>
            <button onClick={() => setOpen(false)} className="text-stone-500">×</button>
          </div>
          <button onClick={() => navigate('/book')} className="btn-primary w-full">
            Open Booking Wizard
          </button>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="btn-primary shadow-luxe">
          ❋ Reserve
        </button>
      )}
    </motion.div>
  );
}
