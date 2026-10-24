import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import About from "./pages/about/About"
import Articlepages from "./components/Articlepages/Articlepages"
import Contact from "./pages/Contact/Contact"
import Error404 from "./pages/Error404/Error404"
import Allarticles from "./pages/Allarticles/Allarticles"
import Loginpage from "./pages/Loginpage/Loginpage"
import AdminLogin from "./pages/Admin/AdminLogin"
import AdminLayout from "./pages/Admin/AdminLayout"
import Dashboard from "./pages/Admin/Dashboard"
import ArticlesAdmin from "./pages/Admin/ArticlesAdmin"
import ArticleForm from "./pages/Admin/ArticleForm"

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
        <Route path="/Loginpage" element={<Loginpage />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="articles" element={<ArticlesAdmin />} />
          <Route path="articles/new" element={<ArticleForm />} />
          <Route path="articles/:id" element={<ArticleForm />} />
        </Route>

      </Routes>

    </div >
  )
}

export default App