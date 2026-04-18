import type { AuthProvider } from "@refinedev/core";
import axios from "axios";
import {
  API_URL,
  TOKEN_KEY,
  USER_KEY,
  PERMISSIONS_KEY,
  IS_SUPER_ADMIN_KEY,
} from "./constants";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { data, meta } = response.data;

      // Store the access token
      localStorage.setItem(TOKEN_KEY, meta.token.access_token);

      // Store user identity
      const userIdentity = {
        id: data.id,
        name: data.attributes.name,
        email: data.attributes.email,
        avatar_url: data.attributes.avatar_url,
        role: data.attributes.role,
        is_active: data.attributes.is_active,
      };
      localStorage.setItem(USER_KEY, JSON.stringify(userIdentity));

      // Store permissions
      localStorage.setItem(
        PERMISSIONS_KEY,
        JSON.stringify(data.attributes.permissions || []),
      );

      // Store super admin flag
      localStorage.setItem(
        IS_SUPER_ADMIN_KEY,
        String(data.meta?.is_super_admin || false),
      );

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError?.response?.data?.message || "Invalid email or password";
      return {
        success: false,
        error: {
          name: "LoginError",
          message,
        },
      };
    }
  },

  logout: async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      try {
        await axios.post(
          `${API_URL}/auth/revoke`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } catch (error) {
        console.error("Logout API error:", error);
      }
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PERMISSIONS_KEY);
    localStorage.removeItem(IS_SUPER_ADMIN_KEY);

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },

  getPermissions: async () => {
    const permissionsStr = localStorage.getItem(PERMISSIONS_KEY);
    if (permissionsStr) {
      return JSON.parse(permissionsStr);
    }
    return [];
  },

  getIdentity: async () => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  onError: async (error) => {
    const status = (error as { response?: { status?: number } })?.response
      ?.status;

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(PERMISSIONS_KEY);
      localStorage.removeItem(IS_SUPER_ADMIN_KEY);

      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }

    console.error(error);
    return { error };
  },
};
