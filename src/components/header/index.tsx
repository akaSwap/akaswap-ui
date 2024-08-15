import React, { useContext } from "react"
import Desktop from "./desktop"
import Mobile from "./mobile"
import { HeaderProps } from "@/types"

const defaultProps = {
  theme: {
    height: 60,
    bgColor: "black",
    textColor: "white",
    buttonBorderColor: "black"
  }
}

export const Header = (props: HeaderProps) => {
  props = { ...defaultProps, ...props }

  let headerStyle = {
    height: `${props.theme?.height}px`,
    backgroundColor: props.theme?.bgColor
  }

  return (
    <header style={headerStyle} className={`sticky left-0 right-0 top-0 z-50 flex`}>
      {/* Navigation bar */}
      <React.Fragment>
        {/* <Mobile /> */}
        <Desktop {...props} />
      </React.Fragment>
    </header>
  )
}
