import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '../../store/bookingStore';
import StepDates from './StepDates';
import StepRoom from './StepRoom';
import StepAddOns from './StepAddOns';
import StepCheckout from './StepCheckout';

const STEPS = [
  { id: 1, label: 'Dates & Guests' },
  { id: 2, label: 'Choose Your Suite' },
  { id: 3, label: 'Curated Experiences' },
  { id: 4, label: 'Secure Checkout' },
];

const variants = {
  enter:  (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function BookingWizard() {
  const step = useBookingStore((s) => s.step);

  return (
    <section className="min-h-screen bg-gradient-to-b from-cream to-forest-50 pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <p className="uppercase tracking-[0.3em] text-gold-500 text-xs mb-3">Reserve your retreat</p>
          <h1 className="text-5xl md:text-6xl text-forest-700">Begin Your Journey</h1>
          <div className="w-24 h-px bg-gold-400 mx-auto mt-6" />
        </header>

        <Stepper current={step} />

        <div className="mt-10 relative">
          <AnimatePresence mode="wait" custom={step}>
            <motion.div
              key={step}
              custom={step}
              variants={variants}
              initial="enter" animate="center" exit="exit"
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="card-luxe p-8 md:p-10"
            >
              {step === 1 && <StepDates />}
              {step === 2 && <StepRoom />}
              {step === 3 && <StepAddOns />}
              {step === 4 && <StepCheckout />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Stepper({ current }) {
  return (
    <ol className="flex items-center justify-between max-w-3xl mx-auto">
      {STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <li key={s.id} className="flex-1 flex items-center">
            <div className="flex flex-col items-center flex-1">
              <motion.div
                animate={{
                  scale: active ? 1.1 : 1,
                  backgroundColor: done || active ? '#caa138' : '#dfeae1',
                  color: done || active ? '#142719' : '#6b7280',
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold shadow-luxe"
              >
                {done ? '✓' : s.id}
              </motion.div>
              <span className={`mt-2 text-xs uppercase tracking-widest text-center
                ${active ? 'text-forest-700 font-semibold' : 'text-stone-500'}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px flex-1 mx-2 ${current > s.id ? 'bg-gold-400' : 'bg-forest-100'}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
