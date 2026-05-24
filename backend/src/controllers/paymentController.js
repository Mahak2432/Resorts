import asyncHandler from 'express-async-handler';
import { getDataSource } from '../services/dataSource.js';
import { calculateStayQuote } from '../services/pricing.js';
import { confirmPaymentIntent, createPaymentIntent } from '../services/paymentGateway.js';

export const createIntent = asyncHandler(async (req, res) => {
  const ds = getDataSource();
  const quote = await calculateStayQuote(ds, req.body);

  const conflicts = await ds.bookings.findOverlapping(
    req.body.roomId,
    req.body.checkIn,
    req.body.checkOut
  );
  if (conflicts.length) {
    return res.status(409).json({ message: 'Room no longer available for these dates' });
  }

  const intent = createPaymentIntent({
    amount: quote.totalAmount,
    currency: 'INR',
    bookingDraft: req.body,
    source: ds.kind,
  });

  res.status(201).json({
    source: ds.kind,
    provider: intent.provider,
    paymentIntentId: intent.id,
    clientSecret: intent.clientSecret,
    status: intent.status,
    quote: {
      nights: quote.nights,
      roomTotal: quote.roomTotal,
      addOnsTotal: quote.addOnsTotal,
      taxes: quote.taxes,
      totalAmount: quote.totalAmount,
    },
  });
});

export const confirmIntent = asyncHandler(async (req, res) => {
  const intent = confirmPaymentIntent(req.body);
  res.json({
    provider: intent.provider,
    paymentIntentId: intent.id,
    status: intent.status,
    amount: intent.amount,
    currency: intent.currency,
    cardLast4: intent.cardLast4,
  });
});