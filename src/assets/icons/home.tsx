import * as React from "react"
import Svg, { Path } from "react-native-svg"

const HomeIcon = (props: any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke={props.color || "#8b5cf6"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
    />
    <Path
      stroke={props.color || "#8b5cf6"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 22V12h6v10"
    />
  </Svg>
)

export default HomeIcon

