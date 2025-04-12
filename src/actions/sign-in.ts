'use server';

import * as auth from '@/src/lib/auth';
import paths from '@/src/path';
import { z } from 'zod';
import { redirect } from 'next/navigation';

interface SignInFormState {
  error: {
      email: string[];
      password: string[];
      _form?: string[];
  };
}

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export async function signIn(formState: SignInFormState, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const validationResult = signInSchema.safeParse({
    email: formData.get("email"), 
    password: formData.get("password"),
  });

  if (!validationResult.success) {   
    return { error: validationResult.error.flatten().fieldErrors as SignInFormState["error"] };
  }

    
  try {
    auth.signIn({
      email: email as string,
      password: password as string,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
        return { error: { email: [], password: [], _form: [error.message] } };
    } else {
        return { error: { email: [], password: [], _form: ["An unknown error occurred"] } };
    }
  }

  redirect(paths.reservations()); 
}

