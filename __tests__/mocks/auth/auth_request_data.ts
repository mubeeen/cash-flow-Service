export const validRegisterInput = {
  name: 'Test User',
  email: 'test@test.com',
  password: '12345678',
};

export const invalidRegisterInput = {
  email: 'test@test.com',
  // missing name and password
};

export const validLoginInput = {
  email: 'test@test.com',
  password: '12345678',
};

export const wrongEmailLoginInput = {
  email: 'wrong@test.com',
  password: '12345678',
};

export const wrongPasswordLoginInput = {
  email: 'test@test.com',
  password: 'wrongpass',
};
