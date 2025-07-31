import { config } from '../utils/config';
import * as realClient from './apiClient';
import * as mockClient from './mockClient';

const useMock = config.ENABLE_MOCK_API || !config.API_BASE_URL;

export const api = useMock ? mockClient : realClient;
