import React, { useContext } from "react";
import Img from "../img/img.png"
import Attach from "../img/attach.png"
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { useState } from "react";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import {v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function Input() {

    const [textType, setTextType] = useState("")
    const [img, setImg] = useState(null)


    const {currentUser} = useContext(AuthContext)
    const {data} = useContext(ChatContext)

    function handleKeyDown(e) {
        if(e.code === "Enter" || e.code === "NumpadEnter") {
            handleSend()
        }
    }

    async function handleSend() {

        const text = textType
        setTextType("")

        if(!img && !text) {
            return
        }

        if(img) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img)

            uploadTask.on(
                (error) => {
                    alert(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                   await updateDoc(doc(db, "chats", data.chatID), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: currentUser.uid,
                        date: Timestamp.now(),
                        img: downloadURL,
                    }),
                   });
                });
            }
        );
        } else {
            await updateDoc(doc(db, "chats", data.chatID), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now()
                })
            })
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatID + ".lastMessage"]: {
                text,
            },
            [data.chatID + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatID + ".lastMessage"]: {
                text,
            },
            [data.chatID + ".date"]: serverTimestamp(),
        });

        setTextType("")
        setImg(null)

    }

    return (
    <div className="input">
        <input 
        type="text" 
        placeholder="Type something..." 
        onChange={e => setTextType(e.target.value)}
        value={textType}
        onKeyDown={e => handleKeyDown(e)}/>

        <div className="send">

            <img src={Attach} alt="" />

            <input type="file" style={{display: "none"}} id="file" onChange={e => setImg(e.target.files[0])}/>

            <label htmlFor="file">
                <img src={Img} alt="" />
            </label>

            <button onClick={handleSend}>Send</button>
        </div>
    </div>
    )
}