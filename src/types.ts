/// <reference types="@google/model-viewer" />

import { MediaLevel, TezosAddress, Token } from "@akaswap/core"

export type TokenRendererProps = {
  token: Token
  level?: MediaLevel
  gateway: string
  viewer?: TezosAddress | ""
  isPreview?: boolean
  htmlPreviewUrl?: string
}

export type HeaderTheme = {
  height: number
  bgColor: string
  textColor: string
  buttonBorderColor: string
}

export type HeaderLinkProps = {
  name: string
  url: string
  requiresLogin?: boolean
}

export type HeaderProps = {
  logo: React.ReactNode
  logoUrl: string
  theme?: HeaderTheme
  customClass?: string
  links: HeaderLinkProps[]
  loginMethod?: "google" | "wallet" | "both" // currently only support google
  // loginBtnContent: React.ReactNode
  connectLabel?: string
  disconnectLabel?: string
  identifier?: "google" | "wallet" // currently only support google
}

export type GoogleLoginProps = {
  // btnContent: React.ReactNode
  connectLabel: string
  disconnectLabel: string
  headerTheme?: HeaderTheme
  onConnect?: () => void
  onDisconnect?: () => void
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.AllHTMLAttributes<Partial<globalThis.HTMLElementTagNameMap["model-viewer"]>>,
        Partial<globalThis.HTMLElementTagNameMap["model-viewer"]>
      >
    }
  }
}
