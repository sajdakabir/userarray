import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ACCESS_TOKEN, MAX_AGE, LINEAR_TOKEN } from '@/config/constant/cookie';
import { error } from 'console';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const cookieStore = await cookies();  // Await the cookies promise
    const tokenCookie = cookieStore.get(ACCESS_TOKEN);
    const accessToken = tokenCookie?.value;

    if (!accessToken) {
      return NextResponse.redirect('/');
    }

    const workspacesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/workspaces/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!workspacesResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch workspaces' }, { status: 500 });
    }

    const workspacesData = await workspacesResponse.json();
    const workspaceName = workspacesData.response[0]?.slug;

    if (!workspaceName) {
      return NextResponse.json({ error: 'No workspace found' }, { status: 404 });
    }

    const accessTokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/linear/${workspaceName}/getAccessToken/?code=${code}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!accessTokenResponse.ok) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
    }

    const accessTokenData = await accessTokenResponse.json();

    // Set the LINEAR_TOKEN in cookies after awaiting cookieStore
    cookieStore.set(LINEAR_TOKEN, accessTokenData.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    const data = {
      onboarding: {
        linear_connect: true, // Send the value as false as in Postman
      },
    };

    const updateUser = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me/`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (updateUser.status === 200) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/onboarding`);
    }

    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: error || 'Internal Server Error' }, { status: 500 });
  }
}
