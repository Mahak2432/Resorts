import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../store/authStore';

export default function AdminDashboard() {
  const user = useAuth((s) => s.user);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [source, setSource] = useState(null);

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    api.get('/rooms').then((r) => { setRooms(r.data.rooms); setSource(r.data.source); });
    api.get('/bookings').then((r) => setBookings(r.data.bookings));
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />;

  const updatePrice = async (id, basePrice) => {
    const { data } = await api.patch(`/rooms/${id}`, { basePrice: Number(basePrice) });
    setRooms((rs) => rs.map((x) => x._id === id ? data : x));
  };

  return (
    <div className="pt-32 max-w-7xl mx-auto px-6 pb-20">
      <div className="flex items-end justify-between">
        <h1 className="font-display text-5xl text-forest-700">Operations</h1>
        {source && (
          <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded-full
                          bg-forest-50 text-forest-700 border border-forest-100">
            data: {source}
          </span>
        )}
      </div>

      <h2 className="font-display text-3xl text-forest-700 mt-10 mb-4">Inventory & dynamic pricing</h2>
      <div className="card-luxe overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-forest-50 text-forest-700 uppercase tracking-widest text-xs">
            <tr>
              <th className="text-left p-4">#</th>
              <th className="text-left p-4">Suite</th>
              <th className="text-left p-4">Available</th>
              <th className="text-left p-4">Base price (₹/night)</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r._id} className="border-t border-forest-100">
                <td className="p-4 font-medium">{r.roomNumber}</td>
                <td className="p-4 text-stone-700">{r.type}</td>
                <td className="p-4">{r.isAvailable ? '✅' : '—'}</td>
                <td className="p-4">
                  <input type="number" defaultValue={r.basePrice}
                         onBlur={(e) => updatePrice(r._id, e.target.value)}
                         className="w-32 px-3 py-1 border border-forest-200 rounded focus:border-gold-400 outline-none" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-3xl text-forest-700 mt-12 mb-4">All reservations</h2>
      <div className="card-luxe p-6">
        {bookings.length === 0 ? (
          <p className="text-stone-500 text-sm">No bookings yet.</p>
        ) : (
          <ul className="divide-y divide-forest-100">
            {bookings.map((b) => (
              <li key={b._id} className="py-3 flex justify-between text-sm">
                <span>{b.guestName} · room {String(b.roomId).slice(-6)}</span>
                <span className="text-stone-500">
                  {String(b.checkIn).slice(0,10)} → {String(b.checkOut).slice(0,10)} · {b.status}
                </span>
                <span className="text-gold-500 font-semibold">
                  ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
