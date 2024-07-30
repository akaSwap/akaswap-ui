import { MediaType } from "@akaswap/core"
import * as fflate from "fflate"
import mime from "mime-types"

export function dataRUIToBuffer(dataURI: string) {
  const parts = dataURI.split(",")
  const base64 = parts[1]
  const binaryStr = atob(base64)
  const len = binaryStr.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }
  return bytes
}

export async function unzipBuffer(buffer: Uint8Array) {
  let unzipped = fflate.unzipSync(buffer)
  let entries = Object.entries(unzipped).map((entry) => {
    return {
      path: entry[0],
      buffer: entry[1]
    }
  })

  // Find root dir
  let rootDir = null
  for (let i = 0; i < entries.length; i++) {
    const parts = entries[i].path.split("/")
    const filename = parts[parts.length - 1]
    if (filename === "index.html") {
      const parts = entries[i].path.split("/")
      parts.pop()
      rootDir = parts.join("/")
      break
    }
  }

  if (rootDir === null) {
    const msg = "No index.html file found!"
    window.alert(msg)
    throw new Error(msg)
  }

  // Create files map
  const files: any = {}
  entries.forEach((entry, index) => {
    const relPath = entry.path.replace(`${rootDir}/`, "")
    let type: string | undefined
    if (entry.buffer.length === 0 && entry.path.endsWith("/")) {
      type = MediaType.X_DIRECTORY
    } else {
      type = mime.lookup(entry.path) === false ? "" : mime.lookup(entry.path).toString()
    }

    files[relPath] = new Blob([entry.buffer], {
      type
    })
  })

  return files
}

export function injectCSPMetaTagIntoHTML(html: string) {
  // HTML -> doc
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  // remove any existing CSP meta tags
  const existing = doc.head.querySelectorAll('meta[http-equiv="Content-Security-Policy"]')
  if (existing.length) {
    for (let i = 0; i < existing.length; i++) {
      existing[i].remove()
    }
  }

  if (!doc.head) {
    const msg = "index.html is missing <head> tag!"
    window.alert(msg)
    throw new Error(msg)
  }

  // inject CSP meta tag
  doc.head.insertAdjacentHTML(
    "afterbegin",
    `
    <meta http-equiv="Content-Security-Policy" content="
    frame-ancestors
      *;
    upgrade-insecure-requests;
    default-src
      'none';
    frame-src
      'self';
    child-src
      'self';
    script-src
      'self'
      'unsafe-inline'
      'unsafe-eval'
      blob:;
    style-src
      'self'
      'unsafe-inline';
    img-src
      'self'
      'unsafe-inline'
      data:
      blob:
      https://ipfs.infura.io
      https://*.infura-ipfs.io
      https://cloudflare-ipfs.com/
      https://ipfs.io/
      https://gateway.pinata.cloud/
      https://akaswap.com
      https://*.akaswap.com
      https://akaverse.app
      https://*.akaverse.app;
    font-src
      'self'
      https://ipfs.infura.io
      https://*.infura-ipfs.io
      https://cloudflare-ipfs.com/
      https://fonts.googleapis.com/
      https://ipfs.io/
      https://gateway.pinata.cloud/
      https://akaswap.com
      https://*.akaswap.com;
    connect-src
      'self'
      https://better-call.dev
      https://*.better-call.dev
      https://*.cryptonomic-infra.tech
      https://cryptonomic-infra.tech
      https://*.infura.io
      https://*.infura-ipfs.io
      https://infura.io
      https://tezdozen.xyz
      blob:
      ws:
      wss:
      bootstrap.libp2p.io
      preload.ipfs.io
      https://api.hicdex.com
      https://hdapi.teztools.io
      https://api.teia.rocks
      https://data.objkt.com
      https://api.fxhash.xyz
      https://api.etherscan.io
      https://api.thegraph.com
      https://*.tzkt.io
      https://api.tzstats.com
      https://*.wikidata.org
      https://*.coinmarketcap.com
      https://api.openweathermap.org
      https://akaswap.com
      https://*.akaswap.com
      https://akaverse.app
      https://*.akaverse.app;
    manifest-src
      'self';
    base-uri
      'self';
    form-action
      'none';
    media-src
      'self'
      'unsafe-inline'
      data:
      blob:
      https://ipfs.infura.io
      https://*.infura-ipfs.io
      https://cloudflare-ipfs.com/
      https://ipfs.io/
      https://gateway.pinata.cloud/
      https://akaswap.com
      https://*.akaswap.com
      https://akaverse.app
      https://*.akaverse.app;
    prefetch-src
      'self'
      https://ipfs.infura.io
      https://*.infura-ipfs.io
      https://cloudflare-ipfs.com/
      https://fonts.googleapis.com/
      https://ipfs.io/
      https://gateway.pinata.cloud/
      https://akaswap.com
      https://*.akaswap.com;
    webrtc-src
      *;
    worker-src
      'self'
      'unsafe-inline'
      blob:;">
  `
  )

  // doc -> HTML
  return `<!DOCTYPE html><html>${doc.documentElement.innerHTML}</html>`
}

export function injectCSPMetaTagIntoBuffer(buffer: ArrayBuffer) {
  // buffer -> HTML
  const html = new TextDecoder().decode(buffer)

  // inject CSP meta tag
  const safeHTML = injectCSPMetaTagIntoHTML(html)

  // HTML -> buffer
  return new TextEncoder().encode(safeHTML)
}

export async function prepareFilesFromZIP(buffer: Uint8Array) {
  // unzip files
  let files = await unzipBuffer(buffer)

  // save raw index file
  const indexBlob = files["index.html"]
  files["index_raw.html"] = new Blob([indexBlob], { type: indexBlob.type })

  // inject CSP meta tag in all html files
  for (let k in files) {
    if (k.endsWith(".html") || k.endsWith(".htm")) {
      const pageBuffer = await files[k].arrayBuffer()
      const safePageBuffer = injectCSPMetaTagIntoBuffer(pageBuffer)
      files[k] = new Blob([safePageBuffer], {
        type: indexBlob.type
      })
    }
  }

  // reformat
  files = Object.entries(files).map((file) => {
    return {
      path: file[0],
      blob: file[1]
    }
  })

  // remove top level dir
  files = files.filter((f: any) => f.path !== "")

  return files
}

export async function validateFiles(files: { [key: string]: any }) {
  // check for index.html file
  if (!files["index.html"]) {
    return {
      valid: false,
      error: "Missing index.html file"
    }
  }

  const pageBlob = files["index.html"]
  let htmlString = await pageBlob.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, "text/html")

  // check for <head> tag
  if (!doc.head) {
    return {
      valid: false,
      error: "Missing <head> tag in index.html. Please refer to the Interactive akaOBJs Guide.."
    }
  }

  return {
    valid: true
  }
}
