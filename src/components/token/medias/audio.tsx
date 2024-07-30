export default function AudioComponent({ coverUrl, src }: { coverUrl: string; src: string }) {
  return (
    <div className="relative mx-auto flex h-full w-full flex-col items-center">
      <img src={coverUrl} alt="audio" />
      <audio src={src} controls className="mt-[1rem] w-full" />
    </div>
  )
}
