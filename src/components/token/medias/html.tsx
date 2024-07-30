import { dataRUIToBuffer, prepareFilesFromZIP, validateFiles } from "@/utils/html"
import { TezosAddress, Token } from "@akaswap/core"
import { useCallback, useEffect, useRef, useState } from "react"

const uid = Math.round(Math.random() * 100000000).toString()

export default function HTMLComponent({
  src,
  token,
  viewer,
  isPreview,
  htmlPreviewUrl
}: {
  src: string
  token: Token
  viewer: TezosAddress | ""
  isPreview: boolean
  htmlPreviewUrl: string
}) {
  let _objkt_ = "0"
  let _creator_ = ""

  if (token.tokenId !== undefined && token.tokenId !== null) {
    _objkt_ = token.tokenId.toString()
  }

  if (token.creators && token.creators.length > 0) {
    _creator_ = token.creators[0]
  }

  // preview
  const iframeRef = useRef(null)
  const unpackedFiles = useRef(null)
  const unpacking = useRef(false)
  const [validHTML, setValidHTML] = useState<boolean | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [containerStyle, setContainerStyle] = useState({})

  const loaded = () => {
    setContainerStyle({ background: "var(--black-color)" })
    const containerElement = document.getElementById("container")

    if (containerElement) {
      containerElement.style.setProperty("background-image", "none")
    }
  }

  const resizeIframe = async (h: string, w: string) => {
    const height = `${h}px`
    let iframe = iframeRef.current as any

    if (iframe !== null) {
      iframe.style.height = height
      iframe.parentElement.style.height = height
    }
  }

  const unpackZipFiles = async () => {
    unpacking.current = true

    const buffer = dataRUIToBuffer(src)
    const filesArr = await prepareFilesFromZIP(buffer)
    const files: any = {}
    filesArr.forEach((f: any) => {
      files[f.path] = f.blob
    })

    unpackedFiles.current = files

    const result = await validateFiles(unpackedFiles?.current!)
    if (result.error) {
      console.error(result.error)
      setValidationError(result.error)
    } else {
      setValidationError(null)
    }
    setValidHTML(result.valid)

    unpacking.current = false
  }

  if (isPreview && !unpackedFiles.current && !unpacking.current) {
    unpackZipFiles()
  }

  const handler = useCallback(async (event: any) => {
    // if it has specified size in iframe
    if (event.data && event.data.height !== undefined && event.data.height !== null) {
      resizeIframe(event.data.height, event.data.width)
    }
    if (event.data !== uid) {
      return
    }

    let iframe = iframeRef.current as any

    if (iframe !== null) {
      iframe.contentWindow.postMessage(
        {
          target: "akaswap-html-preview",
          data: unpackedFiles.current
        },
        "*"
      )
    }
  }, [])

  useEffect(() => {
    window.addEventListener("message", handler)

    return () => {
      window.removeEventListener("message", handler)
    }
  }, [handler])

  if (isPreview) {
    // creator is viewer in preview
    _creator_ = viewer
    _objkt_ = "0"

    if (!htmlPreviewUrl) {
      return <div className="">Preview Error: HTML Preview URL not provided</div>
    } else if (validHTML) {
      return (
        <div className="align-center relative flex h-full w-full items-center">
          <iframe
            className="absolute left-0 top-0 h-full w-full border-0"
            ref={iframeRef}
            id="embedded-iframe"
            title="html-zip-embed"
            src={`${htmlPreviewUrl}/?uid=${uid}&objkt=${_objkt_}&creator=${_creator_}&viewer=${viewer}`}
            sandbox="allow-scripts allow-same-origin allow-downloads allow-modals allow-popups"
            allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
          />
        </div>
      )
    } else if (validHTML === false) {
      return <div className="">Preview Error: {validationError}</div>
    }
  }

  let pos = src.indexOf("?")
  if (pos >= 0 && src[pos - 1] !== "/") {
    src = src.substring(0, pos) + "/" + src.substring(pos, src.length)
  }
  let search = src.split("/").at(-1) ?? ""
  const params = search.indexOf("?") >= 0 ? search.split("?").at(-1) : ""
  const url = src.replace(`?${params}`, "")

  return (
    <div className="align-center relative flex h-full w-full items-center" id="container">
      <iframe
        className="absolute left-0 top-0 h-full w-full border-0"
        title="html-embed"
        id="embedded-iframe"
        ref={iframeRef}
        src={`${url}?objkt=${_objkt_}&creator=${_creator_}&viewer=${viewer}&${params}`}
        sandbox="allow-scripts allow-same-origin allow-downloads allow-modals allow-popups"
        allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
        scrolling="no"
        onLoad={() => loaded()}
      />
    </div>
  )
}
