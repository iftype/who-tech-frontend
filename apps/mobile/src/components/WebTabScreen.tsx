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
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import { buildUrl, getWebHostname } from '../config';

const ALLOWED_HOSTS = [getWebHostname(), 'localhost', '127.0.0.1'];

const DISABLE_ZOOM_SCRIPT = `
(function() {
  function applyViewport() {
    var content = 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover';
    var meta = document.querySelector('meta[name=viewport]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head && document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyViewport);
  } else {
    applyViewport();
  }
  document.addEventListener('gesturestart', function(e) { e.preventDefault(); }, { passive: false });
  document.addEventListener('gesturechange', function(e) { e.preventDefault(); }, { passive: false });
  document.addEventListener('gestureend', function(e) { e.preventDefault(); }, { passive: false });
  document.addEventListener('dblclick', function(e) { e.preventDefault(); }, { passive: false });
  var lastTouchEnd = 0;
  document.addEventListener('touchend', function(e) {
    var now = Date.now();
    if (now - lastTouchEnd <= 350) e.preventDefault();
    lastTouchEnd = now;
  }, { passive: false });
  document.addEventListener('touchmove', function(e) {
    if (e.touches && e.touches.length > 1) e.preventDefault();
  }, { passive: false });
  true;
})();
`;

function isInternalUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_HOSTS.includes(hostname);
  } catch {
    return false;
  }
}

type Props = {
  path: string;
  isFocused: boolean;
};

export function WebTabScreen({ path, isFocused }: Props) {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [errored, setErrored] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  useEffect(() => {
    if (Platform.OS !== 'android' || !isFocused) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack, isFocused]);

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
  const uri = buildUrl(path);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]} edges={['top', 'left', 'right']}>
      {errored ? (
        <View style={[styles.fallback, { backgroundColor: bgColor }]}>
          <Text style={[styles.fallbackTitle, { color: textColor }]}>연결할 수 없습니다</Text>
          <Text style={[styles.fallbackBody, { color: textColor }]}>네트워크 상태를 확인한 뒤 다시 시도해주세요.</Text>
          <Pressable onPress={retry} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>다시 시도</Text>
          </Pressable>
        </View>
      ) : (
        <WebView
          key={reloadKey}
          ref={webViewRef}
          source={{ uri }}
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
          injectedJavaScriptBeforeContentLoaded={DISABLE_ZOOM_SCRIPT}
          injectedJavaScript={DISABLE_ZOOM_SCRIPT}
          scalesPageToFit={false}
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
          minimumZoomScale={1}
          maximumZoomScale={1}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  fallbackTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  fallbackBody: { fontSize: 14, textAlign: 'center', marginBottom: 24, opacity: 0.7 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: '#2563eb' },
  retryButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 15 },
});
