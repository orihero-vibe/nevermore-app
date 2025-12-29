import * as React from "react"
import Svg, { Path, Circle, SvgProps } from "react-native-svg"
const CheckGreenIcon = (props: SvgProps) => {
  const color = props.color || '#00ff88'
  const size = props.width || 20
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <Circle
        cx="10"
        cy="10"
        r="9"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
      />
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6 10l2.5 2.5L14 7"
      />
    </Svg>
  )
}
export default CheckGreenIcon
