import {useEffect} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

type DotProps = {
  delay: number;
  duration: number;
};

// Animated dot component
const AnimatingDot: React.FC<DotProps> = ({delay = 0, duration = 1000}) => {
  const value = new Animated.Value(0);

  useEffect(() => {
    // Create an animation loop
    const animation = Animated.loop(
      Animated.timing(value, {
        toValue: 1,
        delay: delay,
        duration: duration,
        useNativeDriver: true,
      }),
    );
    animation.start();

    // Clean up the animation on component unmount
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <View>
      <Animated.View
        style={[
          styles.typingDot,
          {
            opacity: value.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.5, 1, 0.5],
            }),
          },
        ]}
      />
    </View>
  );
};

// Typing bubble component
const TypingBubble: React.FC = () => {
  const numDots = 3;
  const slowness = 400;
  return (
    <View style={styles.typingBubble}>
      {[...Array(numDots)].map((_, index) => {
        return (
          <AnimatingDot
            key={index}
            delay={index * slowness}
            duration={numDots * slowness}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
  },
  typingBubble: {
    flex: 1,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    width: 75,
    height: 35,
    backgroundColor: '#007AFF',
  },
  typingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginHorizontal: 5,
  },
});

export default TypingBubble;
