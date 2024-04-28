import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

function Space({style}: {style?: StyleProp<ViewStyle>}) {
  const appliedStyle = style ? style : {width: 10};
  return <View style={appliedStyle} />;
}

export default Space;
