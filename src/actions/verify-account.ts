import { HttpApiResponse } from "./index";
        
export async function verifyAccount(email: string, otp: string): Promise<HttpApiResponse> {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/accounts/${email}/verify/${otp}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    return {
      error: result.error || '',
      status: response.status,
      data: result.data || null,
      special_status: result.special_status || 0
    };
 
}