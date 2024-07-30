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
