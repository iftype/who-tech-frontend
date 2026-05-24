import { useIsFocused } from '@react-navigation/native';

import { WebTabScreen } from '../components/WebTabScreen';
import { TAB_PATHS } from '../config';

export function SettingsScreen() {
  const isFocused = useIsFocused();
  return <WebTabScreen path={TAB_PATHS.settings} tabKey="settings" isFocused={isFocused} />;
}
