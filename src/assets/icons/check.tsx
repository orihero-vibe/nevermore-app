import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"
const CheckIcon = (props: SvgProps) => (
  <Svg
    width={15}
    height={11}
    fill="none"
    stroke={props.stroke || '#8b5cf6'}
    {...props}
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="m.75 5.084 4.334 4.333L13.75.75"
    />
  </Svg>
)
export default CheckIcon
