import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/client';
import { useBookingStore } from '../../store/bookingStore';

const CATEGORY_LABEL = {
  SPA: 'Spa & Wellness', DINING: 'Curated Dining', TRANSFER: 'Airport Transfer',
  SIGHTSEEING: 'Local Sightseeing', ADVENTURE: 'Adventure', WELLNESS: 'Yoga & Meditation',
};

export default function StepAddOns() {
  const { addOns, toggleAddOn, setAddOnQty, next, back } = useBookingStore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/addons').then((r) => setItems(r.data.addOns)).finally(() => setLoading(false));
  }, []);

  const grouped = items.reduce((acc, a) => {
    (acc[a.category] ||= []).push(a);
    return acc;
  }, {});

  return (
    <div>
      <h2 className="text-3xl text-forest-700">Curated experiences</h2>
      <p className="text-stone-500 mt-1">Optional. Layer on the moments that turn a stay into a memory.</p>
      {loading && <p className="mt-6 text-stone-500">Loading…</p>}

      <div className="mt-8 space-y-10">
        {Object.entries(grouped).map(([cat, list]) => (
          <section key={cat}>
            <h3 className="uppercase tracking-[0.25em] text-xs text-gold-500 mb-4">
              {CATEGORY_LABEL[cat] || cat}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {list.map((a) => {
                const qty = addOns[a._id] || 0;
                const selected = qty > 0;
                return (
                  <motion.div key={a._id} whileHover={{ y: -2 }}
                    className={`p-4 rounded-xl border-2 bg-white transition
                      ${selected ? 'border-gold-400 shadow-luxe' : 'border-forest-100'}`}>
                    <div className="flex justify-between">
                      <h4 className="font-display text-lg text-forest-700">{a.serviceName}</h4>
                      <span className="text-gold-500 font-semibold">
                        ₹{Number(a.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500 mt-1">{a.description}</p>
                    <div className="mt-3">
                      {!selected ? (
                        <button onClick={() => toggleAddOn(a._id, 1)}
                                className="text-sm text-forest-700 font-medium hover:underline">
                          + Add to stay
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <button onClick={() => setAddOnQty(a._id, qty - 1)}
                                  className="w-7 h-7 rounded-full border border-forest-300">−</button>
                          <span className="w-6 text-center font-medium">{qty}</span>
                          <button onClick={() => setAddOnQty(a._id, qty + 1)}
                                  className="w-7 h-7 rounded-full border border-forest-300">+</button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <button onClick={back} className="btn-ghost">← Suites</button>
        <button onClick={next} className="btn-primary">Continue to Checkout →</button>
      </div>
    </div>
  );
}
