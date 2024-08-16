// react-shim.js
import React from "react";

// src/components/token/renderer.tsx
import { getIpfsSrc, MediaLevel, MediaType as MediaType2 } from "@akaswap/core";

// src/components/token/medias/image.tsx
import Image from "next/image";
function ImageComponent({ src }) {
  return /* @__PURE__ */ React.createElement(
    Image,
    {
      priority: true,
      alt: "token-image",
      src,
      width: 0,
      height: 0,
      sizes: "100%",
      className: "h-auto w-full"
    }
  );
}

// src/components/token/medias/vector.tsx
function VectorComponent({
  src,
  token,
  viewer,
  isPreview
}) {
  let _creator_ = "";
  if (token.creators !== void 0 && token.creators !== null && token.creators.length > 0) {
    _creator_ = token.creators[0];
  }
  let iframeSrc;
  if (isPreview) {
    iframeSrc = src;
  } else {
    iframeSrc = `${src}?creator=${_creator_}&viewer=${viewer}`;
  }
  return /* @__PURE__ */ React.createElement("div", { className: "relative h-full w-full" }, /* @__PURE__ */ React.createElement("iframe", { title: "akaSwap SVG renderer", src: iframeSrc, sandbox: "" }));
}

// src/utils/html.ts
import { MediaType } from "@akaswap/core";
import * as fflate from "fflate";
import mime from "mime-types";
function dataRUIToBuffer(dataURI) {
  const parts = dataURI.split(",");
  const base64 = parts[1];
  const binaryStr = atob(base64);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}
async function unzipBuffer(buffer) {
  let unzipped = fflate.unzipSync(buffer);
  let entries = Object.entries(unzipped).map((entry) => {
    return {
      path: entry[0],
      buffer: entry[1]
    };
  });
  let rootDir = null;
  for (let i = 0; i < entries.length; i++) {
    const parts = entries[i].path.split("/");
    const filename = parts[parts.length - 1];
    if (filename === "index.html") {
      const parts2 = entries[i].path.split("/");
      parts2.pop();
      rootDir = parts2.join("/");
      break;
    }
  }
  if (rootDir === null) {
    const msg = "No index.html file found!";
    window.alert(msg);
    throw new Error(msg);
  }
  const files = {};
  entries.forEach((entry, index) => {
    const relPath = entry.path.replace(`${rootDir}/`, "");
    let type;
    if (entry.buffer.length === 0 && entry.path.endsWith("/")) {
      type = MediaType.X_DIRECTORY;
    } else {
      type = mime.lookup(entry.path) === false ? "" : mime.lookup(entry.path).toString();
    }
    files[relPath] = new Blob([entry.buffer], {
      type
    });
  });
  return files;
}
function injectCSPMetaTagIntoHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const existing = doc.head.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
  if (existing.length) {
    for (let i = 0; i < existing.length; i++) {
      existing[i].remove();
    }
  }
  if (!doc.head) {
    const msg = "index.html is missing <head> tag!";
    window.alert(msg);
    throw new Error(msg);
  }
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
  );
  return `<!DOCTYPE html><html>${doc.documentElement.innerHTML}</html>`;
}
function injectCSPMetaTagIntoBuffer(buffer) {
  const html = new TextDecoder().decode(buffer);
  const safeHTML = injectCSPMetaTagIntoHTML(html);
  return new TextEncoder().encode(safeHTML);
}
async function prepareFilesFromZIP(buffer) {
  let files = await unzipBuffer(buffer);
  const indexBlob = files["index.html"];
  files["index_raw.html"] = new Blob([indexBlob], { type: indexBlob.type });
  for (let k in files) {
    if (k.endsWith(".html") || k.endsWith(".htm")) {
      const pageBuffer = await files[k].arrayBuffer();
      const safePageBuffer = injectCSPMetaTagIntoBuffer(pageBuffer);
      files[k] = new Blob([safePageBuffer], {
        type: indexBlob.type
      });
    }
  }
  files = Object.entries(files).map((file) => {
    return {
      path: file[0],
      blob: file[1]
    };
  });
  files = files.filter((f) => f.path !== "");
  return files;
}
async function validateFiles(files) {
  if (!files["index.html"]) {
    return {
      valid: false,
      error: "Missing index.html file"
    };
  }
  const pageBlob = files["index.html"];
  let htmlString = await pageBlob.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  if (!doc.head) {
    return {
      valid: false,
      error: "Missing <head> tag in index.html. Please refer to the Interactive akaOBJs Guide.."
    };
  }
  return {
    valid: true
  };
}

