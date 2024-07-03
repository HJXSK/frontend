import {LinearGradient} from 'expo-linear-gradient';
import {useRef, useState, Dispatch, SetStateAction} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import dayjs from 'dayjs';
import {Audio} from 'expo-av';
import {FontAwesome5} from '@expo/vector-icons';
import {MessageType} from '.';
import {sendMessage} from '@/util/firebase';

type AudioBarProps = {
  inputTypeSetter: Dispatch<SetStateAction<MessageType>>;
};

export default function AudioBar({inputTypeSetter}: AudioBarProps) {
  // Shared value for the pressing state of the long press gesture
  const isPressing = useSharedValue(0);
  // Shared value for the blinking animation of the microphone icon
  const blink = useSharedValue<number>(0);
  // Shared value for the offset of the pan gesture
  const offset = useSharedValue<number>(0);

  // State for audio status
  const [audioStatus, setAudioStatus] =
    useState<Audio.RecordingStatus | null>();
  // Ref for recording instance
  const recordingRef = useRef<Audio.Recording | null>();

  const recordAudio = async () => {
    const permissionResponse = await Audio.requestPermissionsAsync();
    try {
      if (permissionResponse!.status !== 'granted') {
        console.log('Requesting permission..');
        await Audio.requestPermissionsAsync();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      // delay 1 second before starting recording

      console.log('Starting recording..');
      const {recording} = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.LOW_QUALITY,
        status => {
          setAudioStatus(status);
        },
        500,
      );
      recordingRef.current = recording;
      console.log('Recording started');
      inputTypeSetter('audio');

      // Animate the microphone icon to blink
      blink.value = withRepeat(
        withTiming((blink.value + 1) % 2, {duration: 1000}),
        -1,
        true,
      );
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  /**
   * Stop the recording and send the audio message
   * @param send - Whether to send the audio message or not
   */
  const stopRecording = async (send: boolean = true) => {
    console.log('Stopping recording..');
    if (!recordingRef.current) {
      console.log('TOO SHORT');
      return;
    }
    const {durationMillis} = await recordingRef.current!.getStatusAsync();
    await recordingRef.current!.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recordingRef.current!.getURI();
    recordingRef.current = undefined;
    if (send) {
      sendMessage('audio', {uri: uri!, duration: durationMillis});
    }
    // Reset the input type
    inputTypeSetter('text');
  };

  // Gesture detections including pan and long press for audio input
  const pan = Gesture.Pan()
    .onChange(event => {
      if (event.translationX > 0) {
        return;
      }
      if (event.translationX < -150) {
        runOnJS(stopRecording)(false);
        return;
      }
      offset.value = event.translationX;
    })
    .onFinalize(event => {
      offset.value = withSpring(0);
    });

  const longPress = Gesture.LongPress()
    .minDuration(200)
    .shouldCancelWhenOutside(false)
    .maxDistance(3000)
    .onBegin(() => {
      isPressing.value = 0.5;
    })
    .onStart(() => {
      runOnJS(recordAudio)();
    })
    .onEnd(() => {
      runOnJS(stopRecording)();
    })
    .onFinalize(() => {
      isPressing.value = 1;
    });

  // The composed gesture that is used for the audio input
  const compose = Gesture.Simultaneous(longPress, pan);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));

  return (
    <>
      {recordingRef.current && (
        <>
          <View style={styles.infoContainer}>
            <Animated.View style={{opacity: blink}}>
              <FontAwesome5 name="microphone" size={20} color="red" />
            </Animated.View>
            <Text style={{color: 'rgba(0,0,0,.4)'}}>
              {dayjs(audioStatus?.durationMillis).format('m:ss')}
            </Text>
          </View>
          <View style={styles.container}>
            <Animated.View style={[animatedStyles]}>
              <Text style={[styles.text]}>{'slide to cancel <<'}</Text>
            </Animated.View>

            <LinearGradient
              colors={['white', 'rgba(255,255,255,0)']}
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              locations={[0, 0.4]}
              style={{
                height: '100%',
                width: '100%',
                position: 'absolute',
              }}
            />
          </View>
        </>
      )}
      <GestureDetector gesture={compose}>
        <Animated.View
          style={[
            {
              opacity: isPressing,
            },
            styles.audioButton,
          ]}>
          <FontAwesome5 name="microphone" size={20} color="rgba(0,0,0, 0.4)" />
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 2,
  },
  audioButton: {
    position: 'absolute',
    right: 20,
    bottom: 15, // (minHeight - 20) / 2
  },
  text: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    color: 'rgba(0,0,0, 0.4)',
  },

  container: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
});
