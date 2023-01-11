import Header from "components/header/Header"

export default function Layout({ children, categories }) {
  return (
    <>
      <Header categories={categories} />
      <main>{children}</main>
    </>
  )
} 