// src/components/token/medias/html.tsx
import { useCallback, useEffect, useRef, useState } from "react";
var uid = Math.round(Math.random() * 1e8).toString();
function HTMLComponent({
  src,
  token,
  viewer,
  isPreview,
  htmlPreviewUrl
}) {
  let _objkt_ = "0";
  let _creator_ = "";
  if (token.tokenId !== void 0 && token.tokenId !== null) {
    _objkt_ = token.tokenId.toString();
  }
  if (token.creators && token.creators.length > 0) {
    _creator_ = token.creators[0];
  }
  const iframeRef = useRef(null);
  const unpackedFiles = useRef(null);
  const unpacking = useRef(false);
  const [validHTML, setValidHTML] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [containerStyle, setContainerStyle] = useState({});
  const loaded = () => {
    setContainerStyle({ background: "var(--black-color)" });
    const containerElement = document.getElementById("container");
    if (containerElement) {
      containerElement.style.setProperty("background-image", "none");
    }
  };
  const resizeIframe = async (h, w) => {
    const height = `${h}px`;
    let iframe = iframeRef.current;
    if (iframe !== null) {
      iframe.style.height = height;
      iframe.parentElement.style.height = height;
    }
  };
  const unpackZipFiles = async () => {
    unpacking.current = true;
    const buffer = dataRUIToBuffer(src);
    const filesArr = await prepareFilesFromZIP(buffer);
    const files = {};
    filesArr.forEach((f) => {
      files[f.path] = f.blob;
    });
    unpackedFiles.current = files;
    const result = await validateFiles(unpackedFiles?.current);
    if (result.error) {
      console.error(result.error);
      setValidationError(result.error);
    } else {
      setValidationError(null);
    }
    setValidHTML(result.valid);
    unpacking.current = false;
  };
  if (isPreview && !unpackedFiles.current && !unpacking.current) {
    unpackZipFiles();
  }
  const handler = useCallback(async (event) => {
    if (event.data && event.data.height !== void 0 && event.data.height !== null) {
      resizeIframe(event.data.height, event.data.width);
    }
    if (event.data !== uid) {
      return;
    }
    let iframe = iframeRef.current;
    if (iframe !== null) {
      iframe.contentWindow.postMessage(
        {
          target: "akaswap-html-preview",
          data: unpackedFiles.current
        },
        "*"
      );
    }
  }, []);
  useEffect(() => {
    window.addEventListener("message", handler);
    return () => {
      window.removeEventListener("message", handler);
    };
  }, [handler]);
  if (isPreview) {
    _creator_ = viewer;
    _objkt_ = "0";
    if (!htmlPreviewUrl) {
      return /* @__PURE__ */ React.createElement("div", { className: "" }, "Preview Error: HTML Preview URL not provided");
    } else if (validHTML) {
      return /* @__PURE__ */ React.createElement("div", { className: "align-center relative flex h-full w-full items-center" }, /* @__PURE__ */ React.createElement(
        "iframe",
        {
          className: "absolute left-0 top-0 h-full w-full border-0",
          ref: iframeRef,
          id: "embedded-iframe",
          title: "html-zip-embed",
          src: `${htmlPreviewUrl}/?uid=${uid}&objkt=${_objkt_}&creator=${_creator_}&viewer=${viewer}`,
          sandbox: "allow-scripts allow-same-origin allow-downloads allow-modals allow-popups",
          allow: "accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;"
        }
      ));
    } else if (validHTML === false) {
      return /* @__PURE__ */ React.createElement("div", { className: "" }, "Preview Error: ", validationError);
    }
  }
  let pos = src.indexOf("?");
  if (pos >= 0 && src[pos - 1] !== "/") {
    src = src.substring(0, pos) + "/" + src.substring(pos, src.length);
  }
  let search = src.split("/").at(-1) ?? "";
  const params = search.indexOf("?") >= 0 ? search.split("?").at(-1) : "";
  const url = src.replace(`?${params}`, "");
  return /* @__PURE__ */ React.createElement("div", { className: "align-center relative flex h-full w-full items-center", id: "container" }, /* @__PURE__ */ React.createElement(
    "iframe",
    {
      className: "absolute left-0 top-0 h-full w-full border-0",
      title: "html-embed",
      id: "embedded-iframe",
      ref: iframeRef,
      src: `${url}?objkt=${_objkt_}&creator=${_creator_}&viewer=${viewer}&${params}`,
      sandbox: "allow-scripts allow-same-origin allow-downloads allow-modals allow-popups",
      allow: "accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;",
      scrolling: "no",
      onLoad: () => loaded()
    }
  ));
}

