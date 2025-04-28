import React from 'react'
import { Link } from 'react-router-dom'
import {auth} from "../Config/firebase-config"
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'

import { BsGraphUpArrow } from "react-icons/bs";
import { IoSpeedometerOutline } from "react-icons/io5";
import { RiStackLine } from "react-icons/ri";
import { BiSupport } from "react-icons/bi";
import { TbSettings } from "react-icons/tb";



const Sidebar = () => {

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

  return (
    <div className='md:w-[20%] md:h-full border-2 md:shadow-xl px-3'>
      
      <div className='md:w-[125px] h-[10%] md:flex md:gap-2 md:justify-between md:items-center'>
        <img className='md:w-[55px] md:h-[55px] object-cover rounded-[50%]' src="/images/logo1.jpg" alt="" />
        <div className=' text-[25px] text-blue-500 font-semibold'>INCOM </div>
      </div>

      <div className='w-full h-[90%] flex flex-col mt-4'>
        <Link className='p-4 hover:bg-slate-200 hover:text-blue-600 font-semibold rounded-lg duration-100 flex gap-3 items-center' to=''><BsGraphUpArrow className='text-[20px]'/>Dashboard</Link>
        <Link className='p-4 hover:bg-slate-200 hover:text-blue-600 font-semibold rounded-lg duration-100 flex gap-3 items-center' to=''><IoSpeedometerOutline className='text-[20px]'/>Performance</Link>
        <Link className='p-4 hover:bg-slate-200 hover:text-blue-600 font-semibold rounded-lg duration-100 flex gap-3 items-center' to=''><RiStackLine className='text-[20px]'/>Storage</Link>
        <Link className='p-4 hover:bg-slate-200 hover:text-blue-600 font-semibold rounded-lg duration-100 flex gap-3 items-center' to=''><BiSupport className='text-[20px]'/>Support</Link>
        <Link className='p-4 hover:bg-slate-200 hover:text-blue-600 font-semibold rounded-lg duration-100 flex gap-3 items-center' to=''><TbSettings className='text-[20px]'/>Settings</Link>
        <form onSubmit={HandleSubmit} >
          <button type="submit" className='w-[80px] h-[35px] bg-blue-700 rounded-lg mt-8 text-white text-[15px]'>Logout</button>
        </form>
      </div>
      
    
    </div>
  )
}

export default Sidebar
