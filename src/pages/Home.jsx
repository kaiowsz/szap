import React from "react";
import Chat from "../components/Chat";
import ModalImage from "../components/ModalImage";
import Sidebar from "../components/Sidebar";
import ModalContextProvider from "../context/ModalContext";

export default function Home() {
    return (
    <ModalContextProvider>
    <div className="home">

        <div className="container">
            <Sidebar/>
            <Chat/>
            <ModalImage/>
        </div>


    </div>
    </ModalContextProvider>
    )
}