import Image from "next/image"

export default function Images({ attributes, children, element }) {
  return (
    <figure contentEditable={false} {...attributes}>
      <Image 
        src={String(element.url)}
        alt={element.caption}
        height={700}
        width={1200}
      />
      <figcaption>{element.caption}</figcaption>
      {children}
    </figure>
  )
}