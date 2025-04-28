import React from 'react'
import { TiArrowBack } from "react-icons/ti";
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div className='w-full h-screen'>
      <h1 className='text-[40px] ml-10 mt-6 tracking-tighter font-bold font-mono '>Forgot Password</h1>
      <h2 className='w-[90%] h-[8%] text-center text-[17px] ml-5 text-slate-500'>Enter the email ID associated with your account.</h2>
      
      <h1 className='text-[18px] mt-6 ml-[1.1rem]'>Email</h1>
      <input 
      className='w-[90%] h-[50px] rounded-lg mt-1 ml-[1.1rem] py-2 px-4 bg-slate-200 border-[2px] border-slate-400 outline-none focus:border-blue-500' 
      type="email" 
      placeholder='abcd@abcd.com'/>
        
      <button className='w-[90%] h-[50px] ml-[1.1rem] bg-blue-700 rounded-lg mt-8 text-white text-[18px]'>Verify</button>
      <Link to='/' className='w-full flex items-center justify-center mt-4'>
        <TiArrowBack className='text-[30px]'/>
        <h1 className='text-[19px]'>Back to Login</h1>
      </Link>
      
    </div>
  )
}

export default ForgotPassword
