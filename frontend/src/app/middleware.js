// middleware.js
import { verify } from '@/lib/authentication/authAction';
import store from '@/lib/redux/store';
import { COOKIE_NAME } from '@/lib/utils/constants';
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  // Redirect to login if not authenticated
  if (!token && !isAuthPage) {
    store.dispatch(verify);
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect to dashboard if already logged in and accessing login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
