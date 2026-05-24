const intents = new Map();

const TEST_SUCCESS_CARD = '4242424242424242';

export function createPaymentIntent({ amount, currency = 'INR', bookingDraft, source }) {
  if (!amount || amount <= 0) {
    const err = new Error('Payment amount must be greater than zero');
    err.status = 400;
    throw err;
  }

  const id = `pi_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const intent = {
    id,
    provider: 'MOCK_GATEWAY',
    amount: Number(amount),
    currency,
    status: 'requires_confirmation',
    clientSecret: `${id}_secret_${Math.random().toString(36).slice(2, 18)}`,
    bookingDraft,
    source,
    createdAt: new Date().toISOString(),
  };
  intents.set(id, intent);
  return structuredClone(intent);
}

export function confirmPaymentIntent({ paymentIntentId, cardNumber, nameOnCard }) {
  const intent = intents.get(paymentIntentId);
  if (!intent) {
    const err = new Error('Payment intent not found');
    err.status = 404;
    throw err;
  }

  const normalized = String(cardNumber || '').replace(/\D/g, '');
  if (!nameOnCard || normalized !== TEST_SUCCESS_CARD) {
    intent.status = 'failed';
    intent.failureReason = 'Use test card 4242 4242 4242 4242 to approve payment.';
    intents.set(intent.id, intent);
    const err = new Error(intent.failureReason);
    err.status = 402;
    throw err;
  }

  intent.status = 'succeeded';
  intent.confirmedAt = new Date().toISOString();
  intent.cardLast4 = normalized.slice(-4);
  intent.nameOnCard = nameOnCard;
  intents.set(intent.id, intent);
  return structuredClone(intent);
}

export function getPaymentIntent(id) {
  const intent = intents.get(id);
  return intent ? structuredClone(intent) : null;
}

export function assertPaymentSucceeded(paymentIntentId, expectedAmount) {
  const intent = getPaymentIntent(paymentIntentId);
  if (!intent) {
    const err = new Error('Payment must be created before booking');
    err.status = 402;
    throw err;
  }

  if (intent.status !== 'succeeded') {
    const err = new Error('Payment has not been confirmed');
    err.status = 402;
    throw err;
  }

  if (Number(intent.amount) !== Number(expectedAmount)) {
    const err = new Error('Payment amount does not match booking total');
    err.status = 409;
    throw err;
  }

  return intent;
}