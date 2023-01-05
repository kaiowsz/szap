import React, { useContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { ModalContext } from "../context/ModalContext";

export default function Message({message}) {

    const {currentUser} = useContext(AuthContext)
    const {data} = useContext(ChatContext)
    const {setOpenModal, setUrlImage} = useContext(ModalContext)


    const ref = useRef()

    function handleClickImage(e) {
        setOpenModal(true)
        setUrlImage(e.target.src)
    }

    useEffect(() => {
        ref.current?.scrollIntoView({behavior: "smooth"})
    }, [message])

    return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
        <div className="messageInfo">
            <img 
            src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}
            alt="" />
            <span>just now</span>
        </div>
        <div className="messageContent">
            <p>{message.text}</p>
            { message.img && <img onClick={e => handleClickImage(e)} src={message.img} alt=""></img>}
        </div>


    </div>
    )
}