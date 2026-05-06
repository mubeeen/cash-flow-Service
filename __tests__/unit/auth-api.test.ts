/**
 * @jest-environment node
 */
import { existingUser } from '../mocks/auth/auth_response_data';
import { validRegisterInput, invalidRegisterInput, validLoginInput, wrongPasswordLoginInput } from '../mocks/auth/auth_request_data';

jest.mock('@/lib/db', () => ({
  prisma: {
    user: { findUnique: jest.fn(), create: jest.fn() },
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({ set: jest.fn(), delete: jest.fn() })),
}));

import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { POST as register } from '@/app/api/auth/register/route';
import { POST as login } from '@/app/api/auth/login/route';

describe('POST /api/auth/register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a new user', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue(existingUser);

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(validRegisterInput),
    });

    const response = await register(request);
    expect(response.status).toBe(201);
    expect(bcrypt.hash).toHaveBeenCalledWith('12345678', 10);
  });

  it('returns 409 if email exists', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(validRegisterInput),
    });

    const response = await register(request);
    const body = await response.json();
    expect(response.status).toBe(409);
    expect(body.error.message).toBe('Email already registered');
  });

  it('returns 422 if fields missing', async () => {
    const request = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(invalidRegisterInput),
    });

    const response = await register(request);
    expect(response.status).toBe(422);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 401 for wrong email', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(validLoginInput),
    });

    const response = await login(request);
    expect(response.status).toBe(401);
  });

  it('returns 401 for wrong password', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const request = new Request('http://localhost/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(wrongPasswordLoginInput),
    });

    const response = await login(request);
    expect(response.status).toBe(401);
  });
});
