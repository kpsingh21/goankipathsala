import { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';

/**
 * List all bus routes for the school
 */
export async function listBusRoutes(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId || req.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    let routes = await prisma.busRoute.findMany({
      where: { tenantId },
      orderBy: { routeNumber: 'asc' },
    });

    // Provide default initial routes if none exist yet
    if (routes.length === 0) {
      const defaultRoutes = [
        {
          routeNumber: 'R-01',
          routeName: 'Goradiya - Dhargul - Rampur Express',
          vehicleNumber: 'MP-09-AB-1234',
          driverName: 'Rameshwar Gurjar',
          driverPhone: '+91 98260 11223',
          morningPickupTime: '07:15 AM',
          eveningDropTime: '02:30 PM',
          capacity: 32,
          monthlyFee: 500.0,
          stops: [
            { name: 'Goradiya Chaupal', time: '07:15 AM' },
            { name: 'Dhargul Bus Stand', time: '07:30 AM' },
            { name: 'Rampur Mandir', time: '07:45 AM' },
            { name: 'School Campus', time: '08:05 AM' },
          ],
        },
        {
          routeNumber: 'R-02',
          routeName: 'Khedi - Pipliya - Badodia Route',
          vehicleNumber: 'MP-09-CD-5678',
          driverName: 'Mukesh Yadav',
          driverPhone: '+91 98261 44556',
          morningPickupTime: '07:20 AM',
          eveningDropTime: '02:35 PM',
          capacity: 32,
          monthlyFee: 550.0,
          stops: [
            { name: 'Khedi Primary School', time: '07:20 AM' },
            { name: 'Pipliya Fata', time: '07:35 AM' },
            { name: 'Badodia Square', time: '07:50 AM' },
            { name: 'School Campus', time: '08:10 AM' },
          ],
        },
      ];

      for (const r of defaultRoutes) {
        await prisma.busRoute.create({
          data: {
            tenantId,
            ...r,
          },
        });
      }

      routes = await prisma.busRoute.findMany({
        where: { tenantId },
        orderBy: { routeNumber: 'asc' },
      });
    }

    return res.json({ routes });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Create or update a bus route (Admin only)
 */
export async function createOrUpdateBusRoute(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    if (!tenantId) {
      return res.status(400).json({ error: 'School tenant context missing.' });
    }

    const {
      id,
      routeNumber,
      routeName,
      vehicleNumber,
      driverName,
      driverPhone,
      stops,
      morningPickupTime,
      eveningDropTime,
      capacity,
      monthlyFee,
    } = req.body;

    if (!routeNumber || !routeName || !driverName || !driverPhone) {
      return res.status(400).json({
        error: 'Route number, route name, driver name, and driver phone are required.',
      });
    }

    let route;
    if (id) {
      route = await prisma.busRoute.update({
        where: { id },
        data: {
          routeNumber: routeNumber.trim(),
          routeName: routeName.trim(),
          vehicleNumber: vehicleNumber ? vehicleNumber.trim() : 'TBD',
          driverName: driverName.trim(),
          driverPhone: driverPhone.trim(),
          stops: stops || [],
          morningPickupTime: morningPickupTime || '07:30 AM',
          eveningDropTime: eveningDropTime || '02:30 PM',
          capacity: capacity ? parseInt(capacity) : 32,
          monthlyFee: monthlyFee ? parseFloat(monthlyFee) : 500.0,
        },
      });
    } else {
      route = await prisma.busRoute.upsert({
        where: {
          tenantId_routeNumber: {
            tenantId,
            routeNumber: routeNumber.trim(),
          },
        },
        create: {
          tenantId,
          routeNumber: routeNumber.trim(),
          routeName: routeName.trim(),
          vehicleNumber: vehicleNumber ? vehicleNumber.trim() : 'TBD',
          driverName: driverName.trim(),
          driverPhone: driverPhone.trim(),
          stops: stops || [],
          morningPickupTime: morningPickupTime || '07:30 AM',
          eveningDropTime: eveningDropTime || '02:30 PM',
          capacity: capacity ? parseInt(capacity) : 32,
          monthlyFee: monthlyFee ? parseFloat(monthlyFee) : 500.0,
        },
        update: {
          routeName: routeName.trim(),
          vehicleNumber: vehicleNumber ? vehicleNumber.trim() : 'TBD',
          driverName: driverName.trim(),
          driverPhone: driverPhone.trim(),
          stops: stops || [],
          morningPickupTime: morningPickupTime || '07:30 AM',
          eveningDropTime: eveningDropTime || '02:30 PM',
          capacity: capacity ? parseInt(capacity) : 32,
          monthlyFee: monthlyFee ? parseFloat(monthlyFee) : 500.0,
        },
      });
    }

    return res.status(201).json({
      message: 'Bus route saved successfully',
      route,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Delete a bus route (Admin only)
 */
export async function deleteBusRoute(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;

    if (!tenantId || !id) {
      return res.status(400).json({ error: 'Route ID and tenant context required.' });
    }

    const route = await prisma.busRoute.findFirst({
      where: { id: id as string, tenantId },
    });

    if (!route) {
      return res.status(404).json({ error: 'Bus route not found.' });
    }

    await prisma.busRoute.delete({ where: { id: route.id } });

    return res.json({ message: 'Bus route deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

/**
 * Update an existing bus route (Admin only)
 */
export async function updateBusRoute(req: Request, res: Response) {
  try {
    const tenantId = req.user?.tenantId;
    const { id } = req.params;
    const {
      routeNumber,
      routeName,
      vehicleNumber,
      driverName,
      driverPhone,
      stops,
      morningPickupTime,
      eveningDropTime,
      capacity,
      monthlyFee,
    } = req.body;

    if (!tenantId || !id) {
      return res.status(400).json({ error: 'Route ID and tenant context required.' });
    }

    const existing = await prisma.busRoute.findFirst({
      where: { id: id as string, tenantId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Bus route not found.' });
    }

    const updated = await prisma.busRoute.update({
      where: { id: existing.id },
      data: {
        ...(routeNumber && { routeNumber: routeNumber.trim() }),
        ...(routeName && { routeName: routeName.trim() }),
        ...(vehicleNumber !== undefined && { vehicleNumber: vehicleNumber ? vehicleNumber.trim() : 'TBD' }),
        ...(driverName && { driverName: driverName.trim() }),
        ...(driverPhone && { driverPhone: driverPhone.trim() }),
        ...(stops !== undefined && { stops: stops || [] }),
        ...(morningPickupTime && { morningPickupTime }),
        ...(eveningDropTime && { eveningDropTime }),
        ...(capacity !== undefined && { capacity: parseInt(capacity) }),
        ...(monthlyFee !== undefined && { monthlyFee: parseFloat(monthlyFee) }),
      },
    });

    return res.json({
      message: 'Bus route updated successfully!',
      route: updated,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}

