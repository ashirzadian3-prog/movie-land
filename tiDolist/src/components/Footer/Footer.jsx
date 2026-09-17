import './Footer.css'

function Footer() {
    return (
        <div className='Footercontainer'>
            <div className='Footer'>
                <p>درباره ما</p>
                <span>مقاله لند جایی برای اشتراک‌گذاری نقد و تحلیل فیلم‌ها با نگاهی روشن و منتقدانه است.</span>
            </div>

            <div className='Footer'>
                <p>دسترسی سریع</p>
                <a href="">خانه</a>
                <a href="">مقالات</a>
                <a href="">درباره ما</a>
                <a href="">تماس با ما</a>
            </div>

            <div className='Footer'>
                <p>ما را دنبال کنید</p>
                <a href="">اینستاگرام</a>
                <a href="">واتساپ</a>
                <a href="">لینکدین</a>
            </div>

            <div className='Footer'>
                <p>ثبت مقاله جدید</p>
                <span>نقد یا تحلیل خودتان را بنویسید و منتشر کنید.</span>
                <button className='FooterBtn'>شروع کنید</button>
            </div>
        </div>
    )
}

export default Footer