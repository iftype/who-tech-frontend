import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import { WebSkeleton } from '../components/WebSkeleton';
import { getWebHostname } from '../config';
import { useAppTheme } from '../contexts/ThemeContext';
import type { RootStackParamList } from '../navigation/types';

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
  function post() {
    try {
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'theme', value: currentTheme() })
      );
    } catch (e) {}
  }
  post();
  var observer = new MutationObserver(post);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
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

type Props = NativeStackScreenProps<RootStackParamList, 'WebStack'>;

export function WebStackScreen({ route, navigation }: Props) {
  const { url, title } = route.params;
  const webViewRef = useRef<WebView>(null);
  const [loaded, setLoaded] = useState(false);
  const { isDark, setTheme, settingsVersion } = useAppTheme();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const lastReloadedVersionRef = useRef(settingsVersion);
  useEffect(() => {
    if (settingsVersion === lastReloadedVersionRef.current) return;
    lastReloadedVersionRef.current = settingsVersion;
    if (!loaded) return;
    webViewRef.current?.reload();
  }, [settingsVersion, loaded]);

  const bgColor = isDark ? '#0a0a0a' : '#ffffff';
  const textColor = isDark ? '#f5f5f5' : '#0a0a0a';
  const borderColor = isDark ? '#1f1f1f' : '#e5e7eb';

  const handleMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        if (data && data.type === 'theme' && (data.value === 'dark' || data.value === 'light')) {
          setTheme(data.value);
        }
      } catch {}
    },
    [setTheme],
  );

  const handleShouldStartLoad = useCallback(
    (req: ShouldStartLoadRequest) => {
      if (isInternalUrl(req.url)) return true;
      if (/^https?:\/\//.test(req.url)) {
        if (req.isTopFrame === false) {
          Linking.openURL(req.url).catch(() => undefined);
          return false;
        }
        rootNavigation.navigate('BlogWebView', { url: req.url });
        return false;
      }
      return true;
    },
    [rootNavigation],
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={10}
          accessibilityLabel="뒤로 가기"
        >
          <Ionicons name="chevron-back" size={26} color={textColor} />
        </Pressable>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title ?? ''}
        </Text>
        <View style={styles.backButton} />
      </View>
      <View style={{ flex: 1, backgroundColor: bgColor }}>
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={{ backgroundColor: bgColor }}
          onMessage={handleMessage}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          onLoadEnd={() => setLoaded(true)}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={['https://*', 'http://*']}
          decelerationRate="normal"
          injectedJavaScriptBeforeContentLoaded={DISABLE_ZOOM_SCRIPT + HIDE_HAMBURGER_SCRIPT}
          injectedJavaScript={DISABLE_ZOOM_SCRIPT + HIDE_HAMBURGER_SCRIPT + THEME_SYNC_SCRIPT}
          scalesPageToFit={false}
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
          minimumZoomScale={1}
          maximumZoomScale={1}
        />
        {!loaded && <WebSkeleton tabKey="feed" />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600' },
});
