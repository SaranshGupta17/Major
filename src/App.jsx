import React from 'react'
import Login from './Components/Login'
import { Route, Routes } from 'react-router-dom'
import SignUp from './Components/SignUp'
import ForgotPassword from './Components/ForgotPassword'
import Main from './Components/Main'
function App() {
  return (
    <div className='w-[375px] h-[667px]'>
      <Routes>
        <Route path='/' element={<SignUp/>}></Route>
        <Route path='/Login' element={<Login/>}></Route>
        <Route path='/ForgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/Main' element={<Main/>}></Route>
      </Routes>
    </div>
  )
}



export default App
