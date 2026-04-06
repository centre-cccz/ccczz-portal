import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const healthcheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: 'unknown',
      memory: 'ok',
      disk: 'ok'
    }
  };

  try {
    // Database health check
    await prisma.$queryRaw`SELECT 1`;
    healthcheck.checks.database = 'ok';
  } catch (error) {
    healthcheck.checks.database = 'error';
    healthcheck.status = 'error';
  }

  // Memory usage check
  const memUsage = process.memoryUsage();
  if (memUsage.heapUsed / memUsage.heapTotal > 0.9) {
    healthcheck.checks.memory = 'warning';
  }

  // Return appropriate status
  const statusCode = healthcheck.status === 'ok' ? 200 : 503;

  res.status(statusCode).json(healthcheck);
}