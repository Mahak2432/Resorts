import asyncHandler from 'express-async-handler';
import { getDataSource, getDataSourceKind } from '../services/dataSource.js';

/**
 * GET /api/rooms
 *
 * The exemplar of the DB / dummy fallback. The controller never knows or
 * cares which one is live — `getDataSource()` decides per-request.
 */
export const listRooms = asyncHandler(async (_req, res) => {
  const ds = getDataSource();
  const rooms = await ds.rooms.findAll();
  res.json({ source: ds.kind, count: rooms.length, rooms });
});

export const getRoom = asyncHandler(async (req, res) => {
  const ds = getDataSource();
  const room = await ds.rooms.findById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json(room);
});

/* --------- Admin --------- */

export const createRoom = asyncHandler(async (req, res) => {
  const ds = getDataSource();
  const created = await ds.rooms.create(req.body);
  res.status(201).json(created);
});

export const updateRoom = asyncHandler(async (req, res) => {
  const ds = getDataSource();
  const updated = await ds.rooms.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Room not found' });
  res.json(updated);
});

/** Diagnostic endpoint exposing the live data source. */
export const dataSourceStatus = asyncHandler(async (_req, res) => {
  res.json({ status: 'ok', dataSource: getDataSourceKind() });
});
