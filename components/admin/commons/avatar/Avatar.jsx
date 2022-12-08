import { Figure, AvatarImg } from "./Avatar.style"

export default function Avatar({ src, alt, fill, sizes, margins }) {
  return (
    <Figure margins={margins}>
      <AvatarImg 
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
      />
    </Figure>
  )
}