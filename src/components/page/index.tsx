import {ScrollView, StyleSheet, View} from 'react-native';

type ScrollPageProps = {
  style?: {};
  children: React.ReactNode;
};

const ScrollPage: React.FC<ScrollPageProps> = ({
  style,
  children,
}): JSX.Element => {
  return (
    <ScrollView>
      <View style={[styles.container, style]}>{children}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 30,
  },
});

export default ScrollPage;
