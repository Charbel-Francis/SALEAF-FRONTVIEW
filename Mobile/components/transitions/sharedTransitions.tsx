import { SharedTransition, withSpring } from "react-native-reanimated";

export const sharedTransition = SharedTransition.custom((values) => {
  "worklet";
  return {
    height: withSpring(values.targetHeight, { mass: 0.3 }),
    width: withSpring(values.targetWidth, { mass: 0.3 }),
    originX: withSpring(values.targetOriginX, { mass: 0.3 }),
    originY: withSpring(values.targetOriginY, { mass: 0.3 }),
    transform: [
      { translateX: withSpring(values.targetOriginX, { mass: 0.3 }) },
      { translateY: withSpring(values.targetOriginY, { mass: 0.3 }) },
    ],
  };
});

// Simpler transition for the container
export const containerTransition = SharedTransition.custom((values) => {
  "worklet";
  return {
    height: withSpring(values.targetHeight),
    width: withSpring(values.targetWidth),
  };
});
