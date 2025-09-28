import React, {useEffect, useState } from 'react'
import { Gem, Sparkle } from 'lucide-react'
import CreationItem from '../Conponents/CreationItem'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function Dashbord() {
  const [creation, setCreation] = useState([])
  const [loading, setLoading] = useState(true)

  const getDashboardData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/user/get-user-creations', {withCredentials:true})

      if (data.success) {
        setCreation(data.creations)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }


  useEffect(() => {
    getDashboardData()
  }, [])

  return (
    <div className='h-full overflow-y-scroll p-6'>
      <div className='flex justify-start gap-4 flex-wrap'>
        {/* Total Creation Card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Total Creation</p>
            <h2 className='text-lg font-semibold'>{creation.length}</h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] t0-[#0BB0D7] text-white flex justify-center items-center'>
            <Sparkle className='w-5 text-white' />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className='flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200'>
          <div className='text-slate-600'>
            <p className='text-sm'>Active Plan</p>
            <h2 className='text-lg font-semibold'>
              free
            </h2>
          </div>
          <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] t0-[#9E53EE] text-white flex justify-center items-center'>
            <Gem className='w-5 text-white' />
          </div>
        </div>

      </div>
      {!loading ? (<div className='space-y-3'>
        <p className='mt-6 mb-4'>Recent Creation</p>

        {
          creation.map((item) => <CreationItem key={item.id} item={item} />)
        }
      </div>) : (
          <div className='flex justify-center items-center h-3/4'>
            <span className='w-10 h-10 my-1 rounded-full border-3 border-primary border-t-transparent animate-spin'></span>
          </div>
      ) }
    

    </div>
  )
}

export default Dashbord
