import { useState } from 'react'
import './Contact.css'
import Navbar from '../../components/Navbar/Navbar'
import { supabase } from '../../supabaseClient'
import Footer from '../../components/Footer/Footer'

function Contact() {

    const [input, setinput] = useState({
        name: "",
        date: "",
        readingtime: "",
        author: "",
        textarea: "",
        imageurl: "",
        category: ""
    })

    const handlechangearticle = (e) => {
        setinput((prevent) => ({
            ...prevent,
            [e.target.name]: e.target.value
        }))
    }

    const handlechangetextarea = (e) => {
        setinput((prevent) => ({
            ...prevent,
            textarea: e.target.value
        }))
    }

    const handlebutton = async () => {
        const { data, error } = await supabase
            .from('articles')
            .insert([{
                id: Date.now().toString(),
                image: input.imageurl,
                title: input.name,
                date: input.date,
                readingtime: input.readingtime,
                author: input.author,
                textarea: input.textarea,
                category: input.category
            }])
            .select()

        if (error) {
            console.log("خطا در ارسال مقاله:", error)
            return
        }

        console.log("مقاله با موفقیت ثبت شد", data)

        setinput({
            name: "",
            date: "",
            readingtime: "",
            author: "",
            textarea: "",
            imageurl: "",
            category: ""
        })
    }

    return (
        <div>
            <div className='con'>
                <Navbar title="مقاله لند" />

                <div className="contact_page">

                    <form
                        className="article_form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            handlebutton()
                        }}
                    >

                        {/* عنوان */}
                        <div className="article_title_container">
                            <h2>مقاله جدید</h2>

                            <span>
                                اطلاعات مقاله جدید را وارد کنید
                            </span>
                        </div>

                        {/* عنوان مقاله */}
                        <div className="article_input_container">
                            <label htmlFor="name">
                                عنوان مقاله
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="عنوان مقاله را وارد کنید"
                                value={input.name}
                                onChange={handlechangearticle}
                                required
                                onInvalid={(e) =>
                                    e.target.setCustomValidity("لطفا عنوان مقاله را وارد کنید")
                                }
                                onInput={(e) => e.target.setCustomValidity("")}

                            />
                        </div>

                        {/* نویسنده */}
                        <div className="article_input_container">
                            <label htmlFor="author">
                                نویسنده
                            </label>

                            <input
                                id="author"
                                name="author"
                                type="text"
                                placeholder="نام نویسنده"
                                value={input.author}
                                onChange={handlechangearticle}
                                required
                                onInvalid={(e) =>
                                    e.target.setCustomValidity("لطفاً نام خود را وارد کنید")
                                }
                                onInput={(e) => e.target.setCustomValidity("")}
                            />
                        </div>

                        {/* تاریخ */}
                        <div className="article_input_container">
                            <label htmlFor="date" >
                                تاریخ
                            </label>

                            <input
                                required
                                id="date"
                                name="date"
                                type="date"
                                placeholder="مثلاً 1405/06/10"
                                value={input.date}
                                onChange={handlechangearticle}
                            />
                        </div>

                        <div className="article_input_container">
                            <label htmlFor="category">دسته بندی</label>

                            <select
                                name="category"
                                id="category"
                                onChange={handlechangearticle}
                                value={input.category}
                                className={`input-selector${input.category}`}
                            >
                                <option value="تحلیل">تحلیل</option>
                                <option value="بررسی">بررسی</option>
                                <option value="نقد">نقد</option>
                                <option value="مقاله">مقاله</option>

                            </select>
                        </div>

                        <div className="article_input_container">
                            <label htmlFor="readingtime">
                                زمان خواندن
                            </label>

                            <input
                                id="readingtime"
                                name="readingtime"
                                type="text"
                                placeholder="مثلاً 5 دقیقه"
                                value={input.readingtime}
                                onChange={handlechangearticle}
                            />
                        </div>

                        {/* تصویر */}
                        <div className="article_input_container">
                            <label htmlFor="imageurl">
                                لینک تصویر
                            </label>

                            <input
                                id="imageurl"
                                name="imageurl"
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                value={input.imageurl}
                                onChange={handlechangearticle}
                                required
                                onInvalid={(e) =>
                                    e.target.setCustomValidity("لطفاً تصویر خود را وارد کنید")
                                }
                                onInput={(e) => e.target.setCustomValidity("")}

                            />
                        </div>

                        {/* توضیحات */}
                        <div className="article_textarea_container">
                            <label htmlFor="textarea">
                                توضیحات مقاله
                            </label>

                            <textarea
                                id="textarea"
                                name="textarea"
                                placeholder="متن مقاله را وارد کنید..."
                                value={input.textarea}
                                onChange={handlechangetextarea}
                            ></textarea>
                        </div>

                        {/* دکمه */}
                        <button
                            type="submit"
                            className="article_submit_btn"
                        >
                            ثبت مقاله
                        </button>

                    </form>

                </div>
            </div >
            <Footer />
        </div >
    )
}

export default Contact