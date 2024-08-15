"use client"

import { HeaderProps } from "@/types"
import { GoogleLogin } from "../google-login"
import { useEffect, useState } from "react"
import { akaSwapUser } from "@akaswap/core"

export default function Desktop(props: HeaderProps) {
  const textStyle = {
    color: props.theme?.textColor
  }
  const [address, setAddress] = useState<string | null>("")

  useEffect(() => {
    setAddress(akaSwapUser?.getWalletAddress())
  }, [])

  return (
    <nav className="flex flex-row w-full items-center justify-between px-8">
      <a href={props.logoUrl}>{props.logo}</a>
      <ul className="relative flex items-center gap-8">
        {props.links &&
          props.links
            .filter((link) => !link.requiresLogin || address)
            .map((link) => (
              <li key={link.name}>
                <a href={link.url} style={textStyle}>
                  {link.name}
                </a>
              </li>
            ))}
        {(props.loginMethod === "google" || props.loginMethod === "both") && (
          <GoogleLogin
            // btnContent={props.loginBtnContent}
            connectLabel={props.connectLabel ?? "Connect"}
            disconnectLabel={props.disconnectLabel ?? "Disconnect"}
            headerTheme={props.theme}
            onConnect={() => setAddress(akaSwapUser?.getWalletAddress())}
            onDisconnect={() => setAddress(akaSwapUser?.getWalletAddress())}
          />
        )}
        <div className="text-white">{address}</div>
      </ul>
    </nav>
  )
}
