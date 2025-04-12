import { cookies } from 'next/headers';
import { HttpApiResponse } from '../actions';
import { API_BASE_URL } from '../actions';

export interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  account?: Account;
  token?: string;
}

  
  export interface Account {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    avatar: string;
    account_status: string;
    email_verified: boolean;
    created_at: string;
    updated_at: string;
  }

/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Sign up a new user
 */
export async function signUp(data: SignupData): Promise<HttpApiResponse> {
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/accounts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    const result: HttpApiResponse = await response.json();    
    if (response.status !== 200) {
      return {
        error: result.error || 'Invalid email or password',
        status: response.status,
        data: null,
        special_status: 0,
      };
    } 
    
    return result;
  } catch (error: unknown) {
    return {
      error: 'An unexpected error occurred while signing up',
      status: 500,
      data: null,
      special_status: 0,
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SigninData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/accounts/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    const result = await response.json();

    if (response.status !== 200) {
      return {
        success: false,
        message: result.error || 'Invalid email or password',
      };
    }

    // Store the token in an HTTP-only cookie
    if (result.token) {
        (await cookies()).set('auth-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
      });
    }

    return {
      success: true,
      message: 'Signed in successfully',
      token: result.token,
      account: result.account,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: 'An unexpected error occurred while signing in',
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ success: boolean }> {
  try {
    (await cookies()).delete('auth-token');
    return { success: true };
  } catch (error: unknown) {
    return { success: false };
  }
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get('auth-token')?.value;
  return !!token;
}

/**
 * Get the current user's information
 */
export async function getCurrentUser() {
  try {
    const token = (await cookies()).get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/admin/accounts/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error: unknown) {
    return null;
  }
}

/**
 * Request a password reset
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/accounts/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Failed to send reset link',
      };
    }

    return {
      success: true,
      message: 'Password reset link sent successfully',
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: 'An unexpected error occurred while requesting password reset',
    };
  }
}

/* eslint-eable @typescript-eslint/no-unused-vars */