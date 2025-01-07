import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ACCESS_TOKEN, MAX_AGE, LINNER_TOKEN } from '@/utils/constants/cookie';

export async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    console.log("code", code)
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const cookieStore = cookies();
    const tokenCookie = cookieStore.get(ACCESS_TOKEN);
    const accessToken = tokenCookie?.value;
    console.log("sajdakjdsdjk: ", accessToken)

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
    console.log('workspaceName', workspaceName);


    console.log("urldddd", `${process.env.NEXT_PUBLIC_BACKEND_URL}/linear/${workspaceName}/getAccessToken/?code=${code}`);

    const accessTokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/linear/${workspaceName}/getAccessToken/?code=${code}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('accessTokenResponse', accessTokenResponse);

    if (!accessTokenResponse.ok) {
      return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
    }

    const accessTokenData = await accessTokenResponse.json();


    cookies().set(LINNER_TOKEN, accessTokenData.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    console.log('accessTokenData', accessTokenData);
    const data = {
      onboarding: {
        linner_connect: true,
      },
    };
    
    const updateUser = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me/`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json', // Ensure content-type is specified
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const dataUser=await updateUser.json();
    console.log('updateUser', dataUser);
    console.log('manaashjAccesstoken', accessToken);

    if (updateUser.status === 200) {
      console.log("hi");


      return NextResponse.redirect('http://localhost:3000/onboarding');

    }


  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}


