import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashbord from './pages/Dashbord'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import GeneratImages from './pages/GeneratImages'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'

import { Toaster } from 'react-hot-toast'
import { useContext } from 'react'
import UserContext from './context/userContext'



function App() {
  const { user } = useContext(UserContext)
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={user ?<Layout />:<Navigate to='/' />}>
          <Route index element={user ? <Dashbord /> : <Navigate to='/' />} />
          <Route path='write-article' element={<WriteArticle />} />
          <Route path='blog-titles' element={<BlogTitles />} />
          <Route path='generate-images' element={<GeneratImages />} />
          <Route path='remove-background' element={<RemoveBackground />} />
          <Route path='remove-object' element={<RemoveObject />} />
          <Route path='review-resume' element={<ReviewResume />} />
          <Route path='community' element={<Community />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App
