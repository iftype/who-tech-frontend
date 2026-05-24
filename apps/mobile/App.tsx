import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CohortScreen } from './src/screens/CohortScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type TabParamList = {
  Cohort: undefined;
  Feed: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

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

export default function App() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <NavigationContainer theme={navTheme}>
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
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
