const TAX_RATE = 0.18;

export const nightsBetween = (checkIn, checkOut) =>
  Math.round((new Date(checkOut) - new Date(checkIn)) / 86_400_000);

export function validateStayDates(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    const err = new Error('checkIn and checkOut are required');
    err.status = 400;
    throw err;
  }

  const arrival = new Date(checkIn);
  const departure = new Date(checkOut);
  if (Number.isNaN(+arrival) || Number.isNaN(+departure)) {
    const err = new Error('Invalid date format');
    err.status = 400;
    throw err;
  }

  if (arrival >= departure) {
    const err = new Error('checkOut must be after checkIn');
    err.status = 400;
    throw err;
  }
}

export async function calculateStayQuote(ds, payload) {
  const { roomId, checkIn, checkOut, numGuests = 2, addOns = [] } = payload;
  validateStayDates(checkIn, checkOut);

  if (!roomId) {
    const err = new Error('roomId is required');
    err.status = 400;
    throw err;
  }

  const room = await ds.rooms.findById(roomId);
  if (!room) {
    const err = new Error('Room not found');
    err.status = 404;
    throw err;
  }

  if ((room.maxOccupancy || 2) < Number(numGuests)) {
    const err = new Error('Guest count exceeds room occupancy');
    err.status = 400;
    throw err;
  }

  const nights = nightsBetween(checkIn, checkOut);
  const roomTotal = Number(room.basePrice) * nights;

  const catalog = await ds.addOns.findAll();
  const byId = Object.fromEntries(catalog.map((item) => [item._id, item]));
  const bookedAddOns = [];
  let addOnsTotal = 0;

  for (const selection of addOns || []) {
    const item = byId[selection.addOnId];
    if (!item) {
      const err = new Error(`Unknown add-on: ${selection.addOnId}`);
      err.status = 400;
      throw err;
    }

    const quantity = Math.max(1, Number(selection.quantity) || 1);
    addOnsTotal += Number(item.price) * quantity;
    bookedAddOns.push({
      addOnId: item._id,
      serviceName: item.serviceName,
      price: Number(item.price),
      quantity,
    });
  }

  const subtotal = roomTotal + addOnsTotal;
  const taxes = +(subtotal * TAX_RATE).toFixed(2);
  const totalAmount = +(subtotal + taxes).toFixed(2);

  return {
    room,
    nights,
    roomTotal,
    addOnsTotal,
    taxes,
    totalAmount,
    bookedAddOns,
  };
}