import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useTodosStore } from "../store/todosStore";
import { setTokenGetter } from "../services/api/axiosInstance";

export function useAuthState() {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout, getAccessTokenSilently } =
    useAuth0();
  const setUser = useTodosStore((s) => s.setUser);
  const setAccessToken = useTodosStore((s) => s.setAccessToken);
  const setAuthLoading = useTodosStore((s) => s.setAuthLoading);
  const clearAuth = useTodosStore((s) => s.clearAuth);
  const storeUser = useTodosStore((s) => s.user);
  const accessToken = useTodosStore((s) => s.accessToken);

  // Set token getter once on mount; it will call getAccessTokenSilently on each request
  useEffect(() => {
    setTokenGetter(async () => {
      try {
        const token = await getAccessTokenSilently();
        return token || null;
      } catch (error) {
        console.error("Failed to get access token:", error);
        return null;
      }
    });
  }, [getAccessTokenSilently]);

  useEffect(() => {
    setAuthLoading(isLoading);
  }, [isLoading, setAuthLoading]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      setUser({
        id: user.sub ?? "",
        email: user.email ?? "",
        name: user.name ?? user.email ?? "User",
        picture: user.picture,
      });
      getAccessTokenSilently()
        .then((token) => setAccessToken(token))
        .catch((err) => {
          console.error("Failed to get initial token:", err);
          setAccessToken(null);
        });
    } else if (!isLoading && !isAuthenticated) {
      clearAuth();
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    setUser,
    setAccessToken,
    clearAuth,
    getAccessTokenSilently,
  ]);

  return {
    user: storeUser,
    accessToken,
    isLoading,
    isAuthenticated,
    login: loginWithRedirect,
    logout: async () => {
      clearAuth();
      await logout({ logoutParams: { returnTo: window.location.origin } });
    },
  };
}
