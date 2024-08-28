import React,{useEffect, useState} from 'react'
import { IoEyeOff,IoEye } from "react-icons/io5";
import { Link,useNavigate } from 'react-router-dom';
import axios from '../utils/axios'
const Login = () => {

	const navigate = useNavigate() //navigates to specific route


  // Handle password hidden state
  const [open,setOpen] = useState(false)
  const flag = () => {
    setOpen(!open)
  }

  const [username,setusername] = useState("")
  const [password,setpassword] = useState("")

  const HandleSubmit = async(e) => {
    e.preventDefault()
    
    try{
    const response = await axios.post('/Login' , {username,password})
    if(response.data.redirect === "/Main"){
      navigate(response.data.redirect) 
    }
    else {
      document.querySelector(".pass").style.borderColor = "red" 
      alert("Wrong Password")
    }

  } catch(err){
    console.error(err)
    }
  }



  return (
    <>
      <div className='relative w-[80px] h-[80px] left-[40%] '>
        <img className='absolute top-[20%] w-full h-full object-cover rounded-[45%]' src="/images/logo1.jpg" alt="" />
      </div>
      <h1 className='mt-11 ml-[40%] text-[26px] font-semibold'>Log In</h1>
      <div className='overflow-hidden relative w-[70%] h-[48%] top-[8%] left-[15%]'>
        
        <form onSubmit={HandleSubmit}>

          <h1 className='text-[18px]'>Username</h1>
          <input 
            onChange={(e)=>{
              setusername(e.target.value) 
              console.log(e.target.value)
            }}
            value={username}
            className='w-[100%] h-[50px] rounded-lg py-2 px-4 bg-slate-200 border-[2px] border-slate-400 outline-none focus:border-blue-500' 
            type="username" 
            name="username"
            placeholder='Enter your User Name'/>
            
          
          <h1 className='text-[18px] mt-3'>Pasword</h1>
          <div className='relative w-full h-fit'>
            <input 
            required
            onChange={(e)=>{
              setpassword(e.target.value)
              console.log(e.target.value)
              
            }}
            value={password}
            className='pass w-[100%] h-[50px] rounded-lg py-2 px-4 bg-slate-200 border-[2px] border-slate-400 outline-none focus:border-blue-500' 
            type={(open === false)?"password":"text"} 
            name='password'
            placeholder='Password'/>

            {
                (open === false)?<IoEyeOff onClick={flag} className='absolute text-[22px] top-[26%] right-3'/>:<IoEye onClick={flag} className='absolute text-[22px] top-[26%] right-3'/>
            }
          </div>
          
          <Link className='text-blue-700 ml-[51%] font-semibold' to='/ForgotPassword'>Forgot Password?</Link>
          <button type="submit" className='w-full h-[50px] bg-blue-700 rounded-lg mt-8 text-white text-[18px]'>Log in</button>
          <h1 className='ml-4 mt-1'>Dont have an account? <Link className='text-blue-700 font-semibold'  to='/'>Sign Up</Link></h1>
        
        </form>


      </div>
    </>
  )
}

export default Login
