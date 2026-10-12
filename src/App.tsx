import Contact from "./components/Contact"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"
import MobileBar from "./components/MobileBar"
import Process from "./components/Process"
import ProofStrip from "./components/ProofStrip"
import Projects from "./components/Projects"
import Services from "./components/Services"
import Team from "./components/Team"

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
        <Projects />
        <Process />
        <Team />
        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