// src/components/token/medias/video.tsx
import { useEffect as useEffect2, useRef as useRef2 } from "react";
function VideoComponent({ src }) {
  const domElement = useRef2(null);
  useEffect2(() => {
    const isVideoPlaying = (video) => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
    const isVideoAvailable = (video) => video.readyState > 2;
    if (domElement.current !== null && isVideoAvailable(domElement.current) && isVideoPlaying(domElement.current)) {
      ;
      domElement.current.pause();
    }
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: "align-center flex h-full w-full items-center" }, /* @__PURE__ */ React.createElement(
    "video",
    {
      ref: domElement,
      className: "mx-auto block h-auto w-full",
      autoPlay: false,
      muted: true,
      loop: true,
      controls: true,
      src
    }
  ));
}

// src/components/token/medias/glb.tsx
import { useEffect as useEffect3, useRef as useRef3, useState as useState2 } from "react";
function GLBComponent({ src }) {
  const ref = useRef3(null);
  const [width, setWidth] = useState2("100px");
  const [height, setHeight] = useState2("100px");
  const props = {
    src,
    autoplay: true,
    "auto-rotate": true,
    "data-js-focus-visible": true,
    "camera-controls": true
  };
  const handleResize = () => {
    if (ref.current === null) return;
    const { width: width2, height: height2 } = ref.current.getBoundingClientRect();
    setWidth(width2.toString());
    setHeight(height2.toString());
  };
  useEffect3(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width, height]);
  return /* @__PURE__ */ React.createElement("div", { className: "relative mx-auto flex h-full w-full items-center justify-center", ref }, /* @__PURE__ */ React.createElement(
    "model-viewer",
    {
      ...props,
      className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
      style: { width: `${width}px`, height: `${height}px` }
    },
    /* @__PURE__ */ React.createElement("button", { slot: "ar-button", className: "" }, "AR")
  ));
}

// src/components/token/medias/audio.tsx
function AudioComponent({ coverUrl, src }) {
  return /* @__PURE__ */ React.createElement("div", { className: "relative mx-auto flex h-full w-full flex-col items-center" }, /* @__PURE__ */ React.createElement("img", { src: coverUrl, alt: "audio" }), /* @__PURE__ */ React.createElement("audio", { src, controls: true, className: "mt-[1rem] w-full" }));
}

// src/components/token/medias/unknown.tsx
function UnknownComponent({}) {
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-full w-full items-center justify-center" }, /* @__PURE__ */ React.createElement("p", null, "NOT SUPPORTED (yet)"));
}

// src/components/token/renderer.tsx
var TokenRenderer = ({
  token,
  level = MediaLevel.thumbnail,
  gateway,
  viewer = "",
  isPreview = false,
  htmlPreviewUrl = ""
}) => {
  let src = "";
  let errorMessage = "";
  let artifactUriHash = "";
  let displayUriHash = "";
  let thumbnailUriHash = "";
  if (!token) {
    errorMessage = "Token is not available";
  } else if (!gateway) {
    errorMessage = "Gateway is not available";
  } else {
    artifactUriHash = token.artifactUri ?? "";
    displayUriHash = token.displayUri ?? "";
    thumbnailUriHash = token.thumbnailUri ?? "";
    let uriHash = (() => {
      switch (level) {
        case MediaLevel.display:
          return displayUriHash;
        case MediaLevel.artifact:
          return artifactUriHash;
        default:
          return thumbnailUriHash;
      }
    })();
    if (!uriHash) {
      errorMessage = "IPFS hash is not available";
    }
    src = getIpfsSrc(gateway, uriHash);
  }
  if (errorMessage) {
    return /* @__PURE__ */ React.createElement("div", null, errorMessage);
  }
  switch (token.mimeType) {
    case MediaType2.BMP:
    case MediaType2.JPEG:
    case MediaType2.PNG:
    case MediaType2.WEBP:
    case MediaType2.GIF: {
      return /* @__PURE__ */ React.createElement(ImageComponent, { src });
    }
    case MediaType2.SVG: {
      return /* @__PURE__ */ React.createElement(VectorComponent, { src, token, isPreview, viewer });
    }
    case MediaType2.X_DIRECTORY:
    case MediaType2.ZIP:
    case MediaType2.ZIP1:
    case MediaType2.ZIP2: {
      if (level !== MediaLevel.artifact) {
        return /* @__PURE__ */ React.createElement(ImageComponent, { src });
      }
      return /* @__PURE__ */ React.createElement(
        HTMLComponent,
        {
          src,
          token,
          viewer,
          isPreview,
          htmlPreviewUrl
        }
      );
    }
    case MediaType2.MP4:
    case MediaType2.OGV:
    case MediaType2.QUICKTIME:
    case MediaType2.WEBM: {
      if (level !== MediaLevel.artifact) {
        return /* @__PURE__ */ React.createElement(ImageComponent, { src });
      }
      return /* @__PURE__ */ React.createElement(VideoComponent, { src });
    }
    case MediaType2.GLB:
    case MediaType2.GLTF:
      if (level !== MediaLevel.artifact) {
        return /* @__PURE__ */ React.createElement(ImageComponent, { src });
      }
      return /* @__PURE__ */ React.createElement(GLBComponent, { src });
    case MediaType2.MP3:
    case MediaType2.OGA:
      let coverUrl = displayUriHash;
      if (level === MediaLevel.thumbnail) coverUrl = thumbnailUriHash;
      if (level !== MediaLevel.artifact) {
        return /* @__PURE__ */ React.createElement(ImageComponent, { src });
      }
      return /* @__PURE__ */ React.createElement(AudioComponent, { coverUrl, src });
    default:
      return /* @__PURE__ */ React.createElement(UnknownComponent, null);
  }
};

