import './HTXT.css'
// import img from "./../../assets/joker.png"
import img from "./../../assets/9a-mHxRnfvAQK68ex2TqGI33shY-klrtG-9WTF-4M-gu4n7_Cg-removebg-preview.png"
import { Link } from 'react-router-dom'


function Herosectiontext() {

    return (
        <div className='container'>
            <div className="herosection">

                <div className="getosectiontexrigth">
                    <div className="herotextright">
                        <h1>به دنیا <em>نقد فیلم</em> خوش امدید</h1>
                        <p>بهترین نقدها، تحلیل‌ها و بررسی‌های سینمایی را از میان صدها فیلم کشف کنید و منتشر کنید.</p>
                        <div className="getosectiontexrigthbutton">
                            <Link to="/article">
                                <button id='but1'>مشاهده مقالات</button>
                            </Link>

                            <Link to="/contact">
                                <button id='but2'>ثبت مقاله</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="heroimg">
                    <img src={img} alt="" />
                </div>
            </div>

        </div>
    )
}


export default Herosectiontext
