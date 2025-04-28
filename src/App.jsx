import React from 'react'
import Login from './Components/Login'
import { Outlet, Route, Routes } from 'react-router-dom'
import SignUp from './Components/SignUp'
import ForgotPassword from './Components/ForgotPassword'
import EmailVerification from './Components/EmailVerification'
import PhoneVerification from './Components/PhoneVerification'
import Main from './Components/Main'
function App() {
  return (
    <div className='w-[375px] h-[667px]'>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/SignUp' element={<SignUp/>}></Route>
        <Route path='/ForgotPassword' element={<ForgotPassword/>}></Route>
        <Route path='/EmailVerification' element={<EmailVerification/>}></Route>
        <Route path='/PhoneVerification' element={<PhoneVerification/>}></Route>
        <Route path='/Main' element={<Main/>}></Route>

      </Routes>
    </div>
  )
}



export default App
