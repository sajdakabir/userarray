import { ACCESS_TOKEN } from '@/utils/constants/cookie';
import { cookies } from 'next/headers';

export async function page({ searchParams }: { searchParams: { code?: string } }) {
  try {
    const { code } = searchParams;  // Access code from searchParams
    if (!code) {
      return {
        notFound: true, // Automatically shows 404 if code is missing
      };
    }

    const cookieStore = cookies();
    const token = cookieStore.get(ACCESS_TOKEN);
    const accessToken = token?.value;

    if (!accessToken) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
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
      return {
        props: { error: 'Failed to fetch workspaces' },
      };
    }

    const workspacesData = await workspacesResponse.json();
    const workspaceName = workspacesData.response[0]?.name;

    if (!workspaceName) {
      return {
        props: { error: 'No workspace found' },
      };
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
    console.log('accessTokenResponse', accessTokenResponse);
    
    if (!accessTokenResponse.ok) {
      return {
        props: { error: 'Failed to get access token' },
      };
    }

    const accessTokenData = await accessTokenResponse.json();
    return {
      props: { token: accessTokenData.token },
    };
  } catch (err) {
    console.error(err);
    return {
      props: { error: 'An error occurred while fetching data.' },
    };
  }
}

export default page;
