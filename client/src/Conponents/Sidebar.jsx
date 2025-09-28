import React, { useContext, useRef, useState, } from 'react'

import { assets } from '../assets/assets'
import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users, X } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import UserContext from '../context/userContext'
import toast from 'react-hot-toast'


const navItems = [
    { to: '/ai', label: 'Dashboard', Icon: House },
    { to: '/ai/write-article', label: 'Write-Article', Icon: SquarePen },
    { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
    { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
    { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
    { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
    { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
    { to: '/ai/community', label: 'Community', Icon: Users },
]
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function Sidebar() {
    const { user, setUser, sidePopUp, setSidePopUp, profilePopUp, setProfilePopUp } = useContext(UserContext)
    const navigate = useNavigate()
    const profileImg = useRef()
    const [frontendProfileImg, setFrontendProfileImg] = useState(user.profileImg || assets.profile)
    const [backendProfileImg, setBackendProfileImg] = useState(null)

    const signOut = async (e) => {
        e.preventDefault()
        try {
            const { data } = await axios.post('/api/user-auth/logout', {}, { withCredentials: true })
            setUser(null)
            navigate('/')
            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const handleImg = (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        setBackendProfileImg(file)
        setFrontendProfileImg(URL.createObjectURL(file))
    }

    const updateProfileImage = async (e) => {
        e.preventDefault()
        try {
            let formdata = new FormData()
            if (backendProfileImg) {
                formdata.append("image", backendProfileImg)
            }
            const { data } = await axios.post('/api/user/update-profile', formdata, { withCredentials: true })
            setUser(data.user)

            if (data.success) {
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    return (<>
        <div className={`w-60 bg-white border-r border-gray-200 md:flex flex-col justify-between items-center max-sm:absolute md:top-14 right-0 md:translate-0 md:bottom-0 ${sidePopUp ? '' : 'hidden'} transition-all duration-300 ease-in-out`}>
            <div className='my-7 w-full'>
                <img src={frontendProfileImg} alt="" className='w-10 h-10 rounded-full mx-auto' />
                <h1 className='mt-1 text-center'>{user.name}</h1>
                <div className='px-6 mt-5 text-sm text-gray-600 font-medium'>
                    {navItems.map(({ to, label, Icon }) =>
                    (
                        <NavLink key={to} to={to} end={to === '/ai'} onClick={() => setSidePopUp((prev) => !prev)} className={({ isActive }) => `px-3.5 py-2.5 flex items-center gap-3 rounded ${isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white ' : ''}`}>
                            {(isActive) => (
                                <>
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ' '}`} />
                                    {label}
                                </>
                            )}
                        </NavLink>
                    )
                    )
                    }
                </div>
            </div>
            <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
                <div className='flex gap-2 items-center cursor-pointer' onClick={() => setProfilePopUp((prev) => !prev)}>
                    <img src={frontendProfileImg} className='w-8 h-8 rounded-full' alt="" />
                    <div>
                        <h1 className='text-sm font-meduim' >{user.name}</h1>
                        <p className='text-xs text-gray-500'>
                            Free
                        </p>
                    </div>
                </div>
                <LogOut onClick={signOut} className='w-4 text-gray-400 hover:text-gray-700 transition cursor-pointer' />
            </div>

        </div>

        {
            profilePopUp && <div className='fixed inset-0 w-full h-full flex justify-center items-center top-0 bg-black/50 z-20'>
                <div className='w-[90%] md:w-[60%] lg:w-[20%] h-[50%] relative flex flex-col items-center rounded-lg bg-gradient-to-br from-[#e0d1b3] to-[#dab0de]  bg-white p-8 gap-5 '>
                    <img src={frontendProfileImg} onClick={() => profileImg.current.click()} className='w-30 h-30 rounded-full cursor-pointer' alt="" />
                    <input type="file" hidden ref={profileImg} onChange={handleImg} />
                    <h1 className='text-2xl'>{user.name}</h1>
                    <h1 className=''>{user.email}</h1>
                    <button
                        className='absolute top-3 right-3 text-gray-600 hover:text-black cursor-pointer'
                        onClick={() => setProfilePopUp((prev) => !prev)}
                    >
                        <X className='w-5 h-5' />
                    </button>
                    <button className='bg-primary text-white cursor-pointer px-8 font-semibold py-3 rounded-lg' onClick={updateProfileImage}>Update</button>
                </div>
            </div>
        }
    </>
    )
}

export default Sidebar
