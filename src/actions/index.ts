
import { authOptions } from '@/auth';
import { getServerSession } from 'next-auth';

export const API_BASE_URL = process.env.REACT_APP_BASE_URL || 'http://e4ss8ggs4os04scgkggc8048.35.179.153.115.sslip.io/core/v1';

export { signIn } from './sign-in';
export { signOut } from './sign-out';
export { signUp } from './sign-up';
export { verifyAccount } from './verify-account';
export { listTalks } from './call-for-speakers/list-talks';
export { updateTalk } from './call-for-speakers/update-talk';
export { createTalk } from './call-for-speakers/create-talk';
    
export interface HttpApiResponse {
    error: string;
    status: number;
    data: unknown;
    special_status: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getSession() {
    const session: any = await getServerSession(authOptions);       
    const account_id = session?.user?.id;
    const token = session?.token;
    const user = session?.user;
    return { user, account_id, token };
}