// src/components/header/index.tsx
import React2 from "react";

// src/components/google-login/index.tsx
import { akaSwapUser } from "@akaswap/core";
import { useEffect as useEffect4, useState as useState3 } from "react";
var GoogleLogin = (props) => {
  const buttonStyle = {
    backgroundColor: props.headerTheme?.textColor,
    color: props.headerTheme?.bgColor,
    borderColor: props.headerTheme?.buttonBorderColor
  };
  const [address, setAddress] = useState3("");
  useEffect4(() => {
    setAddress(akaSwapUser?.getWalletAddress());
  }, []);
  const handleConnect = async () => {
    akaSwapUser?.connectWallet().then(() => {
      setAddress(akaSwapUser?.getWalletAddress());
      props.onConnect?.();
    });
  };
  const handleDisconnect = async () => {
    akaSwapUser?.disconnectWallet().then(() => {
      setAddress(akaSwapUser?.getWalletAddress());
      props.onDisconnect?.();
    });
  };
  return /* @__PURE__ */ React.createElement(
    "button",
    {
      style: buttonStyle,
      className: "hover:scale-105 border py-2 px-4 rounded-lg transition-transform duration-200",
      onClick: address ? handleDisconnect : handleConnect
    },
    address ? props.disconnectLabel : props.connectLabel
  );
};

// src/components/header/desktop.tsx
import { useEffect as useEffect5, useState as useState4 } from "react";
import { akaSwapUser as akaSwapUser2 } from "@akaswap/core";
function Desktop(props) {
  const textStyle = {
    color: props.theme?.textColor
  };
  const [address, setAddress] = useState4("");
  useEffect5(() => {
    setAddress(akaSwapUser2?.getWalletAddress());
  }, []);
  return /* @__PURE__ */ React.createElement("nav", { className: "flex flex-row w-full items-center justify-between px-8" }, /* @__PURE__ */ React.createElement("a", { href: props.logoUrl }, props.logo), /* @__PURE__ */ React.createElement("ul", { className: "relative flex items-center gap-8" }, props.links && props.links.filter((link) => !link.requiresLogin || address).map((link) => /* @__PURE__ */ React.createElement("li", { key: link.name }, /* @__PURE__ */ React.createElement("a", { href: link.url, style: textStyle }, link.name))), (props.loginMethod === "google" || props.loginMethod === "both") && /* @__PURE__ */ React.createElement(
    GoogleLogin,
    {
      connectLabel: props.connectLabel ?? "Connect",
      disconnectLabel: props.disconnectLabel ?? "Disconnect",
      headerTheme: props.theme,
      onConnect: () => setAddress(akaSwapUser2?.getWalletAddress()),
      onDisconnect: () => setAddress(akaSwapUser2?.getWalletAddress())
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "text-white" }, address)));
}

// src/components/header/index.tsx
var defaultProps = {
  theme: {
    height: 60,
    bgColor: "black",
    textColor: "white",
    buttonBorderColor: "black"
  }
};
var Header = (props) => {
  props = { ...defaultProps, ...props };
  let headerStyle = {
    height: `${props.theme?.height}px`,
    backgroundColor: props.theme?.bgColor
  };
  return /* @__PURE__ */ React2.createElement("header", { style: headerStyle, className: `sticky left-0 right-0 top-0 z-50 flex` }, /* @__PURE__ */ React2.createElement(React2.Fragment, null, /* @__PURE__ */ React2.createElement(Desktop, { ...props })));
};
export {
  GoogleLogin,
  Header,
  TokenRenderer
};
