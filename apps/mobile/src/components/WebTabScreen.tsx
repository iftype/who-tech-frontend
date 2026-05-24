import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewNavigation, type WebViewMessageEvent } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import { buildUrl, getWebHostname, isPathAllowedForTab, type TabKey } from '../config';
import { useAppTheme } from '../contexts/ThemeContext';
import type { RootStackParamList } from '../navigation/types';
import { WebSkeleton } from './WebSkeleton';

const ALLOWED_HOSTS = [getWebHostname(), 'localhost', '127.0.0.1'];

const HIDE_HAMBURGER_SCRIPT = `
(function() {
  var css = 'button[aria-label="메뉴"]{display:none !important;}'
    + 'header[data-nav] a[href="/"]{pointer-events:none !important;cursor:default !important;}';
  function inject() {
    if (!document.head) return;
    if (document.getElementById('__rn_hide_hamburger__')) return;
    var style = document.createElement('style');
    style.id = '__rn_hide_hamburger__';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
  true;
})();
`;

const THEME_SYNC_SCRIPT = `
(function() {
  function currentTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  }
  function currentDesign() {
    var cl = document.documentElement.classList;
    if (cl.contains('apple')) return 'apple';
    if (cl.contains('sentry')) return 'sentry';
    return 'paper';
  }
  function post() {
    try {
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'theme', value: currentTheme(), design: currentDesign() })
      );
    } catch (e) {}
  }
  post();
  var observer = new MutationObserver(post);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
})();
`;

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
  tabKey: TabKey;
  isFocused: boolean;
};

export function WebTabScreen({ path, tabKey, isFocused }: Props) {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [errored, setErrored] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const { isDark, setTheme, setDesign, settingsVersion, notifySettingsChanged } = useAppTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isSettingsTab = tabKey === 'settings';

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (!data || typeof data !== 'object') return;
        if (data.type === 'theme' && (data.value === 'dark' || data.value === 'light')) {
          setTheme(data.value);
          if (data.design === 'paper' || data.design === 'apple' || data.design === 'sentry') {
            setDesign(data.design);
          }
          return;
        }
        if (data.type === 'design' && (data.value === 'paper' || data.value === 'apple' || data.value === 'sentry')) {
          setDesign(data.value);
          return;
        }
        if (isSettingsTab && data.type === 'settings-changed') {
          notifySettingsChanged();
        }
      } catch {}
    },
    [setTheme, setDesign, isSettingsTab, notifySettingsChanged],
  );

  const lastReloadedVersionRef = useRef(settingsVersion);
  useEffect(() => {
    if (isSettingsTab) {
      lastReloadedVersionRef.current = settingsVersion;
      return;
    }
    if (settingsVersion === lastReloadedVersionRef.current) return;
    lastReloadedVersionRef.current = settingsVersion;
    if (!loaded) return;
    webViewRef.current?.reload();
  }, [settingsVersion, isSettingsTab, loaded]);

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

  const handleShouldStartLoad = useCallback(
    (req: ShouldStartLoadRequest) => {
      if (isInternalUrl(req.url)) {
        try {
          const { pathname } = new URL(req.url);
          if (!isPathAllowedForTab(tabKey, pathname)) {
            if (req.isTopFrame !== false) {
              navigation.navigate('WebStack', { url: req.url });
            }
            return false;
          }
        } catch {
          return false;
        }
        return true;
      }
      if (/^https?:\/\//.test(req.url)) {
        if (req.isTopFrame === false) {
          Linking.openURL(req.url).catch(() => undefined);
          return false;
        }
        navigation.navigate('BlogWebView', { url: req.url });
        return false;
      }
      return true;
    },
    [navigation, tabKey],
  );

  const retry = useCallback(() => {
    setErrored(false);
    setLoaded(false);
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
        <View style={{ flex: 1, backgroundColor: bgColor }}>
          <WebView
            key={reloadKey}
            ref={webViewRef}
            source={{ uri }}
            style={{ backgroundColor: bgColor }}
            onNavigationStateChange={handleNavigationStateChange}
            onMessage={handleMessage}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            onLoadEnd={() => setLoaded(true)}
            onError={() => setErrored(true)}
            onHttpError={({ nativeEvent }) => {
              if (nativeEvent.statusCode >= 500) setErrored(true);
            }}
            allowsBackForwardNavigationGestures
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['https://*', 'http://*']}
            decelerationRate="normal"
            pullToRefreshEnabled
            injectedJavaScriptBeforeContentLoaded={DISABLE_ZOOM_SCRIPT + HIDE_HAMBURGER_SCRIPT}
            injectedJavaScript={DISABLE_ZOOM_SCRIPT + HIDE_HAMBURGER_SCRIPT + THEME_SYNC_SCRIPT}
            scalesPageToFit={false}
            setBuiltInZoomControls={false}
            setDisplayZoomControls={false}
            minimumZoomScale={1}
            maximumZoomScale={1}
          />
          {!loaded && <WebSkeleton tabKey={tabKey} />}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  fallbackTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  fallbackBody: { fontSize: 14, textAlign: 'center', marginBottom: 24, opacity: 0.7 },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: '#2563eb' },
  retryButtonText: { color: '#ffffff', fontWeight: '600', fontSize: 15 },
});
