'use server';

import * as auth from '@/src/lib/auth';
import paths from '@/src/path';
import { redirect } from 'next/navigation';
import { HttpApiResponse } from './index';

export interface SignUpFormState {
  error: {
      first_name: string[];
      last_name: string[];
      email: string[];
      password: string[];
      confirmPassword: string[];
      phone_number: string[];
    
      _form?: string[];
  };
}

export async function signUp(formState: SignUpFormState, formData: FormData ) : Promise<SignUpFormState>{
    const first_name = formData.get('first_name') as string;
    const last_name = formData.get('last_name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const phone_number = formData.get('phone_number') as string;

    if (password !== confirmPassword) {
        return { error: { _form: ["Passwords do not match"] } as SignUpFormState["error"] };
    }

  try {
    const result: HttpApiResponse = await auth.signUp({
      first_name: first_name,
      last_name: last_name,
      email: email, 
      password: password,
      phone_number: phone_number,
    }); 
    
    if (result.status >= 400 && result.status <= 500) {
      return { error: { _form: [result.error] } as SignUpFormState["error"] };
    } 
    
  } catch (error: unknown) {
    if (error instanceof Error) {
        return { error: { _form: [error.message] } as SignUpFormState["error"] };
    } else {
        return { error: { _form: ["An unknown error occurred"] } as SignUpFormState["error"] };
    }
  }

  redirect(paths.signin()); 
}

