import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import About from "./pages/about/About"
import Articlepages from "./components/Articlepages/Articlepages"
import Contact from "./pages/Contact/Contact"
import Error404 from "./pages/Error404/Error404"
import Allarticles from "./pages/Allarticles/Allarticles"
import Loginpage from "./pages/Loginpage/Loginpage"
import ProtectedRoute from "./components/Admin/ProtectedRoute"
import AdminLayout from "./layouts/AdminLayout"
import AdminLogin from "./pages/Admin/AdminLogin"
import AdminDashboard from "./pages/Admin/AdminDashboard"
import AdminArticles, { AdminArticleEditor } from "./pages/Admin/AdminArticles"
import AdminMovies from "./pages/Admin/AdminMovies"
import AdminUsers from "./pages/Admin/AdminUsers"
import AdminComments from "./pages/Admin/AdminComments"

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
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="articles/new" element={<AdminArticleEditor />} />
            <Route path="articles/:id/edit" element={<AdminArticleEditor />} />
            <Route path="movies" element={<AdminMovies />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="comments" element={<AdminComments />} />
          </Route>
        </Route>

      </Routes>

    </div >
  )
}

export default App