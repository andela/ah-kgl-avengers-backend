import request from 'request';

export default {
  getTestUser: () => {
    const newUser = {
      email: 'avengerstest@testa.com',
      password: 'avengersfirst',
      username: 'ironman',
    };

    // first signup the user
    request.post('/api/v1/auth/signup', { body: newUser }).on('response', (response) => {
      request.get(`/api/v1/activation/${response.user.id}`);
    });
  }
};
