import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const FlagIcon = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M5 21V4H14L14.4 6H20V16H13L12.6 14H7V21H5ZM14.65 14H18V8H12.75L12.35 6H7V12H14.25L14.65 14Z"
      fill="white"
    />
  </Svg>
)

export default FlagIcon
