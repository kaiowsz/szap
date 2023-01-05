import React, { useContext } from "react";
import { ModalContext } from "../context/ModalContext";

export default function ModalImage() {

    const {openModal, setOpenModal, urlImage} = useContext(ModalContext)

    return (
        <div className={`${openModal ? "open" : ""} modalImage`}>

        <div className="containerModal">
            <button onClick={e => setOpenModal(false)}>X</button>
            { urlImage && <img src={urlImage} alt="random"></img>}
        </div>

        </div>
    )
}