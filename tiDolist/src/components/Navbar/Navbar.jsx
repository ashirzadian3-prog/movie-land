import { Link } from 'react-router-dom'
import './Navbar.css'
import img from './../../assets/preview-removebg-preview.png'
import { useState } from 'react'

function Navbar(props) {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <div className='navbar-container'>

            {/* آیتم آویزون */}
            <div className='spidey-hang'>
                <div className='spidey-strand'></div>
                <img src={img} alt="Spider-Man" />
            </div>

            <div className='container'>
                <div className='header'>
                    <h2 className='navbarh2'>{props.title}</h2>
                    <button className='menu-toggle' onClick={() => setMenuOpen(!menuOpen)} > ☰ </button>
                    <ul className={menuOpen ? 'menu-open' : ''}>
                        <Link to="/"><li><button className='button'>خانه</button></li></Link>
                        <Link to="/article"><li><button className='button'>همه مقالات</button></li></Link>
                        <Link to="/contact"><li><button className='button'>مقاله جدید</button></li></Link>
                        <Link to="/about"> <li><button className='button'>درباره ما</button></li></Link>
                    </ul>
                </div>
            </div>

        </div>
    )
}

export default Navbar