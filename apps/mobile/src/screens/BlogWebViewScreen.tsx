import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useRef } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogWebView'>;

export function BlogWebViewScreen({ route, navigation }: Props) {
  const { url } = route.params;
  const webViewRef = useRef<WebView>(null);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const bgColor = isDark ? '#0a0a0a' : '#ffffff';
  const textColor = isDark ? '#f5f5f5' : '#0a0a0a';
  const borderColor = isDark ? '#1f1f1f' : '#e5e7eb';

  const handleShouldStartLoad = useCallback((req: ShouldStartLoadRequest) => {
    if (req.isTopFrame === false) return true;

    if (/^https?:\/\//i.test(req.url)) return true;

    Linking.openURL(req.url).catch(() => {});
    return false;
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgColor }]} edges={['top', 'left', 'right']}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
          hitSlop={10}
          accessibilityLabel="닫기"
        >
          <Ionicons name="close" size={26} color={textColor} />
        </Pressable>
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={{ backgroundColor: bgColor }}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        startInLoadingState
        renderLoading={() => (
          <View style={[styles.loading, { backgroundColor: bgColor }]}>
            <ActivityIndicator size="large" color={textColor} />
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={['https://*', 'http://*']}
        decelerationRate="normal"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
