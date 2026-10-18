import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import './Loginpage.css'
import Navbar from "../../components/Navbar/Navbar"
import SpiderIntro from "../../components/SpiderIntro/SpiderIntro"

function generateCode() {
    return String(Math.floor(10000 + Math.random() * 90000))
}

function Loginpage() {
    const navigate = useNavigate()
    const cardRef = useRef(null)
    const [mode, setMode] = useState("login")
    const [captcha, setCaptcha] = useState(generateCode)
    const [inputCode, setInputCode] = useState("")
    const [message, setMessage] = useState("")

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: ""
    })

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    function changeMode(newMode) {
        setMode(newMode)
        setCaptcha(generateCode())
        setInputCode("")
        setMessage("")
    }

    function refreshCaptcha() {
        setCaptcha(generateCode())
        setInputCode("")
        setMessage("")
    }

    function handleSubmit(e) {
        e.preventDefault()

        if (inputCode !== captcha) {
            setMessage("کد واردشده صحیح نیست.")
            setCaptcha(generateCode())
            setInputCode("")
            return
        }

        setMessage(
            mode === "login"
                ? "کد صحیح است! ورود آزمایشی انجام شد."
                : "اطلاعات با موفقیت بررسی شد!"
        )

        navigate("/")
    }

    return (
        <>
            <Navbar title="MovieLand" hideSpider />

            <div className="loginpage" style={{ position: "relative" }}>
                <main className="auth-page">
                    {/* <div className="auth-background">
                        <span className="movie-orb orb-one"></span>
                        <span className="movie-orb orb-two"></span>
                        <span className="movie-orb orb-three"></span>
                    </div> */}

                    <section className="auth-card" ref={cardRef}>
                        <a href="/" className="auth-logo">
                            MOVIE<span>LAND</span>
                        </a>

                        <p className="auth-subtitle">
                            دنیای فیلم‌ها، فقط یک قدم با تو فاصله دارد
                        </p>

                        <div className="auth-tabs">
                            <button
                                type="button"
                                className={mode === "login" ? "active" : ""}
                                onClick={() => changeMode("login")}
                            >
                                ورود
                            </button>

                            <button
                                type="button"
                                className={mode === "register" ? "active" : ""}
                                onClick={() => changeMode("register")}
                            >
                                ثبت‌نام
                            </button>
                        </div>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <h1>
                                {mode === "login"
                                    ? "خوش برگشتی!"
                                    : "به مووی لند بپیوند"}
                            </h1>

                            <p className="auth-description">
                                {mode === "login"
                                    ? "شماره موبایلت را وارد کن و ادامه بده."
                                    : "اطلاعاتت را وارد کن و حساب کاربری بساز."}
                            </p>

                            {mode === "register" && (
                                <>
                                    <label htmlFor="name">نام و نام خانوادگی</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="نام و نام خانوادگی"
                                        value={form.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                        required
                                    />

                                    <label htmlFor="email">ایمیل</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        required
                                    />
                                </>
                            )}

                            <label htmlFor="phone">شماره موبایل</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                inputMode="numeric"
                                placeholder="09xxxxxxxxx"
                                value={form.phone}
                                onChange={handleChange}
                                autoComplete="tel"
                                pattern="09[0-9]{9}"
                                title="شماره موبایل باید با 09 شروع شود و 11 رقم باشد."
                                required
                            />

                            <label htmlFor="captcha">کد تأیید پنج‌رقمی</label>

                            <div className="captcha-display">
                                <span className="captcha-number">{captcha}</span>
                                <button
                                    type="button"
                                    className="captcha-refresh"
                                    onClick={refreshCaptcha}
                                    aria-label="تولید کد جدید"
                                    title="تغییر کد"
                                >
                                    ↻
                                </button>
                            </div>

                            <input
                                id="captcha"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]{5}"
                                maxLength={5}
                                placeholder="کد بالا را وارد کن"
                                value={inputCode}
                                onChange={(e) => {
                                    setInputCode(e.target.value)
                                    setMessage("")
                                }}
                                required
                            />

                            {message && (
                                <p
                                    className={
                                        message.includes("صحیح نیست")
                                            ? "auth-message error"
                                            : "auth-message success"
                                    }
                                    role="status"
                                >
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="auth-submit"
                            >
                                {mode === "login"
                                    ? "ورود به حساب"
                                    : "ساخت حساب کاربری"}
                            </button>
                        </form>

                        <p className="auth-footer">
                            با <span>Movie Land</span>، فیلم بعدی موردعلاقه‌ات را پیدا کن.
                        </p>
                    </section>
                </main>

                {/* عنکبوت: از تار گوشه صفحه شروع می‌کند و روی کارت می‌نشیند */}
                <SpiderIntro cardRef={cardRef} />
            </div>
        </>
    )
}

export default Loginpage