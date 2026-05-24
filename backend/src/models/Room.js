import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    type:       { type: String, required: true, trim: true },
    basePrice:  { type: Number, required: true, min: 0 },
    maxOccupancy: { type: Number, default: 2, min: 1, max: 12 },
    description: { type: String, default: '' },
    amenities:  { type: [String], default: [] },
    imageURLs:  { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Room', roomSchema);
