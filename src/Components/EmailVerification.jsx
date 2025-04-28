import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import {auth} from "../Config/firebase-config"
import Protect  from './Protect'
import axios from "../utils/axios"
import { HiMiniArrowLeftStartOnRectangle } from "react-icons/hi2";

function EmailVerification() {
  
  const navigate = useNavigate()

  const HandleSubmit = async(e) => {
    e.preventDefault()
    
    try{
      await signOut(auth)
      navigate("/")
  } catch(err){
    console.error(err)
    }
  }
  useEffect(()=>{
    console.log(auth.currentUser,"login")
    auth.currentUser.emailVerified? navigate("/Main"):null
  },[])
  return (
    <>  
      <div className='w-full h-screen flex flex-col justify-center items-center my-[-20px]'>
          <h1 className='text-[30px] font-semibold '>Check Your Email</h1>
          <h1>Email Verification link sent to </h1>
          <h1>{/*auth.currentUser.email*/}aa</h1>
          <form onSubmit={HandleSubmit} className='w-full h-[50px] flex justify-center items-center'>
            <button type="submit" className=' text-slate-500 text-[15px] flex gap-1'><HiMiniArrowLeftStartOnRectangle className='mt-1 text-[15px]'/>Back to login</button>
          </form>
      </div>
    </>
  )

}



export default EmailVerification
