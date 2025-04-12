import { getSession, HttpApiResponse } from "..";
import { API_BASE_URL } from '../index';

export async function getTalk(talkId: string): Promise<HttpApiResponse> {
  const { account_id, token } = await getSession();
  const response = await fetch(`${API_BASE_URL}/admin/talks/${talkId}`, {
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