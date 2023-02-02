import React, { useState } from "react"
import "./style.scss"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"
import { auth } from "../firebase"

export default function Login() {

    const [err, setErr] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
    
    async function handleSubmit(e) {
        e.preventDefault()

        const email = e.target[0].value
        const password = e.target[1].value

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/")
        } catch(err) {
            setErr(true)
            setErrorMessage(err.message.replace("Firebase: ", ""))
        }
    }


    return (
    <div className="formContainer">
        
        <div className="formWrapper">
            <span className="logo">SZap</span>
            <span className="title">Login Page</span>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" required/>
                <input type="password" placeholder="Password" required/>
                <button>Sign In</button>
                {err && <span>{errorMessage}</span>}
            </form>

            
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            

        </div>
    </div>
    )
}