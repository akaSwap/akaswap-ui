"use client"

import { getIpfsSrc, MediaLevel, MediaType } from "@akaswap/core"
import { TokenRendererProps } from "../../types"
import ImageComponent from "./medias/image"
import VectorComponent from "./medias/vector"
import HTMLComponent from "./medias/html"
import VideoComponent from "./medias/video"
import GLBComponent from "./medias/glb"
import AudioComponent from "./medias/audio"
import UnknownComponent from "./medias/unknown"

export const TokenRenderer = ({
  token,
  level = MediaLevel.thumbnail,
  gateway,
  viewer = "",
  isPreview = false,
  htmlPreviewUrl = ""
}: TokenRendererProps) => {
  let src = ""
  let errorMessage = ""
  let artifactUriHash = ""
  let displayUriHash = ""
  let thumbnailUriHash = ""

  if (!token) {
    errorMessage = "Token is not available"
  } else if (!gateway) {
    errorMessage = "Gateway is not available"
  } else {
    artifactUriHash = token.artifactUri ?? ""
    displayUriHash = token.displayUri ?? ""
    thumbnailUriHash = token.thumbnailUri ?? ""

    let uriHash = (() => {
      switch (level) {
        case MediaLevel.display:
          return displayUriHash
        case MediaLevel.artifact:
          return artifactUriHash
        default:
          return thumbnailUriHash
      }
    })()

    if (!uriHash) {
      errorMessage = "IPFS hash is not available"
    }
    src = getIpfsSrc(gateway, uriHash)
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>
  }

  switch (token.mimeType) {
    // IMAGE
    case MediaType.BMP:
    case MediaType.JPEG:
    case MediaType.PNG:
    case MediaType.WEBP:
    case MediaType.GIF: {
      return <ImageComponent src={src} />
    }

    // VECTOR
    case MediaType.SVG: {
      return <VectorComponent src={src} token={token} isPreview={isPreview} viewer={viewer} />
    }

    // HTML ZIP
    case MediaType.X_DIRECTORY:
    case MediaType.ZIP:
    case MediaType.ZIP1:
    case MediaType.ZIP2: {
      if (level !== MediaLevel.artifact) {
        return <ImageComponent src={src} />
      }

      return (
        <HTMLComponent
          src={src}
          token={token}
          viewer={viewer}
          isPreview={isPreview}
          htmlPreviewUrl={htmlPreviewUrl}
        />
      )
    }

    // VIDEOS
    case MediaType.MP4:
    case MediaType.OGV:
    case MediaType.QUICKTIME:
    case MediaType.WEBM: {
      if (level !== MediaLevel.artifact) {
        return <ImageComponent src={src} />
      }

      return <VideoComponent src={src} />
    }

    // 3D
    case MediaType.GLB:
    case MediaType.GLTF:
      // case MediaType.GLB:
      if (level !== MediaLevel.artifact) {
        return <ImageComponent src={src} />
      }

      return <GLBComponent src={src} />

    // AUDIO
    case MediaType.MP3:
    case MediaType.OGA:
      let coverUrl = displayUriHash
      if (level === MediaLevel.thumbnail) coverUrl = thumbnailUriHash

      if (level !== MediaLevel.artifact) {
        return <ImageComponent src={src} />
      }
      return <AudioComponent coverUrl={coverUrl} src={src} />

    // PDF
    default:
      return <UnknownComponent />
  }
}
