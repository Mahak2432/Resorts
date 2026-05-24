import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function SuitesPage() {
  const [rooms, setRooms] = useState([]);
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rooms')
      .then((res) => { setRooms(res.data.rooms); setSource(res.data.source); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-cream to-forest-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="uppercase tracking-[0.3em] text-gold-500 text-xs">Suites & villas</p>
            <h1 className="text-5xl md:text-6xl text-forest-700 mt-3">Rooms with a view, silence included</h1>
          </div>
          {source && (
            <span className="hidden sm:inline-flex text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-white text-forest-700 border border-forest-100">
              data: {source}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[0, 1, 2].map((item) => <div key={item} className="h-96 card-luxe animate-pulse bg-forest-100" />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {rooms.map((room, index) => (
              <motion.article
                key={room._id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="card-luxe group"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={room.imageURLs?.[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-gold-500">Room {room.roomNumber}</p>
                      <h2 className="text-2xl text-forest-700 mt-1">{room.type}</h2>
                    </div>
                    <span className="text-gold-500 font-semibold whitespace-nowrap">
                      ₹{Number(room.basePrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500 mt-3 line-clamp-3">{room.description}</p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {room.amenities?.slice(0, 5).map((amenity) => (
                      <span key={amenity} className="text-[10px] uppercase tracking-widest px-2 py-1 rounded-full bg-forest-50 text-forest-700">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <Link to="/book" className="btn-primary w-full mt-6 !py-2">Reserve this suite</Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
