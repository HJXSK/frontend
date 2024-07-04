import {Keyboard, Text} from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type SlideUpPanelProps = {
  open: boolean;
  children?: React.ReactNode;
};

export default function SlideUpPanel({
  open,
  children,
}: SlideUpPanelProps): JSX.Element {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);

  Keyboard.addListener('keyboardWillShow', e => {
    opacity.value = 0;
  });
  Keyboard.addListener('keyboardWillHide', e => {
    opacity.value = 1;
  });

  if (open) {
    opacity.value = 1;
    height.value = 200;
  } else {
    height.value = 0;
  }

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
    height: withTiming(height.value, {
      duration: 200,
      easing: Easing.out(Easing.quad),
      reduceMotion: ReduceMotion.System,
    }),
    borderTopWidth: height.value == 0 ? 0 : 0.2,
  }));

  return (
    <Animated.View
      style={[
        animatedStyles,
        {
          overflow: 'hidden',
          borderColor: 'gray',
          flexDirection: 'row',
        },
      ]}>
      {children}
    </Animated.View>
  );
}
