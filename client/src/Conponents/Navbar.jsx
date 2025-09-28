import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import UserContext from '../context/userContext'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

function Navbar() {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [popSign, setPopSign] = useState(false)
  const [PopLogin, setPoplogin] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [L_email, setL_Email] = useState("")
  const [L_password, setL_Password] = useState("")
  const [loading, setLoading] = useState(false)


  const SignUpHandle = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await axios.post('/api/user-auth/signup', { name, email, password }, { withCredentials: true })
      setUser(data.user)
      navigate('/ai')
      setName("")
      setEmail("")
      setPassword("")
      console.log(data)

      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const LogInHandle = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const { data } = await axios.post('/api/user-auth/login', { email: L_email, password: L_password }, { withCredentials: true })
      console.log("done")
      console.log(data)
      setUser(data.user)
      navigate('/ai')
      setL_Email("")
      setL_Password("")
      console.log(data)

      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <>
      {/* Navbar */}
      <div className='fixed z-10 w-full backdrop-blur-2xl flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32 '>
        <img
          src={assets.logo}
          alt="Logo"
          className='w-32 sm:w-44 cursor-pointer'
          onClick={() => navigate('/')}
        />
        {user ? (<div className='h-[50px] w-[50px] rounded-full border-1 overflow-hidden cursor-pointer bg-gray-600'>
          <img src={user.profileImg||assets.profile} alt="profile" className='bg-cover w-full h-full overflow-hidden' />
        </div>) : (<button
          className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-10 py-2.5'
          onClick={(e) => {
            e.preventDefault()
            setPopSign(true)
          }}
        >
          Get Started <ArrowRight className='w-4 h-4' />
        </button>)}

      </div>

      {/* Popup Modal */}
      {popSign && (
        <div className='fixed inset-0 flex items-center justify-center backdrop-blur-2xl bg-black/50 z-20'>
          <div className='bg-gradient-to-br from-[#e0d1b3] to-[#dab0de] rounded-2xl shadow-lg w-[350px] p-6 relative'>
            {/* Close button */}
            <button
              className='absolute top-3 right-3 text-gray-600 hover:text-black cursor-pointer'
              onClick={() => setPopSign(false)}
            >
              <X className='w-5 h-5' />
            </button>

            <h2 className='text-xl font-bold mb-4 text-center'>Sign Up</h2>

            <form className='flex flex-col r justify-center gap-5'
              onSubmit={SignUpHandle}>
              <div className='flex flex-col gap-2'>
                <label htmlFor="">Name :</label>
                <input
                  type="text"
                  required
                  name='name'
                  value={name}
                  onChange={(e) => { setName(e.target.value) }}
                  placeholder="Full Name"
                  className='border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor="">Email :</label>

                <input
                  type="text"
                  required
                  name='email'
                  value={email}
                  onChange={(e) => { setEmail(e.target.value) }}
                  placeholder="Email"
                  className='border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor="">Password :</label>
                <input
                  type="text"
                  required
                  name='password'
                  value={password}
                  onChange={(e) => { setPassword(e.target.value) }}
                  placeholder="Password"
                  className='border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className='bg-primary text-white cursor-pointer py-2 rounded-lg mt-2 ml-19 hover:bg-primary/90 transition w-[150px]'
              >
                {loading ? <span className='w-5 h-5 rounded-full border-2 border-t-transparent animate-spin'></span> : 'Create Account'}

              </button>
              <p>  Already have an account ? <span className='font-semibold underline cursor-pointer' onClick={(e) => {
                e.preventDefault()
                setPopSign(false)
                setPoplogin(true)
              }}>Sign In</span></p>
            </form>
          </div>
        </div>
      )}


      {PopLogin && (
        <div className='fixed inset-0 flex items-center justify-center backdrop-blur-2xl bg-black/50 z-20'>
          <div className='bg-gradient-to-br from-[#e0d1b3] to-[#dab0de] rounded-2xl shadow-lg w-[350px] p-6 relative'>
            {/* Close button */}
            <button
              className='absolute top-3 right-3 text-gray-600 hover:text-black cursor-pointer'
              onClick={() => setPoplogin(false)}
            >
              <X className='w-5 h-5' />
            </button>

            <h2 className='text-xl font-bold mb-4 text-center'>Sign In</h2>

            <form className='flex flex-col r justify-center gap-5'
              onSubmit={LogInHandle}>
              <div className='flex flex-col gap-2'>
                <label htmlFor="">Email :</label>

                <input
                  type="text"
                  required
                  name='email'
                  value={L_email}
                  onChange={(e) => { setL_Email(e.target.value) }}
                  placeholder="Email"
                  className='border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label htmlFor="">Password :</label>
                <input
                  type="text"
                  required
                  name='password'
                  value={L_password}
                  onChange={(e) => { setL_Password(e.target.value) }}
                  placeholder="Password"
                  className='border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
              </div>

              <button
                type="submit"
                className='bg-primary text-white cursor-pointer py-2 rounded-lg mt-2 ml-19 hover:bg-primary/90 transition w-[150px]'
              >
                {loading ? 'Loading...': 'Log In'}
              </button>
              <p>  Haven't any account ? <span className='font-semibold underline cursor-pointer' onClick={(e) => {
                e.preventDefault()
                setPopSign(true)
                setPoplogin(false)
              }}>Sign Up</span></p>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
