import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import './Allarticles.css'
import axios from 'axios';
import Loading from '../../components/Loading/Loading';
import Article from '../../components/Article/Article';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer/Footer';

function Allarticles() {
    const [category, setcategory] = useState('همه')
    const [articles, setarticles] = useState([])
    const [loading, setloading] = useState(false)

    console.log(articles);

    useEffect(() => {
        setloading(true)
        axios.get("http://localhost:8000/articles").then((result) => {
            setarticles(result.data);
            setloading(false)
        })
            .catch((error) => {
                console.log(error);
                setloading(false)
            })
    }, [])

    const categoryfilter = articles.filter((article) => {
        if (category === 'همه') {
            return true
        }
        return article.category === category
    })
    return (
        <div className='Allarticlescontainer'>
            <Navbar title="مقاله لند" />
            <div className='container'>
                <div className='Allarticlestext'>
                    <h2>همه مقالات</h2>
                    <p>نقد، تحلیل و بررسی فیلم‌های سینمایی از نویسندگان مقاله لند.</p>
                    <div className='categorybuttons'>
                        <button id="bottone5" onClick={() => { setcategory('همه') }}>همه</button>
                        <button id="bottone5" onClick={() => { setcategory('تحقیق') }}>تحقیق</button>
                        <button id="bottone5" onClick={() => { setcategory('بررسی') }}>بررسی</button>
                        <button id="bottone5" onClick={() => { setcategory('نقد') }}>نقد</button>
                        <button id="bottone5" onClick={() => { setcategory('مقاله') }}>مقاله</button>
                    </div>

                </div>
                {loading ? (<Loading />) : (
                    <div className="articlewrappwe">
                        {
                            categoryfilter.map(article =>
                                <Link to={`/Articlepage/${article.id}`} key={article.id}>
                                    <Article article={article} />
                                </Link>
                            )
                        }
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default Allarticles