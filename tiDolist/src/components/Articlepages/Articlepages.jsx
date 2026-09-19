import { useParams } from 'react-router-dom'
import './Articlepages.css'
import { useEffect, useState } from 'react'
import Loading from '../Loading/Loading'
import Navbar from '../Navbar/Navbar'
import { supabase } from '../../supabaseClient'

function Articlepages() {
    const [article, setarticle] = useState({})
    const [loading, setloading] = useState(false)

    const params = useParams()

    useEffect(() => {
        setloading(true)

        supabase
            .from('articles')
            .select('*')
            .eq('id', params.id)
            .single()
            .then(({ data, error }) => {
                if (error) {
                    console.error('Supabase Error:', error)
                    return
                }

                setarticle(data)
            })
            .finally(() => {
                setloading(false)
            })

    }, [params.id])

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
                            <span>تاریخ انتشار : {article.date}</span>
                            <span>زمان مطالعه : {article.readingtime}</span>
                        </div>

                        <span style={{ color: "#4e4e4e" }} className='Articlepagescontainertext'>
                            توضیحات : {article.textarea}
                        </span>
                    </>
                )}
            </div>
        </>
    )
}

export default Articlepages