import Header from "./components/Header"
import Hero from "./components/Hero"
import ProofStrip from "./components/ProofStrip"
import Services from "./components/Services"

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <ProofStrip />
        <Services />
      </main>
    </>
  )
}
