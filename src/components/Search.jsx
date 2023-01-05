import React, { useContext, useState } from "react";
import { db } from "../firebase"
import { collection, query, where, getDocs, setDoc, getDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

export default function Search() {

    const [userName, setUserName] = useState("")
    const [user, setUser] = useState(null)
    const [err, setErr] = useState(false)

    const {currentUser} = useContext(AuthContext)

    async function handleSelectChat() {
        const combinedID = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid

        try {
        const res = await getDoc(doc(db, "chats", combinedID))

        if(!res.exists()) {
            await setDoc(doc(db, "chats", combinedID), {messages: []})

            await updateDoc(doc(db, "userChats", currentUser.uid), {
                [combinedID+".userInfo"]: {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                },
                [combinedID+".date"]: serverTimestamp()
            });

            await updateDoc(doc(db, "userChats", user.uid), {
                [combinedID+".userInfo"]: {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL
                },
                [combinedID+".date"]: serverTimestamp()
            })
        }


        } catch (error) {
            alert(error)
        }

        setUser(null)
        setUserName("")
    }

    async function handleSearch() {
        const q = query(
            collection(db, "users"),
            where("displayName", "==", userName)
        )

        try {
            const querySnapshot = await getDocs(q)
            querySnapshot.forEach((doc) => {
                setUser(doc.data())
            })

        } catch (error) {           
            setErr(true)
        }


    }

    function handleKeyDown(e) {
        e.code === "Enter" && handleSearch()
    }

    return (
    <div className="search">
        <div className="searchForm">
            <input type="text" 
            placeholder="Find a user" 
            onChange={e => setUserName(e.target.value)}
            onKeyDown={handleKeyDown}
            value={userName}/>
        </div>

        { err && <span>User not found.</span> }

        {user && <div className="userChat" onClick={handleSelectChat}>
            <img src={user.photoURL} alt="" />
            <div className="userChatInfo">
                <span>{user.displayName}</span>
            </div>
        </div>}
    </div>
    )
}