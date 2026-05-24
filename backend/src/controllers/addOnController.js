import asyncHandler from 'express-async-handler';
import { getDataSource } from '../services/dataSource.js';

export const listAddOns = asyncHandler(async (_req, res) => {
  const ds = getDataSource();
  const addOns = await ds.addOns.findAll();
  res.json({ source: ds.kind, addOns });
});
