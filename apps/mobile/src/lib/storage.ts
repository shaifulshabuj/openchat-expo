import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export const storage = {
  async setTokens(accessToken: string, refreshToken: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
  },

  async getAccessToken() {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async getRefreshToken() {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async clearTokens() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  },

  async setUser(user: any) {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  },

  async getUser() {
    const userData = await SecureStore.getItemAsync(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
};
