import React, { useContext } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../Conponents/Sidebar'
import UserContext from '../context/userContext'
// import { SignIn, useUser } from '@clerk/clerk-react'


function Layout() {
  const navigate = useNavigate()
  const { sidePopUp, setSidePopUp } = useContext(UserContext)
  // const { user } = useUser()
  return(
  
  // user ?
    
    // (
    <div className='flex flex-col items-start justify-start h-screen'>
      <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
        <img src={assets.logo} className='cursor-pointer w-[100px] h-[90px]' alt="Logo" onClick={() => navigate('/')} />
        {sidePopUp ? <X onClick={() => setSidePopUp(prev=>!prev)} className='w-6 h-6 text-gray-600 sm:hidden' /> :
          <Menu onClick={() => setSidePopUp(prev => !prev)} className='w-6 h-6 text-gray-600 sm:hidden' />

        }
      </nav>
      <div className='flex w-full flex-1 h-[calc(100vh-64px)]'>
        <Sidebar />
        <div className='flex-1 bg-[#F4F7FB]'>
          <Outlet />
        </div>
      </div>


    </div>
  ) 
 
  // : (
//     <div className='flex items-center justify-center h-screen '>
//       <SignIn />
//     </div>
//   )
}

export default Layout
