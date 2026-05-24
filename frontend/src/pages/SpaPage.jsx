import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function SpaPage() {
  const [addOns, setAddOns] = useState([]);

  useEffect(() => {
    api.get('/addons').then((res) => setAddOns(res.data.addOns || []));
  }, []);

  const spaItems = useMemo(
    () => addOns.filter((item) => ['SPA', 'WELLNESS'].includes(item.category)),
    [addOns]
  );

  return (
    <section className="min-h-screen bg-cream">
      <div className="relative h-[70vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=2200" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/50 via-forest-900/40 to-forest-900/80" />
        <div className="relative z-10 h-full flex items-center justify-center text-center px-6 text-cream">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <p className="uppercase tracking-[0.4em] text-gold-300 text-xs">Pine & cedar spa</p>
            <h1 className="text-6xl md:text-7xl mt-4">Rituals of altitude and stillness</h1>
            <p className="max-w-2xl mx-auto mt-6 text-cream/80 text-lg">
              Mineral baths, cedar steam, Himalayan salt, and therapist-led recovery rituals designed around your stay.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-8">
        {spaItems.map((item, index) => (
          <motion.article
            key={item._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className="card-luxe p-6"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500">{item.category}</p>
            <h2 className="text-2xl text-forest-700 mt-2">{item.serviceName}</h2>
            <p className="text-sm text-stone-500 mt-3">{item.description}</p>
            <div className="mt-6 flex items-center justify-between">
              <span className="text-gold-500 font-semibold">₹{Number(item.price).toLocaleString('en-IN')}</span>
              <Link to="/book" className="text-sm text-forest-700 hover:text-gold-500 font-medium">Add during booking</Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
