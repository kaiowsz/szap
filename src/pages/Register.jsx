import React from "react"
import "./style.scss"
import AddImage from "../img/addAvatar.png"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, storage, db } from "../firebase"
import { useState } from "react"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore"
import { useNavigate, Link } from "react-router-dom"

export default function Register() {

    const [err, setErr] = useState(false)
    const [loading, setLoading] = useState(false)
    const [messageErr, setMessageErr] = useState("")
    const [fileName, setFileName] = useState("Select Image")
    const navigate = useNavigate()
    
    async function handleSubmit(e) {
        e.preventDefault()
        const displayName = e.target[0].value
        const email = e.target[1].value
        const password = e.target[2].value
        const formFile = e.target[3].files[0]
        let usersFind = []

        if(formFile === undefined) {
            return alert("Avatar is required.")
        }

        setMessageErr("")

        try {
            setLoading(true)

            const searchingUser = query(
            collection(db, "users"),
            where("displayName", "==", displayName)
            )
            const searchByUsername = await getDocs(searchingUser)

            searchByUsername.forEach(doc => {
                console.log(doc.data())
                usersFind = [...usersFind, doc.data()]
            })
            
            if(usersFind.length > 0) {
                throw new Error("Username already in use.")
            }

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
                    setLoading(false)
                    navigate("/");
                })
                }
            );

        } catch(error) {
            setLoading(false)
            setErr(true)
            setMessageErr(error.message)
            if(error.message === "Firebase: Error (auth/email-already-in-use).") {
                setMessageErr("Email already in use.")
            }
            
        }
    }
    
    return (
    <div className="formContainer">
        <div className="formWrapper">
            <span className="logo">SZap</span>
            <span className="title">Register Page</span>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Name" required/>
                <input type="email" placeholder="Email" required/>
                <input type="password" placeholder="Password (min 6 characters)" required/>

                <div className="container-file">
                    <input type="file" accept="image/*" id="file" onChange={({target: {files}}) => { setFileName(files[0].name) }} style={{ display: "none" }}/>
                    <label htmlFor="file">
                        <img src={AddImage} alt="" />
                        <span className="text-file">{fileName}</span>
                    </label>
                </div>
                <button>Sign Up</button>

                {
                    err && <span style={{ textAlign: "center" }} >{messageErr}</span>
                }

                {
                    !err && loading && <span style={{ textAlign: "center" }} >Loading...</span>
                }
            </form>

            <p>Do you have an account? <Link to="/login">Login</Link></p>

        </div>





    </div>
    )
}