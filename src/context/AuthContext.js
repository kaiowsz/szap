import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase"


export const AuthContext = createContext()

export function AuthContextProvider({children}) {
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user)
        })

        return () => {
            unSub()
        }

    }, []);

    return (
        <AuthContext.Provider value={{currentUser}}>
            {children}
        </AuthContext.Provider>
    )
}