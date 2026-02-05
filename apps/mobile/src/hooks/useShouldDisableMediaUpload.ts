import { Platform } from 'react-native';

/**
 * Determines if media/file upload should be disabled.
 * 
 * Disables upload for:
 * - iOS native app (Expo/React Native on iOS)
 * - iOS web (Safari on iPhone/iPad) 
 * - macOS PWA (standalone mode on macOS)
 * 
 * Does NOT disable for:
 * - Regular browser on any platform
 * - Android (native or web)
 * - Desktop browsers (unless PWA on macOS)
 */
export function useShouldDisableMediaUpload(): boolean {
  // iOS native app - always disable
  if (Platform.OS === 'ios') {
    return true;
  }

  // For web platform, check for iOS web or macOS PWA
  if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check if running on iOS Safari (iPhone, iPad, iPod)
    const isIOSWeb = /iphone|ipad|ipod/.test(userAgent);
    
    // Check if running as PWA (standalone mode)
    const isPWA = window.matchMedia?.('(display-mode: standalone)').matches ||
                  (window.navigator as any).standalone === true;
    
    // Check if running on macOS
    const isMacOS = /macintosh|mac os x/.test(userAgent) && !isIOSWeb;
    
    // Disable for iOS web (regardless of PWA mode)
    if (isIOSWeb) {
      return true;
    }
    
    // Disable for macOS PWA only (browser is fine)
    if (isMacOS && isPWA) {
      return true;
    }
  }

  return false;
}
