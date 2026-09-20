import { useEffect, useState } from "react";
import Article from "../../components/Article/Article";
import Navbar from "../../components/Navbar/Navbar";
import './Home.css'
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import HTXT from "../../components/herosectiontext/HTXT";
import { supabase } from '../../supabaseClient'


function Home() {
    const [articles, setarticles] = useState([])
    const [loading, setloading] = useState(false)

    useEffect(() => {
        setloading(true)

        supabase
            .from('articles')
            .select('*')
            .then(({ data, error }) => {
                if (error) {
                    console.error('Supabase Error:', error)
                    return
                }

                setarticles(data)
            })
            .finally(() => {
                setloading(false)
            })
    }, [])


    return (


        <div className="homeContaienr">
            <Navbar title="مقاله لند" />

            <HTXT />

            <div className="container">
                <div className="hometextcontainer">
                    <h2 className="homeh2">مقالات جدید</h2>
                    <Link to="/about">
                        <p className="homep">درباره ما<HiOutlineArrowNarrowLeft /></p>
                    </Link>
                </div>
                {loading ? (<Loading />) : (
                    <div className="articlewrappwe">
                        {
                            articles.map(article =>
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

export default Home