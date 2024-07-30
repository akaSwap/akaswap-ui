import Image from "next/image"

export default function ImageComponent({ src }: { src: string }) {
  return (
    <Image
      priority
      alt="token-image"
      src={src}
      width={0}
      height={0}
      sizes="100%"
      className="h-auto w-full"
    />
  )
}
