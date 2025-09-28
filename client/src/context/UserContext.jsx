import { useEffect, useState } from "react"
import UserContext from "./userContext"
import axios from 'axios'

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL
const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [sidePopUp, setSidePopUp] = useState(false)
    const [profilePopUp, setProfilePopUp] = useState(false)

    const getUseraData=async()=>{
        try {
            const {data}=await axios.get('/api/user/get-current-user',{withCredentials:true})
            setUser(data.user)
        } catch (error) {
            console.log("User Not Authenticated",error)
        }
    }

    useEffect(()=>{
        getUseraData()
    },[])

    const data = { user, setUser, sidePopUp, setSidePopUp, profilePopUp, setProfilePopUp }

    return (
        <UserContext.Provider value={data}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider