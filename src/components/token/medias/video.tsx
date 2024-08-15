import { useEffect, useRef } from "react"

export default function VideoComponent({ src }: { src: string }) {
  const domElement = useRef(null)

  useEffect(() => {
    const isVideoPlaying = (video: HTMLVideoElement) =>
      !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2)
    const isVideoAvailable = (video: HTMLVideoElement) => video.readyState > 2

    if (
      domElement.current !== null &&
      isVideoAvailable(domElement.current) &&
      isVideoPlaying(domElement.current)
    ) {
      ;(domElement.current as HTMLVideoElement).pause()
    }
  }, [])

  return (
    <div className="align-center flex h-full w-full items-center">
      <video
        ref={domElement}
        className="mx-auto block h-auto w-full"
        autoPlay={false}
        muted
        loop
        controls={true}
        src={src}
      />
    </div>
  )
}
