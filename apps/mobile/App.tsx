import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useAppTheme } from './src/contexts/ThemeContext';
import { BlogWebViewScreen } from './src/screens/BlogWebViewScreen';
import { CohortScreen } from './src/screens/CohortScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { WebStackScreen } from './src/screens/WebStackScreen';
import type { RootStackParamList } from './src/navigation/types';

type TabParamList = {
  Cohort: undefined;
  Feed: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const TAB_ICONS: Record<
  keyof TabParamList,
  { focused: keyof typeof Ionicons.glyphMap; unfocused: keyof typeof Ionicons.glyphMap }
> = {
  Cohort: { focused: 'people', unfocused: 'people-outline' },
  Feed: { focused: 'newspaper', unfocused: 'newspaper-outline' },
  Settings: { focused: 'settings', unfocused: 'settings-outline' },
};

const TAB_LABELS: Record<keyof TabParamList, string> = {
  Cohort: '기수',
  Feed: '피드',
  Settings: '설정',
};

function TabsNavigator() {
  const { isDark } = useAppTheme();

  return (
    <Tab.Navigator
      initialRouteName="Cohort"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarLabel: TAB_LABELS[route.name as keyof TabParamList],
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: isDark ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
          borderTopColor: isDark ? '#1f1f1f' : '#e5e7eb',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name as keyof TabParamList];
          return <Ionicons name={focused ? icons.focused : icons.unfocused} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Cohort" component={CohortScreen} />
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppRoot() {
  const { isDark } = useAppTheme();
  const navTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={navTheme}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Tabs" component={TabsNavigator} />
          <RootStack.Screen
            name="BlogWebView"
            component={BlogWebViewScreen}
            options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
          />
          <RootStack.Screen name="WebStack" component={WebStackScreen} options={{ animation: 'slide_from_right' }} />
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppRoot />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
