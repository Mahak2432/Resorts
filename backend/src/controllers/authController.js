import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import { getDataSource } from '../services/dataSource.js';
import { signToken } from '../middleware/auth.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }
  const ds = getDataSource();
  const existing = await ds.users.findByEmail(email);
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await ds.users.create({
    name, email: email.toLowerCase(), passwordHash, role: 'GUEST', loyaltyPoints: 0,
  });
  res.status(201).json({
    token: signToken(user),
    user: publicUser(user),
    source: ds.kind,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  const ds = getDataSource();
  const user = await ds.users.findByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  res.json({ token: signToken(user), user: publicUser(user), source: ds.kind });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

function publicUser(u) {
  return { _id: u._id, name: u.name, email: u.email, role: u.role, loyaltyPoints: u.loyaltyPoints };
}
