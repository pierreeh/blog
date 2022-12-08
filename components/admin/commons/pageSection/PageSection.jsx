import { Section } from "./PageSection.style"

export default function PageSection({ children, isSticky }) {
  return (
    <Section isSticky={isSticky}>{children}</Section>
  )
}