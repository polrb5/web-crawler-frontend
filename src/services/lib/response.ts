import { ApiResponse } from '../../types';

const response = <T>(success: boolean, message?: string | null, data?: T | null): ApiResponse<T> => ({
  success,
  message: !success && !message ? 'UnexpectedError' : message,
  data,
});

export default response;
