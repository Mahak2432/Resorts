import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <section className="pt-32 pb-20 bg-gradient-to-b from-cream to-forest-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <p className="uppercase tracking-[0.3em] text-gold-500 text-xs">Contact</p>
          <h1 className="text-5xl text-forest-700 mt-3">Let us arrange your arrival</h1>
          <p className="text-stone-500 mt-5 leading-relaxed">
            Our reservation desk can coordinate transfers, dietary preferences, milestone celebrations, and private itineraries before you arrive.
          </p>

          <div className="mt-10 space-y-5 text-sm">
            <Info label="Reservations" value="reservations@whisperingpines.example" />
            <Info label="Phone" value="+91 98765 43210" />
            <Info label="Address" value="Cedar Ridge Road, Dharamshala, Himachal Pradesh" />
            <Info label="Concierge hours" value="24 hours, every day" />
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={(event) => { event.preventDefault(); setSent(true); }}
          className="lg:col-span-3 card-luxe p-8 space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name"><input required className={inputCls} /></Field>
            <Field label="Email"><input required type="email" className={inputCls} /></Field>
          </div>
          <Field label="Travel dates"><input className={inputCls} placeholder="June 12 - June 15" /></Field>
          <Field label="How can we help?">
            <textarea required rows={6} className={`${inputCls} resize-none`} placeholder="Tell us about your stay, preferences, or occasion." />
          </Field>
          {sent && (
            <p className="rounded-xl bg-forest-50 border border-forest-100 text-forest-700 px-4 py-3 text-sm">
              Thank you. The concierge desk has received your request in this demo flow.
            </p>
          )}
          <button className="btn-primary">Send enquiry</button>
        </motion.form>
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="uppercase tracking-[0.25em] text-[10px] text-gold-500">{label}</p>
      <p className="text-forest-700 mt-1">{value}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-stone-500 mb-1">{label}</span>
      {children}
    </label>
  );
}

const inputCls = 'w-full rounded-lg border border-forest-200 bg-white px-4 py-3 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-200 transition';
