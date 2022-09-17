import axios, { AxiosResponse } from 'axios';

const baseURL = 'TODO';

describe('When getting greeting', () => {
  describe('with valid auth header', () => {
    let getResult: AxiosResponse;

    beforeAll(async () => {
      const axiosInstance = axios.create({
        baseURL,
        headers: {
          Authorization: 'Bearer 123456',
        },
        validateStatus: () => true,
      });
      getResult = await axiosInstance.get('/greeting');
    });

    it('should return 200', async () => {
      expect(getResult.status).toEqual(200);
    });
  });

  describe('with invalid auth header', () => {
    let getResult: AxiosResponse;

    beforeAll(async () => {
      const axiosInstance = axios.create({
        baseURL,
        headers: {
          Authorization: 'Bearer not-valid',
        },
        validateStatus: () => true,
      });
      getResult = await axiosInstance.get('/greeting');
    });

    it('should return 403', async () => {
      expect(getResult.status).toEqual(403);
    });
  });

  describe('with missing auth header', () => {
    let getResult: AxiosResponse;

    beforeAll(async () => {
      const axiosInstance = axios.create({
        baseURL,
        headers: {},
        validateStatus: () => true,
      });
      getResult = await axiosInstance.get('/greeting');
    });

    it('should return 401', async () => {
      expect(getResult.status).toEqual(401);
    });
  });
});
