import './Article.css'

function Article(props) {
    return (

        <div className="articleContaienr">

            <img
                src={props.article.image}
                alt={props.article.title}
            />

            <div className="articleContent">
                <span className={`category ${props.article.category}`}>{props.article.category}</span>

                <h3>{props.article.title}</h3>

                <p>زمان مطالعه: {props.article.readingtime}</p>

                <p>تاریخ انتشار: {props.article.date}</p>

                <p>نویسنده: {props.article.author}</p>

            </div>

        </div>

    )
}

export default Article