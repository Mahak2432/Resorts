import mongoose from 'mongoose';

const bookedAddOnSchema = new mongoose.Schema(
  {
    addOnId:     { type: String, required: true },
    serviceName: String,
    price:       Number,
    quantity:    { type: Number, default: 1, min: 1 },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true, trim: true },
    email:     { type: String, required: true, lowercase: true, trim: true },
    userId:    { type: String, default: null, index: true },
    roomId:    { type: String, required: true, index: true },
    checkIn:   { type: Date, required: true },
    checkOut:  { type: Date, required: true },
    numGuests: { type: Number, default: 2, min: 1 },
    addOns:    { type: [bookedAddOnSchema], default: [] },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PAID', 'REFUNDED', 'FAILED'],
      default: 'PAID',
    },
    paymentProvider: { type: String, default: 'MOCK_GATEWAY' },
    paymentIntentId: { type: String, default: null },
  },
  { timestamps: true }
);

// Anti-overlap query helper: { roomId, checkIn:{$lt:out}, checkOut:{$gt:in} }
bookingSchema.index({ roomId: 1, checkIn: 1, checkOut: 1 });

export default mongoose.model('Booking', bookingSchema);
