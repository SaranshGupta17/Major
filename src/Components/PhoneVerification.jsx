import React,{useState,useRef,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { getAuth,signOut,RecaptchaVerifier,signInWithPhoneNumber,updateProfile,linkWithCredential,EmailAuthProvider } from 'firebase/auth'
import {auth} from "../Config/firebase-config"
import OtpInput from 'react-otp-input'
import Protect  from './protect'
import { HiMiniArrowLeftStartOnRectangle } from "react-icons/hi2";


function EmailVerification() {
  const navigate = useNavigate()
  var [phoneNumber,setphoneNumber] = useState("")
  const [otp,setotp] = useState("")
  var user = ""
  
  
  
  const HandleLogout = async(e) => {
    e.preventDefault()
    
    try{
      await signOut(auth)
      navigate("/")
  } catch(err){
    console.error(err)
    }
  }
  
  const HandleSubmit = async(e) => {
    e.preventDefault()

    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
      'size': 'invisible',
    }); 
    const appVerifier = window.recaptchaVerifier;
    phoneNumber = "+91"+phoneNumber
        
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;  
      user = auth.currentUser
    }).catch((error) => {
      console.log(error)
    }); 
  }

  const Handleotp = async(e) => {
    e.preventDefault()
    try{
      const res = await confirmationResult.confirm(otp)
      console.log(res)
      console.log(user)
      const credential = EmailAuthProvider.credential(email, password);
      console.log(credential)
      await linkWithCredential(auth.currentUser, credential).then(() => {
          console.log(auth.currentUser)
      })
    }catch(err){
      if(err.code == 'auth/invalid-verification-code'){
        document.querySelector(".otpinput").classList.remove = "hidden"
        document.querySelector(".otpinput").classList.add = "text-red"
        document.querySelector(".otpinput").classList.add = "flex"
        
      }
    }   
  }

  const otpResend = async(e) => {
    e.preventDefault()
    console.log("otp resend")
  }
  const renderCustomInput = (props) => (
    <input
      {...props}
      style={{borderColor:"blue", padding: '10px', marginRight: '8px', border: '1px solid black', borderRadius: '4px', width: '32px', height: '35px', fontSize:"18px"}}
    />
  );
  
  return (
    <>
        {auth.currentUser.emailVerified == false? navigate("/EmailVerification"):null}
      
      {/* <Protect/> */}
      <div className='w-[50px] h-[50px] ml-9 mt-3 flex items-center justify-center gap-2'>
        <img className='w-full h-full object-cover rounded-[45%]' src="/images/logo1.jpg" alt="" />
        <h1>InCOM</h1>
      </div>
      
      <div className='phone w-full h-[40%] mt-8 flex flex-col justify-center items-center'>

          <h1 className='text-[30px] font-semibold my-2'>Add mobile number</h1>
          <h1 className='text-zinc-500'>To stay updated on your trades</h1>
          <h1 className='text-[14px] mt-5 mr-40'>Mobile Number</h1>

          <form onSubmit = {HandleSubmit} className='w-full flex flex-col justify-center items-center'>
            <input 
            // required 
            value={phoneNumber}
            onChange={(e)=>setphoneNumber(e.target.value)}
            type="number" 
            name="phoneNumber" 
            className='p-4 w-[280px] h-[50px] border-2 outline-none border-zinc-300 mt-1 rounded-lg focus:border-blue-500' placeholder='Enter Mobile Number'/>
            <button 
            onClick={()=>{
              document.querySelector(".phone").classList.add("hidden")
              document.querySelector(".phone").classList.remove("flex")

              document.querySelector(".otp").classList.add("flex")
              document.querySelector(".otp").classList.remove("hidden")

            }} 
            type="submit" 
            className='w-[150px] h-[40px] bg-blue-600 rounded-lg text-white mt-2'>Submit</button>
          </form>

          <form onSubmit={HandleLogout} >
            <button type="submit" className='mt-4 text-slate-500 text-[15px] flex gap-1'><HiMiniArrowLeftStartOnRectangle className='mt-1 text-[15px]'/>Back to login</button>
          </form>
      </div>
        
      {/* reCaptcha */}
      <button id ="sign-in-button" className='hidden'></button>
      
      {/* OTP FORM */}
      <form onSubmit={Handleotp} className='otp hidden w-full h-[40%] flex-col justify-center items-center mt-[20%]'>
        <h1 className='text-[30px] font-semibold'>Enter  OTP</h1>
        <OtpInput
          value={otp}
          onChange={(otp) => setotp(otp)}
          numInputs={6}
          renderInput={renderCustomInput}/>
          
          <h1 className='otpinput hidden'>Invalid OTP</h1>
          <button onClick={otpResend} className='mt-2 text-blue-800 flex gap-3'><span className='text-slate-600'>Didn't get the OTP?</span>  Resend OTP</button>
          <button type="submit" className='w-[150px] h-[40px] bg-blue-600 rounded-lg text-white mt-2'>Submit</button>
      </form>

    </>
  )
  

}



export default EmailVerification
