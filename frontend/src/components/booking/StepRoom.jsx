import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/client';
import { useBookingStore } from '../../store/bookingStore';

export default function StepRoom() {
  const { checkIn, checkOut, guests, selectedRoom, setRoom, next, back } = useBookingStore();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.post('/availability', { checkIn, checkOut, guests })
       .then((r) => { if (!cancelled) { setRooms(r.data.rooms); setSource(r.data.source); } })
       .catch((e) => { if (!cancelled) setError(e.response?.data?.message || 'Search failed'); })
       .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [checkIn, checkOut, guests]);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h2 className="text-3xl text-forest-700">Choose your suite</h2>
          <p className="text-stone-500 text-sm">{checkIn} → {checkOut} · {guests} guest{guests > 1 ? 's' : ''}</p>
        </div>
        {source && (
          <span className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full
                          bg-forest-50 text-forest-700 border border-forest-100">
            data: {source}
          </span>
        )}
      </div>

      {loading && <SkeletonGrid />}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && rooms.length === 0 && (
        <p className="text-stone-500">No suites available for these dates. Try alternate dates.</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {rooms.map((r) => (
          <motion.button
            key={r._id}
            whileHover={{ y: -4 }}
            onClick={() => setRoom(r)}
            className={`text-left rounded-2xl overflow-hidden bg-white border-2 transition
              ${selectedRoom?._id === r._id ? 'border-gold-400 shadow-luxe' : 'border-transparent shadow'}`}
          >
            <RoomCarousel images={r.imageURLs} />
            <div className="p-5">
              <div className="flex items-baseline justify-between">
                <h3 className="text-xl text-forest-700">{r.type}</h3>
                <span className="text-gold-500 font-semibold">
                  ₹{Number(r.pricePerNight).toLocaleString('en-IN')}
                  <span className="text-xs text-stone-500"> / night</span>
                </span>
              </div>
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">{r.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {r.amenities?.slice(0, 4).map((a) => (
                  <span key={a} className="text-[10px] uppercase tracking-widest
                    px-2 py-1 rounded-full bg-forest-50 text-forest-700">{a}</span>
                ))}
              </div>
              <div className="mt-4 text-sm text-forest-700">
                Total for {r.nights} night{r.nights > 1 ? 's' : ''}:{' '}
                <span className="font-semibold">₹{Number(r.totalPrice).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <Footer onBack={back} onNext={next} nextDisabled={!selectedRoom} />
    </div>
  );
}

function RoomCarousel({ images = [] }) {
  const [i, setI] = useState(0);
  if (!images.length) return <div className="aspect-[4/3] bg-forest-100" />;
  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      <motion.img
        key={i} src={images[i]} alt=""
        initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
          {images.map((_, idx) => (
            <button key={idx} onClick={(e) => { e.stopPropagation(); setI(idx); }}
              className={`h-2 rounded-full transition ${idx === i ? 'bg-gold-400 w-6' : 'bg-white/60 w-2'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[0,1,2,3].map((k) => (
        <div key={k} className="rounded-2xl bg-white shadow animate-pulse">
          <div className="aspect-[4/3] bg-forest-100" />
          <div className="p-5 space-y-3">
            <div className="h-5 bg-forest-100 w-1/2 rounded" />
            <div className="h-3 bg-forest-100 w-full rounded" />
            <div className="h-3 bg-forest-100 w-3/4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Footer({ onBack, onNext, nextDisabled }) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <button onClick={onBack} className="btn-ghost">← Dates</button>
      <button onClick={onNext} disabled={nextDisabled}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
        Continue to Experiences →
      </button>
    </div>
  );
}
