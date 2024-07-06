import {LinearGradient} from 'expo-linear-gradient';
import {useEffect, useMemo} from 'react';
import {Text, View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export default function TypingMarquee() {
  const translateX = useSharedValue(0);
  const childWidth = useMemo(() => 800, []);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withRepeat(
          withTiming(translateX.value, {
            duration: 10000,
            easing: Easing.linear,
          }),
          -1,
        ),
      },
    ],
  }));

  useEffect(() => {
    translateX.value = -childWidth;
  }, []);

  return (
    <View style={{flex: 1}}>
      <LinearGradient
        colors={['#ff6666', '#ffbd55', '#ffff66', '#9de24f', '#87cefa']}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        // locations={[0, 0.4]}
        style={{paddingVertical: 1}}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              backgroundColor: 'white',
              width: 2 * childWidth,
            },
            animatedStyles,
          ]}>
          <Text
            numberOfLines={1}
            style={{width: childWidth, fontFamily: 'Copperplate'}}>
            I'm always here for you! When you're ready, don't forget to reach
            out to people around you :)
          </Text>

          <Text
            numberOfLines={1}
            style={{width: childWidth, fontFamily: 'Copperplate'}}>
            I'm always here for you! When you're ready, don't forget to reach
            out to people around you :)
          </Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}
