import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';

/**
 * Biometric Authentication Service
 * Handles Face ID, Touch ID, and other biometric authentication
 */
export class BiometricService {
  /**
   * Check if device has biometric hardware (Face ID, Touch ID, etc.)
   */
  static async hasHardware(): Promise<boolean> {
    try {
      return await LocalAuthentication.hasHardwareAsync();
    } catch (error) {
      console.error('Error checking biometric hardware:', error);
      return false;
    }
  }

  /**
   * Check if biometrics are enrolled (user has set up Face ID/Touch ID)
   */
  static async isEnrolled(): Promise<boolean> {
    try {
      return await LocalAuthentication.isEnrolledAsync();
    } catch (error) {
      console.error('Error checking biometric enrollment:', error);
      return false;
    }
  }

  /**
   * Get available biometric types (Face ID, Touch ID, etc.)
   */
  static async getSupportedTypes(): Promise<string[]> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      return types.map((type) => {
        switch (type) {
          case LocalAuthentication.AuthenticationType.FINGERPRINT:
            return 'Touch ID / Fingerprint';
          case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION:
            return 'Face ID / Face Recognition';
          case LocalAuthentication.AuthenticationType.IRIS:
            return 'Iris Recognition';
          default:
            return 'Biometric';
        }
      });
    } catch (error) {
      console.error('Error getting supported types:', error);
      return [];
    }
  }

  /**
   * Authenticate using biometrics
   * @param promptMessage Message to display in the biometric prompt
   */
  static async authenticate(
    promptMessage: string = 'Authenticate to continue'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const hasHardware = await this.hasHardware();
      if (!hasHardware) {
        return {
          success: false,
          error: 'Biometric hardware not available on this device',
        };
      }

      const isEnrolled = await this.isEnrolled();
      if (!isEnrolled) {
        return {
          success: false,
          error: 'No biometrics enrolled. Please set up Face ID or Touch ID in Settings.',
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false, // Allow fallback to device passcode
      });

      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: result.error || 'Authentication failed',
        };
      }
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: error.message || 'Authentication error',
      };
    }
  }

  /**
   * Check if biometric login is enabled by user
   */
  static async isBiometricLoginEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric login preference:', error);
      return false;
    }
  }

  /**
   * Enable or disable biometric login
   */
  static async setBiometricLoginEnabled(enabled: boolean): Promise<void> {
    try {
      await SecureStore.setItemAsync(
        BIOMETRIC_ENABLED_KEY,
        enabled ? 'true' : 'false'
      );
    } catch (error) {
      console.error('Error setting biometric login preference:', error);
      throw error;
    }
  }

  /**
   * Get a user-friendly message about biometric availability
   */
  static async getBiometricStatus(): Promise<{
    available: boolean;
    message: string;
  }> {
    const hasHardware = await this.hasHardware();
    if (!hasHardware) {
      return {
        available: false,
        message: 'Biometric authentication is not available on this device',
      };
    }

    const isEnrolled = await this.isEnrolled();
    if (!isEnrolled) {
      return {
        available: false,
        message: 'No biometrics enrolled. Please set up Face ID or Touch ID in Settings.',
      };
    }

    const types = await this.getSupportedTypes();
    return {
      available: true,
      message: `${types.join(' or ')} available`,
    };
  }
}
