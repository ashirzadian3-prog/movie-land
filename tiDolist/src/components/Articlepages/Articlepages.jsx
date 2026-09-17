import { useParams } from 'react-router-dom'
import './Articlepages.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Loading from '../Loading/Loading'
import Navbar from '../Navbar/Navbar'

function Articlepages() {
    const [article, setarticle] = useState({})
    const [loading, setloading] = useState(false)

    const params = useParams()

    useEffect(() => {
        setloading(true)
        axios.get(`http://localhost:8000/articles/${params.id}`).then((result) => {
            setarticle(result.data);
            setloading(false)
        }).catch((error) => {
            console.log(error);
            setloading(false)
        })

    }, [])

    return (
        <>
            <Navbar title="مقاله لند" />

            <div className='Articlepagescontainer'>
                {loading ? (<Loading />) : (
                    <>
                        <h1 style={{ margin: '40px' }}>{article.title}</h1>
                        <img src={article.image} alt="" />
                        <div className="articlepagespans">
                            <span>نویسنده : {article.author}</span>
                            <span > تاریخ انتشار : {article.date}</span>
                            <span>زمان مطالعه : {article.readingtime}</span>
                        </div>

                        <span style={{ color: "#4e4e4e" }} className='Articlepagescontainertext'>توضیحات : {article.textarea}</span>

                    </>
                )}

            </div>
        </>
    )
}

export default Articlepages