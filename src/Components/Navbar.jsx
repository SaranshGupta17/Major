import React from 'react'
import { HiOutlineBellAlert } from "react-icons/hi2";
import { FaRegBell } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className='md:w-full h-[10%] bg-white flex justify-end items-center overflow-hidden md:px-4 md:shadow-md'>


      <div className='md:w-[8%] h-full flex justify-center items-center'>
    
        <HiOutlineBellAlert className='text-[30px] m-auto'/>
        <img className='md:w-[50px] md:h-[50px]' src="/images/pp.jpeg" alt="" />
      </div>
    
    </div>
  )
}

export default Navbar
