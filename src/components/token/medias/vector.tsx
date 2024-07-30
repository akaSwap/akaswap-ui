import { TezosAddress, Token } from "@akaswap/core"
import { useContext } from "react"

export default function VectorComponent({
  src,
  token,
  viewer,
  isPreview
}: {
  src: string
  token: Token
  viewer: TezosAddress | ""
  isPreview: boolean
}) {
  let _creator_ = ""

  if (token.creators !== undefined && token.creators !== null && token.creators.length > 0) {
    _creator_ = token.creators[0]
  }

  let iframeSrc
  if (isPreview) {
    // can't pass creator/viewer query params to data URI
    iframeSrc = src
  } else {
    iframeSrc = `${src}?creator=${_creator_}&viewer=${viewer}`
  }

  return (
    <div className="relative h-full w-full">
      <iframe title="akaSwap SVG renderer" src={iframeSrc} sandbox="" />
    </div>
  )
}
