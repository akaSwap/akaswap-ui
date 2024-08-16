import { useEffect, useRef, useState } from "react"

export default function GLBComponent({ src }: { src: string }) {
  const ref = useRef(null)
  const [width, setWidth] = useState("100px")
  const [height, setHeight] = useState("100px")

  const props = {
    src,
    autoplay: true,
    "auto-rotate": true,
    "data-js-focus-visible": true,
    "camera-controls": true
  }

  const handleResize = () => {
    if (ref.current === null) return
    const { width, height } = (ref.current as HTMLElement).getBoundingClientRect()
    setWidth(width.toString())
    setHeight(height.toString())
  }

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [width, height])

  return (
    <div className="relative mx-auto flex h-full w-full items-center justify-center" ref={ref}>
      <model-viewer
        {...props}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <button slot="ar-button" className="">
          AR
        </button>
      </model-viewer>
    </div>
  )
}
