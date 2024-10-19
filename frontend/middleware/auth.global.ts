export default defineNuxtRouteMiddleware(async (to, from) => {
    console.log("middleware");
    
    const accessToken = useCookie<string>('access_token');
    const refreshToken = useCookie<string>('refresh_token');

    if (accessToken.value) {
      console.log("accessToken",accessToken);
      
      // If access token exists, verify it
      const isAccessTokenValid = await verifyToken(accessToken.value);
  
      if (!isAccessTokenValid) {
        // If the access token is invalid and there's a refresh token, verify the refresh token
        if (refreshToken.value) {
          const isRefreshTokenValid = await verifyToken(refreshToken.value);
  
          if (!isRefreshTokenValid) {
            if (to.path !== '/signin')
            return navigateTo('/signin');
          } else {
            // Handle refreshing access token here
            await refreshAccessToken(refreshToken.value);
          }
        } else {
          if (to.path !== '/signin')
          return navigateTo('/signin');
        }
      }
    } else if (refreshToken.value) {
      console.log("refreshToken",refreshToken.value);
      // // If there's no access token but a refresh token exists, verify it
      // const isRefreshTokenValid = await verifyToken(refreshToken.value);
  
      // if (!isRefreshTokenValid) {
      //   return navigateTo('/signin');
      // } else {
      //   // Handle refreshing access token here
      //   await refreshAccessToken(refreshToken.value);
      // }
    } else {
      // If neither access token nor refresh token exists, redirect to signin
      if (to.path !== '/signin')
      return navigateTo('/signin');
    }
  });
  
  async function verifyToken(token:string) {
    return true;
    try {
      // Here you can add your logic to verify the token (e.g., checking its expiration, signature, etc.)
      // For example, if using JWT on the client-side:
      const decodedToken:{valid: boolean} = await $fetch('http://localhost:3001/auth/verify-token', { method: 'POST', body: { token } });
      return decodedToken?.valid || false;
    } catch (err) {
      return false;
    }
  }
  
  async function refreshAccessToken(refreshToken:string) {
    try {
      // Call API to refresh access token
      const newToken:{accessToken: string} = await $fetch('http://localhost:3001/auth/refresh-token', { method: 'POST', body: { refreshToken } });
      // Set new access token
      useCookie('access_token').value = newToken.accessToken;
    } catch (err) {
      return navigateTo('/signin');
    }
  }
  