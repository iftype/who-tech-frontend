import { useIsFocused } from '@react-navigation/native';

import { WebTabScreen } from '../components/WebTabScreen';
import { TAB_PATHS } from '../config';

export function FeedScreen() {
  const isFocused = useIsFocused();
  return <WebTabScreen path={TAB_PATHS.feed} isFocused={isFocused} />;
}
