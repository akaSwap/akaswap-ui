import { GoogleLoginProps } from "@/types"
import { akaSwapUser } from "@akaswap/core"
import { useEffect, useState } from "react"

export const GoogleLogin = (props: GoogleLoginProps) => {
  const buttonStyle = {
    backgroundColor: props.headerTheme?.textColor,
    color: props.headerTheme?.bgColor,
    borderColor: props.headerTheme?.buttonBorderColor
  }
  const [address, setAddress] = useState<string | null>("")

  useEffect(() => {
    setAddress(akaSwapUser?.getWalletAddress())
  }, [])

  const handleConnect = async () => {
    akaSwapUser?.connectWallet().then(() => {
      setAddress(akaSwapUser?.getWalletAddress())
      props.onConnect?.()
    })
  }

  const handleDisconnect = async () => {
    akaSwapUser?.disconnectWallet().then(() => {
      setAddress(akaSwapUser?.getWalletAddress())
      props.onDisconnect?.()
    })
  }

  return (
    <button
      style={buttonStyle}
      className={"hover:scale-105 border py-2 px-4 rounded-lg transition-transform duration-200"}
      onClick={address ? handleDisconnect : handleConnect}
    >
      {address ? props.disconnectLabel : props.connectLabel}
    </button>
  )
}
