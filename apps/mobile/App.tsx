import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

const WEB_URL =
  (Constants.expoConfig?.extra as { webUrl?: string } | undefined)?.webUrl ?? 'https://who-tech.vercel.app';

const ALLOWED_HOSTS = ['who-tech.vercel.app', 'localhost', '127.0.0.1'];

function isInternalUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [errored, setErrored] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack]);

  const handleNavigationStateChange = useCallback((nav: WebViewNavigation) => {
    setCanGoBack(nav.canGoBack);
  }, []);

  const handleShouldStartLoad = useCallback((req: ShouldStartLoadRequest) => {
    if (isInternalUrl(req.url)) return true;
    if (/^https?:\/\//.test(req.url)) {
      Linking.openURL(req.url).catch(() => undefined);
      return false;
    }
    return true;
  }, []);

  const retry = useCallback(() => {
    setErrored(false);
    setReloadKey((k) => k + 1);
  }, []);

  const bgColor = isDark ? '#0a0a0a' : '#ffffff';
  const textColor = isDark ? '#f5f5f5' : '#0a0a0a';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]} edges={['top', 'bottom', 'left', 'right']}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        {errored ? (
          <View style={[styles.fallback, { backgroundColor: bgColor }]}>
            <Text style={[styles.fallbackTitle, { color: textColor }]}>연결할 수 없습니다</Text>
            <Text style={[styles.fallbackBody, { color: textColor }]}>
              네트워크 상태를 확인한 뒤 다시 시도해주세요.
            </Text>
            <Pressable onPress={retry} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>다시 시도</Text>
            </Pressable>
          </View>
        ) : (
          <WebView
            key={reloadKey}
            ref={webViewRef}
            source={{ uri: WEB_URL }}
            style={{ backgroundColor: bgColor }}
            onNavigationStateChange={handleNavigationStateChange}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            onError={() => setErrored(true)}
            onHttpError={({ nativeEvent }) => {
              if (nativeEvent.statusCode >= 500) setErrored(true);
            }}
            startInLoadingState
            renderLoading={() => (
              <View style={[styles.loading, { backgroundColor: bgColor }]}>
                <ActivityIndicator size="large" color={textColor} />
              </View>
            )}
            allowsBackForwardNavigationGestures
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['https://*', 'http://*']}
            decelerationRate="normal"
            pullToRefreshEnabled
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  fallbackBody: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
