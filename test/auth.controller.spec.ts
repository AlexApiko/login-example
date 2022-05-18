import request from 'supertest';
import { userService } from '../src/services/users';
import { authService } from '../src/services/auth';
import { LoginStatus } from '../src/dto/login-status.enum';
import { User } from '../src/models/user';
import { app } from '../src/app';
import { user1 } from './fixtures';

describe('Auth.Controller.login', () => {
  test('Should login user with a correct creds', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValueOnce(user1);
    jest.spyOn(authService, 'comparePasswords').mockResolvedValueOnce(true);

    const response = await request(app)
      .post('/api/login')
      .send({ email: user1.email, password: '12345' })
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.headers['auth-token']).toEqual(expect.any(String));
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      status: LoginStatus.loggedIn,
    });
  });

  test('Should response with error if wrong email is provided', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValueOnce(null);

    const response = await request(app)
      .post('/api/login')
      .send({ email: 'wrong@email.com', password: '12345' })
      .set('Accept', 'application/json');

    expect(response.headers['auth-token']).toBeUndefined();
    expect(response.status).toEqual(403);
    expect(response.body).toMatchObject({
      status: LoginStatus.accessDenied,
    });
  });

  test('Should response with error if wrong password is provided', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValueOnce(user1);
    jest.spyOn(authService, 'comparePasswords').mockResolvedValueOnce(false);

    const response = await request(app)
      .post('/api/login')
      .send({ email: 'wrong@email.com', password: '12345' })
      .set('Accept', 'application/json');

    expect(response.headers['auth-token']).toBeUndefined();
    expect(response.status).toEqual(403);
    expect(response.body).toMatchObject({
      status: LoginStatus.accessDenied,
    });
  });

  test('Should response with error if email is missed', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: '', password: '12345' })
      .set('Accept', 'application/json');

    expect(response.headers['auth-token']).toBeUndefined();
    expect(response.status).toEqual(422);
    expect(response.body).toMatchObject({
      status: LoginStatus.missingEmail,
    });
  });

  test('Should response with error if password is missed', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@test.com' })
      .set('Accept', 'application/json');

    expect(response.headers['auth-token']).toBeUndefined();
    expect(response.status).toEqual(422);
    expect(response.body).toMatchObject({
      status: LoginStatus.missingPassword,
    });
  });
});

describe('Auth.Controller.loginV2', () => {
  test('Should loginV2 user with a correct creds', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValueOnce(user1);
    jest.spyOn(authService, 'comparePasswords').mockResolvedValueOnce(true);

    const response = await request(app)
      .post('/api/login-v2')
      .send({ email: user1.email, password: '12345' })
      .set('Accept', 'application/json');

    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      user: {
        ...User.getPublicProfile(user1),
        createdAt: user1.createdAt.toISOString(),
      },
    });
  });

  test('loginV2 should response with error if wrong email is provided', async () => {
    jest.spyOn(userService, 'findUserByEmail').mockResolvedValueOnce(null);

    const response = await request(app)
      .post('/api/login-v2')
      .send({ email: 'wrong@email.com', password: '12345' })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(403);
    expect(response.body).toMatchObject({
      message: 'Invalid email or password',
    });
    expect(response.body.accessToken).toBeUndefined();
  });

  test('loginV2 should response with error on validation failed', async () => {
    const response = await request(app)
      .post('/api/login-v2')
      .send({ email: 'notEmail' })
      .set('Accept', 'application/json');

    expect(response.headers['auth-token']).toBeUndefined();
    expect(response.status).toEqual(422);
    expect(response.body).toMatchObject({
      message: 'Invalid input',
      validationErrors: [
        {
          property: 'email',
          value: 'notEmail',
          constraints: { isEmail: expect.any(String) },
        },
        {
          property: 'password',
          constraints: { isString: 'password must be a string' },
        },
      ],
    });
    expect(response.body.accessToken).toBeUndefined();
  });
});
