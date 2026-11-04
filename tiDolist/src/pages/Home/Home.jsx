import { useEffect, useState } from "react";
import Article from "../../components/Article/Article";
import Navbar from "../../components/Navbar/Navbar";
import './Home.css'
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import HTXT from "../../components/herosectiontext/HTXT";
import { supabase } from '../../supabaseClient'


function Home() {
    const [articles, setarticles] = useState([])
    const [featuredMedia, setFeaturedMedia] = useState([])
    const [loading, setloading] = useState(false)

    useEffect(() => {
        supabase
            .from('featured_media')
            .select('*')
            .order('position', { ascending: true })
            .then(({ data, error }) => {
                if (error) {
                    console.error('Featured media error:', error)
                    return
                }
                setFeaturedMedia(data || [])
            })

        setloading(true)

        supabase
            .from('articles')
            .select('*')
            .eq('status', 'published')
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
            <Navbar title="MovieLand" />

            <HTXT />

            <div className="container">
                {featuredMedia.length > 0 && (
                    <section className="home-featured-media">
                        <div className="home-featured-heading">
                            <div>
                                <span>CURATED FOR YOU</span>
                                <h2>منتخب مووی لند</h2>
                            </div>
                            <p>آثاری که ارزش تماشا دارند</p>
                        </div>
                        <div className="home-featured-grid">
                            {featuredMedia.map((item) => (
                                <a
                                    className="home-featured-item"
                                    key={item.id}
                                    href={`https://www.themoviedb.org/${item.media_type === 'tv' ? 'tv' : 'movie'}/${item.tmdb_id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    {item.poster_path ? (
                                        <img src={`https://image.tmdb.org/t/p/w342${item.poster_path}`} alt={item.title} loading="lazy" />
                                    ) : <div className="home-featured-no-poster">MOVIE LAND</div>}
                                    <div className="home-featured-overlay">
                                        <span>{item.media_type === 'tv' ? 'سریال' : 'فیلم'} · ★ {Number(item.vote_average || 0).toFixed(1)}</span>
                                        <strong>{item.title}</strong>
                                        <small>مشاهده جزئیات ↗</small>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                )}
                <div className="hometextcontainer">
                    <h2 className="homeh2">مقالات جدید</h2>
                    <Link to="/about">
                        <p className="homep">درباره ما</p>
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