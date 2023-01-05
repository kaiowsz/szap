import { doc, onSnapshot } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message"


export default function Messages() {
    const [messages, setMessages] = useState([])
    const {data} = useContext(ChatContext)

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", data.chatID), (doc) => {
            doc.exists() && setMessages(doc.data().messages)
        })

        return () => { unSub() }
    }, [data.chatID])

    return (
    <div className="messages">

        {messages.map(message => (
          <Message message={message} key={message.id}/>  
        ))}
    </div>
    )
}