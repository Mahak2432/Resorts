import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api/client';
import { useBookingStore } from '../../store/bookingStore';
import { useAuth } from '../../store/authStore';

const TAX_RATE = 0.18;

export default function StepCheckout() {
  const { checkIn, checkOut, guests, selectedRoom, addOns, contact, setContact, back, reset } = useBookingStore();
  const user = useAuth((s) => s.user);
  const [catalog, setCatalog] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [card, setCard] = useState({ nameOnCard: '', number: '4242 4242 4242 4242', expiry: '12 / 30', cvc: '123' });

  useEffect(() => {
    api.get('/addons').then((r) => setCatalog(r.data.addOns)).catch(() => {});
    if (user) setContact({ name: user.name, email: user.email });
  }, [user, setContact]);

  const totals = useMemo(() => {
    const roomTotal = Number(selectedRoom?.totalPrice || 0);
    const addOnsTotal = catalog.reduce((sum, a) => {
      const q = addOns[a._id] || 0;
      return sum + q * Number(a.price);
    }, 0);
    const subtotal = roomTotal + addOnsTotal;
    const taxes = +(subtotal * TAX_RATE).toFixed(2);
    const grand = +(subtotal + taxes).toFixed(2);
    return { roomTotal, addOnsTotal, taxes, grand };
  }, [selectedRoom, addOns, catalog]);

  const handleConfirm = async () => {
    setSubmitting(true); setError(null);
    try {
      const payload = {
        guestName: contact.name,
        email: contact.email,
        roomId: selectedRoom._id,
        checkIn, checkOut,
        numGuests: guests,
        addOns: Object.entries(addOns).map(([addOnId, quantity]) => ({ addOnId, quantity })),
      };

      const intentResponse = await api.post('/payments/create-intent', payload);
      setPaymentIntent(intentResponse.data);

      await api.post('/payments/confirm', {
        paymentIntentId: intentResponse.data.paymentIntentId,
        nameOnCard: card.nameOnCard || contact.name,
        cardNumber: card.number,
        expiry: card.expiry,
        cvc: card.cvc,
      });

      const { data } = await api.post('/bookings', {
        ...payload,
        paymentIntentId: intentResponse.data.paymentIntentId,
      });
      setConfirmation({ ...data.booking, paymentProvider: data.booking.paymentProvider || 'MOCK_GATEWAY' });
      reset();
    } catch (e) {
      setError(e.response?.data?.message || 'Payment or booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
        <div className="text-5xl text-gold-400">✓</div>
        <h2 className="text-3xl text-forest-700 mt-4">Reservation confirmed</h2>
        <p className="text-stone-500 mt-2">
          Confirmation #{confirmation._id} — we look forward to welcoming you.
        </p>
        <p className="text-xs uppercase tracking-[0.25em] text-gold-500 mt-4">
          Paid via {confirmation.paymentProvider || 'MOCK_GATEWAY'}
        </p>
        <a href="/dashboard" className="btn-primary mt-8">View in dashboard</a>
      </motion.div>
    );
  }

  const valid = contact.name && contact.email && selectedRoom;

  return (
    <div className="grid md:grid-cols-5 gap-8">
      <div className="md:col-span-3">
        <h2 className="text-3xl text-forest-700">Secure checkout</h2>
        <p className="text-stone-500 mt-1">
          Demo gateway enabled. Use test card <span className="text-forest-700 font-medium">4242 4242 4242 4242</span>.
        </p>

        <div className="mt-6 space-y-4">
          <Field label="Guest name">
            <input className={inputCls}
                   value={contact.name}
                   onChange={(e) => setContact({ name: e.target.value })} />
          </Field>
          <Field label="Email">
            <input type="email" className={inputCls}
                   value={contact.email}
                   onChange={(e) => setContact({ email: e.target.value })} />
          </Field>
          <Field label="Name on card">
            <input className={inputCls}
                   value={card.nameOnCard}
                   placeholder={contact.name || 'As printed on card'}
                   onChange={(e) => setCard({ ...card, nameOnCard: e.target.value })} />
          </Field>
          <Field label="Card number">
            <input className={inputCls}
                   value={card.number}
                   onChange={(e) => setCard({ ...card, number: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Expiry">
              <input className={inputCls}
                     value={card.expiry}
                     onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
            </Field>
            <Field label="CVC">
              <input type="password" className={inputCls}
                     value={card.cvc}
                     onChange={(e) => setCard({ ...card, cvc: e.target.value })} />
            </Field>
          </div>
        </div>

        {paymentIntent && (
          <p className="mt-4 rounded-xl bg-forest-50 border border-forest-100 text-forest-700 px-4 py-3 text-xs uppercase tracking-widest">
            Gateway intent {paymentIntent.paymentIntentId} created · {paymentIntent.status}
          </p>
        )}

        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}

        <div className="mt-8 flex items-center justify-between">
          <button onClick={back} className="btn-ghost">← Experiences</button>
          <button onClick={handleConfirm} disabled={submitting || !valid}
                  className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
            {submitting ? 'Confirming…' : `Pay ₹${totals.grand.toLocaleString('en-IN')}`}
          </button>
        </div>
      </div>

      <aside className="md:col-span-2">
        <div className="rounded-2xl bg-forest-50 border border-forest-100 p-6 sticky top-32">
          <h3 className="uppercase tracking-[0.25em] text-xs text-gold-500">Reservation summary</h3>
          {selectedRoom && (
            <div className="mt-4">
              <div className="text-lg font-display text-forest-700">{selectedRoom.type}</div>
              <div className="text-sm text-stone-500">
                {checkIn} → {checkOut} · {guests} guest{guests > 1 ? 's' : ''}
              </div>
            </div>
          )}
          <hr className="my-5 border-forest-100" />
          <Row label={`Suite (${selectedRoom?.nights || 0} nights)`} value={totals.roomTotal} />
          <Row label="Add-on experiences"                              value={totals.addOnsTotal} />
          <Row label="Taxes & fees (18%)"                              value={totals.taxes} />
          <hr className="my-4 border-forest-100" />
          <div className="flex justify-between text-forest-700">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-display text-gold-500">
              ₹{totals.grand.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}

const inputCls = 'w-full rounded-lg border border-forest-200 bg-white px-4 py-3 ' +
                 'focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200 transition';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-stone-500 mb-1">{label}</span>
      {children}
    </label>
  );
}
function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-stone-500">{label}</span>
      <span className="text-forest-700">₹{Number(value || 0).toLocaleString('en-IN')}</span>
    </div>
  );
}
