import { useFetch } from "nuxt/app";
import { useRouter } from "nuxt/app";

export async function useCFetch(url: string, options: any = {}): Promise<{data: any | null, error: any | null}> {
  const router = useRouter();
  const token = useCookie("access_token");
  const refreshToken = useCookie("refresh_token");

  async function refreshAccessToken() {
    try {
      const { data, error } = await useFetch("http://backend:3001/auth/refresh-token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken.value}`,
        },
      });

      if (error.value || !(data.value as any)?.accessToken) {
        throw new Error(error.value as any);
      }

      return (data.value as any).accessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      await router.push("/signin");
    }
  }

  if (!options.headers) {
    options.headers = {};
  }
  if (token.value) {
    options.headers["Authorization"] = `Bearer ${token.value}`;
  }

  const { data, status, error, refresh } = await useFetch(url, {...options});

  if (error?.value) {
    console.log(error.value);

    if (error.value.statusCode === 401) {
      const newToken = await refreshAccessToken();

      if (newToken) {
        options.headers["Authorization"] = `Bearer ${newToken}`;
        useCookie('access_token').value = newToken;
        return useCFetch(url, options);
      }
    }

    if (error.value.statusCode === 422) {
      router.push('/completeprofile');
    }

  }

  return {data: data, error: error};
}

/**
 * 
 * async onResponse({ response, request, options }) {
      if (
        response?.status === "error" &&
        response.error_message === "jwt expired"
      ) {
        // If JWT is expired, try to refresh the token
        const newToken = await refreshAccessToken();

        if (newToken) {
          // Retry the original request with the new token
          options.headers["Authorization"] = `Bearer ${newToken}`;
          return useFetch(request, options);
        }
      }
    },
    onError(error) {
      console.error("Request failed", error);
    },
 */
