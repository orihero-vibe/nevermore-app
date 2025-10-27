import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const PlayIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="white"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 5v14l11-7z"
    />
  </Svg>
)

export default PlayIcon
