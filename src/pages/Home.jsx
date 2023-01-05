import React from "react";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";

export default function Home() {
    return (
    <div className="home">

        <div className="container">
            <Sidebar/>
            <Chat/>
        </div>


    </div>
    )
}