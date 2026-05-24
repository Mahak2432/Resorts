/**
 * Data-source abstraction.
 *
 * Each call to `getDataSource()` checks the live Mongo connection state and
 * returns either the real-DB-backed adapter (Mongoose) or the in-memory mock
 * adapter that operates on `dummyData.js`. Controllers depend only on this
 * uniform interface, so DB outages never crash a request.
 */

import { isDbConnected } from '../config/db.js';
import dummy from '../data/dummyData.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

/* ------------------------------------------------------------------ */
/*  Mock adapter — operates on cloned arrays from dummyData.js         */
/* ------------------------------------------------------------------ */

// Deep-clone so the mock store can be mutated by POSTs without aliasing.
const memory = {
  rooms:    structuredClone(dummy.rooms),
  bookings: structuredClone(dummy.bookings),
  users:    structuredClone(dummy.users),
  addOns:   structuredClone(dummy.addOns),
};

const overlaps = (a, b) =>
  new Date(a.checkIn) < new Date(b.checkOut) &&
  new Date(a.checkOut) > new Date(b.checkIn);

const mockAdapter = {
  kind: 'MOCK',
  rooms: {
    async findAll()     { return structuredClone(memory.rooms); },
    async findById(id)  { return structuredClone(memory.rooms.find(r => r._id === id)) || null; },
    async create(doc)   {
      const created = { _id: `room_${Date.now()}`, isAvailable: true, ...doc };
      memory.rooms.push(created);
      return structuredClone(created);
    },
    async update(id, patch) {
      const i = memory.rooms.findIndex(r => r._id === id);
      if (i === -1) return null;
      memory.rooms[i] = { ...memory.rooms[i], ...patch };
      return structuredClone(memory.rooms[i]);
    },
  },
  bookings: {
    async findAll() { return structuredClone(memory.bookings); },
    async findByUserEmail(email) {
      return structuredClone(
        memory.bookings.filter(b => b.email?.toLowerCase() === email.toLowerCase())
      );
    },
    async findOverlapping(roomId, checkIn, checkOut) {
      const probe = { checkIn, checkOut };
      return structuredClone(
        memory.bookings.filter(
          b => b.roomId === roomId && b.status !== 'CANCELLED' && overlaps(b, probe)
        )
      );
    },
    async create(doc) {
      const created = {
        _id: `bk_${Date.now()}`,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        createdAt: new Date().toISOString(),
        ...doc,
      };
      memory.bookings.push(created);
      return structuredClone(created);
    },
    async cancel(id, email) {
      const i = memory.bookings.findIndex(b => b._id === id);
      if (i === -1) return null;
      if (email && memory.bookings[i].email?.toLowerCase() !== email.toLowerCase()) return null;
      memory.bookings[i].status = 'CANCELLED';
      return structuredClone(memory.bookings[i]);
    },
  },
  users: {
    async findByEmail(email) {
      return structuredClone(memory.users.find(u => u.email.toLowerCase() === email.toLowerCase())) || null;
    },
    async create(doc) {
      const exists = memory.users.find(u => u.email.toLowerCase() === doc.email.toLowerCase());
      if (exists) throw new Error('Email already registered');
      const created = { _id: `usr_${Date.now()}`, role: 'GUEST', loyaltyPoints: 0, ...doc };
      memory.users.push(created);
      return structuredClone(created);
    },
  },
  addOns: {
    async findAll() { return structuredClone(memory.addOns); },
    async findById(id) { return structuredClone(memory.addOns.find(a => a._id === id)) || null; },
  },
};

/* ------------------------------------------------------------------ */
/*  Mongo adapter — same interface, backed by Mongoose                 */
/* ------------------------------------------------------------------ */

const mongoAdapter = {
  kind: 'MONGO',
  rooms: {
    async findAll()     { return Room.find().lean(); },
    async findById(id)  { return Room.findById(id).lean(); },
    async create(doc)   { return (await Room.create(doc)).toObject(); },
    async update(id, patch) {
      return Room.findByIdAndUpdate(id, patch, { new: true }).lean();
    },
  },
  bookings: {
    async findAll() { return Booking.find().sort({ checkIn: -1 }).lean(); },
    async findByUserEmail(email) {
      return Booking.find({ email: email.toLowerCase() }).sort({ checkIn: -1 }).lean();
    },
    async findOverlapping(roomId, checkIn, checkOut) {
      return Booking.find({
        roomId,
        status: { $ne: 'CANCELLED' },
        checkIn:  { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) },
      }).lean();
    },
    async create(doc)        { return (await Booking.create(doc)).toObject(); },
    async cancel(id, email)  {
      const filter = { _id: id };
      if (email) filter.email = email.toLowerCase();
      return Booking.findOneAndUpdate(filter, { status: 'CANCELLED' }, { new: true }).lean();
    },
  },
  users: {
    async findByEmail(email) { return User.findOne({ email: email.toLowerCase() }).lean(); },
    async create(doc)        { return (await User.create(doc)).toObject(); },
  },
  addOns: {
    // Add-ons live only as a static catalog — even in DB mode we read the file.
    async findAll() { return structuredClone(memory.addOns); },
    async findById(id) { return structuredClone(memory.addOns.find(a => a._id === id)) || null; },
  },
};

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export function getDataSource() {
  return isDbConnected() ? mongoAdapter : mockAdapter;
}

export function getDataSourceKind() {
  return getDataSource().kind;
}
