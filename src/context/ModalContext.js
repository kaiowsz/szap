import { createContext, useState } from "react";

export const ModalContext = createContext()

export default function ModalContextProvider({children}) {

    const [openModal, setOpenModal] = useState(false)
    const [urlImage, setUrlImage] = useState("")

    return (
        <ModalContext.Provider value={
            {openModal,
            setOpenModal,
            urlImage,
            setUrlImage}}>
                {children}
        </ModalContext.Provider>
    )
}