import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { prisma } from './db.js';

const app = express();
const PORT = Number(process.env.PORT || 4001);

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://*.vercel.app',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, message: 'Service desk API is healthy' });
  } catch (error) {
    res.status(500).json({ ok: false, message: 'Database unavailable', error: String(error) });
  }
});

app.get('/api/requests', async (_req, res) => {
  try {
    const requests = await prisma.request.findMany({
      orderBy: { receivedAt: 'desc' },
    });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error: String(error) });
  }
});

app.get('/api/requests/:id', async (req, res) => {
  try {
    const request = await prisma.request.findUnique({
      where: { id: req.params.id },
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch request', error: String(error) });
  }
});

app.post('/api/requests', async (req, res) => {
  try {
    const body = req.body || {};
    const request = await prisma.request.create({
      data: {
        customer: body.customer || '',
        ref: body.ref || null,
        source: body.source || null,
        receivedAt: body.receivedAt ? new Date(body.receivedAt) : new Date(),
        ticket: body.ticket || null,
        location: body.location || null,
        site: body.site || null,
        contact: body.contact || null,
        phone: body.phone || null,
        description: body.description || null,
        image: body.image || null,
        ma: body.ma || 'N',
        jobType: body.jobType || null,
        status: body.status || null,
        assignee: body.assignee || null,
        appointment: body.appointment ? new Date(body.appointment) : null,
        appointmentEnd: body.appointmentEnd ? new Date(body.appointmentEnd) : null,
        action: body.action || null,
        result: body.result || null,
        equipment: body.equipment || null,
        completedImage: body.completedImage || null,
        completedAt: body.completedAt ? new Date(body.completedAt) : null,
        map: body.map || null,
        vehicle: body.vehicle || null,
        notes: body.notes || null,
        file: body.file || null,
      },
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create request', error: String(error) });
  }
});

app.put('/api/requests/:id', async (req, res) => {
  try {
    const body = req.body || {};
    const request = await prisma.request.update({
      where: { id: req.params.id },
      data: {
        customer: body.customer,
        ref: body.ref,
        source: body.source,
        receivedAt: body.receivedAt ? new Date(body.receivedAt) : undefined,
        ticket: body.ticket,
        location: body.location,
        site: body.site,
        contact: body.contact,
        phone: body.phone,
        description: body.description,
        image: body.image,
        ma: body.ma,
        jobType: body.jobType,
        status: body.status,
        assignee: body.assignee,
        appointment: body.appointment ? new Date(body.appointment) : undefined,
        appointmentEnd: body.appointmentEnd ? new Date(body.appointmentEnd) : undefined,
        action: body.action,
        result: body.result,
        equipment: body.equipment,
        completedImage: body.completedImage,
        completedAt: body.completedAt ? new Date(body.completedAt) : undefined,
        map: body.map,
        vehicle: body.vehicle,
        notes: body.notes,
        file: body.file,
      },
    });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update request', error: String(error) });
  }
});

app.delete('/api/requests/:id', async (req, res) => {
  try {
    await prisma.request.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete request', error: String(error) });
  }
});

app.listen(PORT, () => {
  console.log(`Service desk API listening on http://localhost:${PORT}`);
});
