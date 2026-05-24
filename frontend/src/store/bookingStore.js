import { create } from 'zustand';

const KEY = 'wp_booking_draft';
const initial = {
  step: 1,
  checkIn: null,
  checkOut: null,
  guests: 2,
  selectedRoom: null,
  addOns: {}, // { [addOnId]: qty }
  contact: { name: '', email: '' },
};

const load = () => {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...initial, ...JSON.parse(raw) } : initial;
  } catch { return initial; }
};
const save = (s) => sessionStorage.setItem(KEY, JSON.stringify(s));

export const useBookingStore = create((set) => ({
  ...load(),

  setDates: (checkIn, checkOut, guests) =>
    set((s) => { const ns = { ...s, checkIn, checkOut, guests }; save(ns); return ns; }),
  setRoom: (room) =>
    set((s) => { const ns = { ...s, selectedRoom: room }; save(ns); return ns; }),
  toggleAddOn: (id, qty = 1) =>
    set((s) => {
      const next = { ...s.addOns };
      if (next[id]) delete next[id]; else next[id] = qty;
      const ns = { ...s, addOns: next }; save(ns); return ns;
    }),
  setAddOnQty: (id, qty) =>
    set((s) => {
      const next = { ...s.addOns };
      if (qty <= 0) delete next[id]; else next[id] = qty;
      const ns = { ...s, addOns: next }; save(ns); return ns;
    }),
  setContact: (contact) =>
    set((s) => { const ns = { ...s, contact: { ...s.contact, ...contact } }; save(ns); return ns; }),
  goTo: (step) => set((s) => { const ns = { ...s, step }; save(ns); return ns; }),
  next: () => set((s) => { const ns = { ...s, step: Math.min(4, s.step + 1) }; save(ns); return ns; }),
  back: () => set((s) => { const ns = { ...s, step: Math.max(1, s.step - 1) }; save(ns); return ns; }),
  reset: () => { sessionStorage.removeItem(KEY); set(initial); },
}));
