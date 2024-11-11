import axios from 'axios';

const baseURL = process.env.API_URL;

describe('When getting greeting', () => {
  describe('with valid auth header', () => {
    it('should return 200', async () => {
      // ARRANGE
      const numberParsableToken = '123456';
      const options = {
        baseURL,
        headers: {
          Authorization: `Bearer ${numberParsableToken}`,
        },
        validateStatus: () => true,
      };

      // ACT
      const getResult = await axios.get('/greeting', options);

      // ASSERT
      expect(getResult.status).toEqual(200);
    });
  });

  describe('with invalid auth header', () => {
    it('should return 403', async () => {
      // ARRANGE
      const nonNumberParsableToken = 'abcdef';
      const options = {
        baseURL,
        headers: {
          Authorization: `Bearer ${nonNumberParsableToken}`,
        },
        validateStatus: () => true,
      };

      // ACT
      const getResult = await axios.get('/greeting', options);

      // ASSERT
      expect(getResult.status).toEqual(403);
    });
  });

  describe('with missing auth header', () => {
    it('should return 401', async () => {
      // ARRANGE
      const options = {
        baseURL,
        headers: {},
        validateStatus: () => true,
      };

      // ACT
      const getResult = await axios.get('/greeting', options);

      // ASSERT
      expect(getResult.status).toEqual(401);
    });
  });
});
