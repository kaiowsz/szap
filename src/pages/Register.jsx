import React from "react"
import "./style.scss"
import AddImage from "../img/addAvatar.png"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, storage, db } from "../firebase"
import { useState } from "react"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { doc, setDoc } from "firebase/firestore"
import { useNavigate, Link } from "react-router-dom"

export default function Register() {

    const [err, setErr] = useState(false)
    const navigate = useNavigate()
    
    async function handleSubmit(e) {
        e.preventDefault()
        const displayName = e.target[0].value
        const email = e.target[1].value
        const password = e.target[2].value
        const formFile = e.target[3].files[0]

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)

            const storageRef = ref(storage, displayName);
            
            const uploadTask = uploadBytesResumable(storageRef, formFile)

            uploadTask.on(
                (error) => {
                setErr(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    await updateProfile(res.user, {
                        displayName,
                        photoURL: downloadURL
                    })
        
                    await setDoc(doc(db, "users", res.user.uid), {
                        uid: res.user.uid,
                        displayName,
                        email,
                        photoURL: downloadURL
                    });

                    await setDoc(doc(db, "userChats", res.user.uid), {});
                    navigate("/");
                })
                }
            );

        } catch(error) {
            setErr(true)
        }
    }
    
    return (
    <div className="formContainer">
        <div className="formWrapper">
            <span className="logo">kaiowsz ChatApp</span>
            <span className="title">Register Page</span>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" required/>
                <input type="email" placeholder="Email" required/>
                <input type="password" placeholder="Password (min 6 characters)" required/>
                <input style={{display: "none"}} type="file" id="file"/>
                <label htmlFor="file">
                    <img src={AddImage} alt="" />
                    <span>Add an avatar</span>
                </label>
                <button>Sign Up</button>

                {
                    err && <span>Something went wrong. Try again.</span>
                }
            </form>

            <p>Do you have an account? <Link to="/login">Login</Link></p>

        </div>





    </div>
    )
}