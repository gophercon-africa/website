'use server';

import * as auth from '@/src/lib/auth';
import paths from '@/src/path';
import { redirect } from 'next/navigation';

export async function signOut() {
  auth.signOut();
  redirect(paths.home());
}
