import React,{useState} from 'react'
import { IoEyeOff,IoEye } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axios'

const SignUp = () => {
	
	const navigate = useNavigate()


	// Handle Password and username state
	const [username,setusername] = useState("")
	const [password,setpassword] = useState("")
	const [confirmpassword,setconfirmpassword] = useState("")


	// Handle Create password hidden state
	const [open,setopen] = useState(false)
	const toggle = () => {
		setopen(!open)
	}


	// Handle Submit
	const HandleSubmit= async(e) => {
		e.preventDefault()
		
		try{
		const response = await axios.post('/SignUp' , {username,password})
		navigate(response.data)
		} catch(err){
			console.error(err)
		}
	}


  return (
    
    <div className='w-full h-screen'>
      
      <div className='flex items-center space-x-3 w-fit h-[50px] mt-4 ml-4'>
        <img className='w-[50px] h-full object-cover rounded-[45%]' src="/images/logo1.jpg" alt="" />
        <h1 className='font-mono text-[25px]'>INCOM</h1>
      </div>
      <h1 className='text-[40px] mt-3 font-semibold ml-5'>Create an account</h1>
      <div className='w-[90%] h-[68%] ml-5 mt-3 '>
        
        <form onSubmit={HandleSubmit}>

			{/* username */}
			<h1 className='text-[18px]'>Username</h1>
			<input 
			required
			onChange={(e)=>{
			setusername(e.target.value)
			console.log(e.target.value)
			}}
			className='w-[100%] h-[50px] rounded-lg py-2 px-4 bg-slate-200 border-[2px] border-slate-400 outline-none focus:border-blue-500' 
			type="text" 
			name="username" 
			placeholder='Enter your User Name'/>


			{/* Password */}
			<h1 className='text-[18px] mt-3'>Pasword</h1>
			<div className='relative w-full h-fit'>
			<input 
			required
			onChange={(e)=>{
				setpassword(e.target.value)
				console.log(e.target.value)
				e.target.value.length < 8 ?  document.querySelector('.Rules').style.color = 'red' : document.querySelector('.Rules').style.color = 'green'
				confirmpassword !== e.target.value ? document.querySelector(".confirm").style.borderColor = "red" : document.querySelector(".confirm").style.borderColor = "green"
				
			}}
			className='w-[100%] h-[50px] rounded-lg py-2 px-4 bg-slate-200 border-[2px] border-slate-400 outline-none focus:border-blue-500' 
			type={(open === false)?"password":"text"} 
			name="password" 
			placeholder='Create password'/>
			{
				(open === false)?<IoEyeOff onClick={toggle} className='absolute text-[22px] top-[26%] right-3'/>:<IoEye onClick={toggle} className='absolute text-[22px] top-[26%] right-3'/>
			}
			</div>
			<h1 className='Rules text-slate-400 tracking-normal mt-1'>This should be 8 characters or more.</h1>
			

			{/* Confirm Password */}
			<h1 className='text-[18px] mt-3'>Confirm Pasword</h1>
			<div className='relative w-full h-fit'>
			<input 
			required
			onChange={(e)=>{
				setconfirmpassword(e.target.value)
				console.log(e.target.value)
				e.target.value !== password ? document.querySelector(".confirm").style.borderColor = "red" : document.querySelector(".confirm").style.borderColor = "green"
			}}
			pattern={password}
			title='Your Password and Confirm Password does not match'
			className='confirm w-[100%] h-[50px] rounded-lg py-2 px-4 bg-slate-200 border-[2px] border-slate-400 outline-none focus:border-blue-500' 
			type={(open === false)?"password":"text"} 
			name="confirmpassword" 
			placeholder='Confirm password'/>
			{
				(open === false)?<IoEyeOff onClick={toggle} className='absolute text-[22px] top-[26%] right-3'/>:<IoEye onClick={toggle} className='absolute text-[22px] top-[26%] right-3'/>
			}          
			</div>

			<button type='submit' className='w-full h-[50px] bg-blue-700 rounded-lg mt-8 text-white text-[18px]' >Let's Get Started</button>
			<h1 className='ml-14 mt-6'>Already have an account? <Link className='text-blue-700 font-semibold'  to='/Login'>Login</Link></h1>

        </form>
        


      </div>

    </div>
  
  )
}

export default SignUp
