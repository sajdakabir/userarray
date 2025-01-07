// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';
// import { ACCESS_TOKEN } from '@/utils/constants/cookie';

// console.log("hush... sajda")

// export async function GET(request:any) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const code = searchParams.get('code');
   
//     console.log("code",code)
//     if (!code) {
//       return NextResponse.json({ error: 'Code is required' }, { status: 400 });
//     }

//     const cookieStore = cookies();
//     const tokenCookie = cookieStore.get(ACCESS_TOKEN);
//     const accessToken = tokenCookie?.value;
//     console.log("sajdakjdsdjk: ",accessToken)

//     if (!accessToken) {
//       return NextResponse.redirect('/');
//     }
// console.log("sajda: ",accessToken)
// const workspaceName = "naru"
//     console.log("urldddd",`${process.env.NEXT_PUBLIC_BACKEND_URL}/linear/${workspaceName}/getAccessToken/?code=${code}`);
    
//     const accessTokenResponse = await fetch(
//       `${process.env.NEXT_PUBLIC_BACKEND_URL}/linear/${workspaceName}/getAccessToken/?code=${code}`,
//       {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );
//     console.log('accessTokenResponse',code);
    
//     if (!accessTokenResponse.ok) {
//       return NextResponse.json({ error: 'Failed to get access token' }, { status: 500 });
//     }

//     const accessTokenData = await accessTokenResponse.json();
//     console.log('accessTokenData',accessTokenData);
    
//     return NextResponse.json({ token: accessTokenData.token });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: err }, { status: 500 });
//   }
// }

export default function LinearAuth() {
  return <div>LinearAuth</div>;
}
