/** Centralised error handler — keeps controllers slim. */
export function errorHandler(err, _req, res, _next) {
  console.error('🔥', err);
  const status = err.status || 500;
  res.status(status).json({
    message: err.publicMessage || err.message || 'Server error',
  });
}

export function notFound(_req, res) {
  res.status(404).json({ message: 'Not found' });
}
