import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import User from '../src/models/User';
import redisClient from '../src/services/redisService';
import {
  connectToRabbitMQ,
  disconnectRabbitMQ,
} from '../src/services/rabbitmqService';

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    await redisClient.connect();
    await connectToRabbitMQ();
    await User.deleteMany({});
  } catch (error) {
    process.exit(1);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
    await redisClient.disconnect();
    await disconnectRabbitMQ();
  } catch (error) {
    process.exit(1);
  }
});

describe('User Routes', () => {
  let token: string;
  let userId: string;

  // Register a new user
  it('Register a user', async () => {
    const registerRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Deepak Kumar Mandal',
      email: 'mdeepak.be16@gmail.com',
      password: 'Deepak123@',
    });

    expect(registerRes.statusCode).toEqual(201);
    expect(registerRes.body.success).toBe(true);
    expect(registerRes.body).toHaveProperty('token');
  });

  // Login with the registered user
  it('Login a user', async () => {
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'mdeepak.be16@gmail.com',
      password: 'Deepak123@',
    });

    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body).toHaveProperty('token');

    token = loginRes.body.token;
  });

  // Test get all users
  it('Get all users', async () => {
    const users = await User.create([
      { name: 'User 1', email: 'user1@example.com', password: 'Password123!' },
      { name: 'User 2', email: 'user2@example.com', password: 'Password456!' },
    ]);
    const res = await request(app).get(`/api/v1/users`)
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength((users.length + 1));
  });

  // Test creating a new user
  it('Create a new user', async () => {
    const res = await request(app).post('/api/v1/users')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'Password123@',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    userId = res.body.data._id;
  });

  // Test retrieving user information
  it('Get user information', async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`)
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', userId);
  });

  // Test updating user information
  it('Update user information', async () => {
    const updatedUserData = {
      name: 'Updated User',
      email: 'updateduser@example.com',
    };

    const res = await request(app)
      .put(`/api/v1/users/${userId}`)
      .send(updatedUserData)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id', userId);
    expect(res.body.data).toMatchObject(updatedUserData);
  });

  // Test deleting a user
  it('Delete a user', async () => {
    const res = await request(app).delete(`/api/v1/users/${userId}`)
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });

  // Ensure that the user has been deleted by attempting to fetch it again
  it('Return 404 when fetching deleted user', async () => {
    const res = await request(app).get(`/api/v1/users/${userId}`)
    .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('User not found');
  });
});
