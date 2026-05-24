import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../store/authStore';

export default function GuestDashboard() {
  const user = useAuth((s) => s.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get('/bookings/me')
       .then((r) => setBookings(r.data.bookings))
       .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const cancel = async (id) => {
    const { data } = await api.post(`/bookings/${id}/cancel`);
    setBookings((bs) => bs.map((b) => b._id === id ? data : b));
  };

  return (
    <div className="pt-32 max-w-5xl mx-auto px-6 pb-20">
      <p className="uppercase tracking-[0.3em] text-gold-500 text-xs">Welcome back</p>
      <h1 className="text-5xl text-forest-700 mt-2">{user.name}</h1>
      <p className="text-stone-500 mt-1">
        Loyalty balance: <span className="text-gold-500 font-semibold">{user.loyaltyPoints} pts</span>
      </p>

      <h2 className="font-display text-2xl text-forest-700 mt-12 mb-4">Your reservations</h2>
      {loading ? <p>Loading…</p> : bookings.length === 0 ? (
        <p className="text-stone-500">
          No reservations yet. <Link to="/book" className="text-gold-500 underline">Book your first stay</Link>.
        </p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li key={b._id} className="card-luxe p-6 flex justify-between items-center">
              <div>
                <div className="text-forest-700 font-display text-lg">
                  {String(b.checkIn).slice(0,10)} → {String(b.checkOut).slice(0,10)}
                </div>
                <div className="text-sm text-stone-500">{b.numGuests} guests · {b.status}</div>
              </div>
              <div className="text-right">
                <div className="text-gold-500 font-semibold">
                  ₹{Number(b.totalAmount).toLocaleString('en-IN')}
                </div>
                {b.status !== 'CANCELLED' && b.status !== 'CHECKED_OUT' && (
                  <button onClick={() => cancel(b._id)}
                          className="text-xs text-red-600 hover:underline mt-2">
                    Cancel
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
