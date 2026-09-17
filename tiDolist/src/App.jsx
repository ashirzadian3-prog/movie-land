import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import About from "./pages/about/About"
import Articlepages from "./components/Articlepages/Articlepages"
import Contact from "./pages/Contact/Contact"
import Error404 from "./pages/Error404/Error404"
import Allarticles from "./pages/Allarticles/Allarticles"

function App() {
  return (
    <div className="con">

      <Routes>
        <Route path="/*" element={<Error404 />} />
        <Route path="/" element={<Home />} />
        <Route path="/article" element={<Allarticles />} />
        <Route path="/about" element={<About />} />
        <Route path="/Articlepage/:id" element={<Articlepages />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

    </div >
  )
}

export default App