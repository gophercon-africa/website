
import { getSession, HttpApiResponse } from '..';
import { API_BASE_URL } from '../index';

/**
 *   list all tables by account id
 */
export async function listTalks(): Promise<HttpApiResponse> {

  const { account_id, token } = await getSession();
  const response = await fetch(`${API_BASE_URL}/admin/talks`, {
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