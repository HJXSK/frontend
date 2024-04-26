import React from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';

// Function Component: Space
// Description: renders an empty View with a specified style
// used to create empty space or gaps between other UI elements in a layout.

function Space({style}: {style?: StyleProp<ViewStyle>}) {
  const appliedStyle = style ? style : {width: 10};
  return <View style={appliedStyle} />;
}

export default Space;
