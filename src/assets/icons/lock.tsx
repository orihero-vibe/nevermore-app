import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface LockIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function LockIcon({
  width = 24,
  height = 24,
  color = '#9CA3AF',
}: LockIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 11V7a5 5 0 0 1 10 0v4M5 11h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
