import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'


function Main() {

  const navigate = useNavigate()

  const HandleSubmit = async(e) => {
    e.preventDefault()
    
    try{
    const response = await axios.post('/logout')
    navigate(response.data)

  } catch(err){
    console.error(err)
    }
  }

  return (
    <div>
        <form onSubmit={HandleSubmit} >
          <button type="submit" className='w-full h-[50px] bg-blue-700 rounded-lg mt-8 text-white text-[18px]'>Logout</button>
        </form>
    </div>
  )
}

export default Main
