import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { differenceInCalendarDays, format } from 'date-fns';
import { useBookingStore } from '../../store/bookingStore';

export default function StepDates() {
  const { checkIn, checkOut, guests, setDates, next } = useBookingStore();
  const [range, setRange] = useState({
    from: checkIn ? new Date(checkIn) : undefined,
    to:   checkOut ? new Date(checkOut) : undefined,
  });
  const [g, setG] = useState(guests || 2);

  const nights = range.from && range.to ? differenceInCalendarDays(range.to, range.from) : 0;
  const valid = nights >= 1 && g >= 1;

  const handleNext = () => {
    setDates(format(range.from, 'yyyy-MM-dd'), format(range.to, 'yyyy-MM-dd'), g);
    next();
  };

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div>
        <h2 className="text-3xl text-forest-700 mb-2">When will you arrive?</h2>
        <p className="text-stone-500 mb-6">Select your check-in and check-out dates.</p>
        <div className="rounded-xl border border-forest-100 p-2 inline-block bg-cream">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            disabled={{ before: new Date() }}
            modifiersClassNames={{
              selected: 'bg-forest-700 text-cream',
              range_middle: 'bg-forest-200/60 text-forest-900',
              today: 'text-gold-500 font-semibold',
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-2xl text-forest-700">Guests</h3>
          <div className="mt-3 flex items-center gap-4">
            <button onClick={() => setG((v) => Math.max(1, v - 1))}
                    className="w-11 h-11 rounded-full border border-forest-300 text-forest-700 text-xl
                               hover:bg-forest-700 hover:text-cream transition">−</button>
            <span className="text-3xl font-display w-10 text-center">{g}</span>
            <button onClick={() => setG((v) => Math.min(12, v + 1))}
                    className="w-11 h-11 rounded-full border border-forest-300 text-forest-700 text-xl
                               hover:bg-forest-700 hover:text-cream transition">+</button>
          </div>
        </div>

        <div className="rounded-xl bg-forest-50 border border-forest-100 p-5">
          <div className="text-xs uppercase tracking-widest text-gold-500">Your stay</div>
          <div className="mt-2 text-forest-700 text-lg">
            {range.from ? format(range.from, 'EEE, MMM d') : '—'}
            <span className="mx-2 text-gold-400">→</span>
            {range.to ? format(range.to, 'EEE, MMM d') : '—'}
          </div>
          <div className="mt-1 text-stone-500 text-sm">
            {nights > 0 ? `${nights} night${nights > 1 ? 's' : ''}` : 'Pick at least one night'}
          </div>
        </div>

        <button onClick={handleNext} disabled={!valid}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed mt-auto">
          Continue to Suites
        </button>
      </div>
    </div>
  );
}
