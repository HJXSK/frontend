import dayjs from 'dayjs';
import {Audio} from 'expo-av';
import {LinearGradient} from 'expo-linear-gradient';
import {forwardRef, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {FontAwesome5} from '@expo/vector-icons';

type AudioBarProps = {
  animatedStyles: any;
  audioSetter: (audio: string | null) => void;
};

const AudioBar: React.FC<AudioBarProps> = forwardRef(
  ({animatedStyles, audioSetter}, ref) => {
    const [audioStatus, setAudioStatus] =
      useState<Audio.RecordingStatus | null>();
    const recordingRef = useRef<Audio.Recording | null>();
    const blink = useSharedValue<number>(0);

    useEffect(() => {
      // Start recording audio when component mounts
      recordAudio();
      // Stop recording audio when component unmounts
      return () => {
        stopRecording();
      };
    }, []);

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

    const stopRecording = async () => {
      console.log('Stopping recording..');
      if (!recordingRef.current) {
        // clear the recording delay timeout
        // clearTimeout(recordingDelayRef.current!);
        console.log('TOO SHORT');
        return;
      }
      await recordingRef.current!.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recordingRef.current!.getURI();
      audioSetter(uri);
    };

    return (
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
    );
  },
);

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flex: 2,
  },

  text: {
    flex: 1,
    fontSize: 20,
    textAlign: 'center',
    color: 'rgba(0,0,0, 0.4)',
  },

  container: {
    flex: 9,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default AudioBar;
