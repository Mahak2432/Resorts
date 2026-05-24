/**
 * Local fallback dataset — used by `services/dataSource.js` when Mongo is
 * unreachable. Mirrors the shape of the Mongoose models so controllers can
 * treat both transparently.
 */

export const rooms = [
  {
    _id: 'room_001',
    roomNumber: '101',
    type: 'Deluxe Pine View',
    basePrice: 12500,
    maxOccupancy: 2,
    description:
      'A west-facing suite framed by ancient cedars, with a private balcony overlooking the valley and a wood-burning stove for crisp evenings.',
    amenities: ['Mountain View', 'Private Balcony', 'King Bed', 'Wood Stove', 'Espresso Bar', 'Free Wi-Fi'],
    imageURLs: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200',
    ],
    isAvailable: true,
  },
  {
    _id: 'room_002',
    roomNumber: '203',
    type: 'Premium Valley Suite',
    basePrice: 18750,
    maxOccupancy: 3,
    description:
      'A two-room sanctuary with a sunken living lounge, soaking tub carved from local granite, and floor-to-ceiling glass framing the Dhauladhar range.',
    amenities: ['Valley Panorama', 'Soaking Tub', 'Living Lounge', 'Heated Floors', 'Private Butler', 'Wine Fridge'],
    imageURLs: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200',
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200',
    ],
    isAvailable: true,
  },
  {
    _id: 'room_003',
    roomNumber: 'PH-1',
    type: 'Presidential Suite',
    basePrice: 42000,
    maxOccupancy: 4,
    description:
      'The crown of Whispering Pines: a private rooftop infinity plunge pool, dedicated chef on call, and uninterrupted views of seven peaks.',
    amenities: ['Infinity Pool', 'Private Chef', '2 Bedrooms', 'Library Lounge', 'Sauna', 'Helipad Access'],
    imageURLs: [
      'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=1200',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200',
      'https://images.unsplash.com/photo-1601565285103-78a32c0fa86a?w=1200',
    ],
    isAvailable: true,
  },
  {
    _id: 'room_004',
    roomNumber: 'V-7',
    type: 'Family Villa',
    basePrice: 28500,
    maxOccupancy: 6,
    description:
      'A standalone three-bedroom villa wrapped in cedar timber, with a private garden, fire pit, and an interconnected playroom.',
    amenities: ['3 Bedrooms', 'Private Garden', 'Fire Pit', 'Kitchenette', 'Playroom', 'Outdoor Hot Tub'],
    imageURLs: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
      'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1200',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200',
    ],
    isAvailable: true,
  },
  {
    _id: 'room_005',
    roomNumber: 'C-3',
    type: 'Honeymoon Cottage',
    basePrice: 22000,
    maxOccupancy: 2,
    description:
      'A secluded forest cottage with a four-poster canopy bed, outdoor copper bathtub, and a candlelit terrace under the stars.',
    amenities: ['Canopy Bed', 'Copper Bathtub', 'Forest Terrace', 'Champagne Service', 'Couples Spa', 'Skylight'],
    imageURLs: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200',
      'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200',
    ],
    isAvailable: true,
  },
];

export const addOns = [
  { _id: 'add_spa_1',  category: 'SPA',         serviceName: '90-min Pine Stone Massage', price: 6500, description: 'Heated basalt stones glide across pressure points to release deep tension.' },
  { _id: 'add_spa_2',  category: 'SPA',         serviceName: 'Couples Himalayan Salt Ritual', price: 11000, description: 'Detoxifying salt scrub followed by a side-by-side massage in a cedar suite.' },
  { _id: 'add_dine_1', category: 'DINING',      serviceName: 'Private Cliffside Dinner',     price: 8500, description: 'Seven-course tasting menu by the resident chef, served on a private cliff terrace.' },
  { _id: 'add_xfer_1', category: 'TRANSFER',    serviceName: 'Luxury SUV Airport Transfer',  price: 4500, description: 'Air-conditioned executive SUV with mineral water, blankets, and Wi-Fi en route.' },
  { _id: 'add_xfer_2', category: 'TRANSFER',    serviceName: 'Private Helicopter Transfer',  price: 65000, description: 'Helicopter direct from Delhi/Chandigarh — 45 minutes door-to-door.' },
  { _id: 'add_tour_1', category: 'SIGHTSEEING', serviceName: 'Triund Sunrise Trek (Guided)', price: 3500, description: 'Pre-dawn guided hike to the Triund ridge with hot chocolate at the summit.' },
  { _id: 'add_tour_2', category: 'SIGHTSEEING', serviceName: 'Local Monastery & Tea Tour',   price: 2800, description: 'Curated half-day visit to monasteries, a working tea estate, and lunch with locals.' },
  { _id: 'add_adv_1',  category: 'ADVENTURE',   serviceName: 'Tandem Paragliding (Bir Billing)', price: 9500, description: 'Take flight at one of the world\'s top paragliding sites with a certified pilot.' },
  { _id: 'add_well_1', category: 'WELLNESS',    serviceName: 'Sunrise Yoga on the Cedar Deck', price: 2000, description: 'A 60-minute hatha session on the cedar deck as the valley wakes.' },
];

export const bookings = [
  {
    _id: 'bk_001',
    guestName: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    roomId: 'room_001',
    checkIn: '2026-06-12',
    checkOut: '2026-06-15',
    numGuests: 2,
    addOns: [{ addOnId: 'add_spa_1', quantity: 2 }],
    totalAmount: 51000,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    createdAt: '2026-04-20T10:13:00.000Z',
  },
  {
    _id: 'bk_002',
    guestName: 'Priya Khanna',
    email: 'priya.k@example.com',
    roomId: 'room_003',
    checkIn: '2026-07-04',
    checkOut: '2026-07-08',
    numGuests: 4,
    addOns: [{ addOnId: 'add_xfer_2', quantity: 1 }],
    totalAmount: 233000,
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    createdAt: '2026-04-18T14:22:00.000Z',
  },
];

export const users = [
  // bcryptjs hash of "admin123"
  {
    _id: 'usr_admin',
    name: 'Resort Admin',
    email: 'admin@whisperingpines.com',
    passwordHash: '$2a$10$kJK.8KAPep8BzavFuTYQXOPznn3Nk96TpKdPvjAMDqLcI5ChvyayW',
    role: 'ADMIN',
    loyaltyPoints: 0,
  },
  // bcryptjs hash of "guest123"
  {
    _id: 'usr_guest',
    name: 'Aarav Mehta',
    email: 'guest@example.com',
    passwordHash: '$2a$10$T3.mRVvM7lQz2QW.aA/ajOEHUD4nMaYMK7mlZBuD8IPpfmJm3ZedG',
    role: 'GUEST',
    loyaltyPoints: 1250,
  },
];

export default { rooms, addOns, bookings, users };
