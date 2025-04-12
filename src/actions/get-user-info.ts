'use server';

import { getSession, HttpApiResponse } from './index';
import { API_BASE_URL } from './index';

/**
 *   get user info
 */
export async function getUserInfo(): Promise<HttpApiResponse> {
  const { account_id, token } = await getSession();
  const response = await fetch(`${API_BASE_URL}/admin/accounts/${account_id}`, {
    method: 'GET',   
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const result: HttpApiResponse = await response.json();
  return result;
}

