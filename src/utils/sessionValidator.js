import { NextResponse } from 'next/server';

export async function validateSession(request) {
  const token = request.headers.get('sessiontoken');

  if (!token) {
    return {
      success: false,
      message: 'No session token provided',
    };
  }

  try {
    const verifyResponse = await fetch(`${request.nextUrl.origin}/api/verify_session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const responseData = await verifyResponse.json();

    if (verifyResponse.ok) {
      return {
        success: true,
        sessionToken: responseData.sessionToken,
      };
    } else {
      return {
        success: false,
        message: 'Session token is invalid',
      };
    }
  } catch (error) {
    console.error('Middleware: Database connection error', error);
    return {
      success: false,
      message: 'Database connection error',
    };
  }
} 