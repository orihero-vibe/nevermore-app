import * as React from "react"
import Svg, { Path, SvgProps } from "react-native-svg"

const PauseIcon = (props: SvgProps) => (
  <Svg
    width={props.width || 36}
    height={props.height || 36}
    viewBox="0 0 36 36"
    fill="none"
    {...props}
  >
    <Path
      fill={props.color || "#fff"}
      d="M11 10h4v16h-4V10zm10 0h4v16h-4V10z"
    />
  </Svg>
)

export default PauseIcon



