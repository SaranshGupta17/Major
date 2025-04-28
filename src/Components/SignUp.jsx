import React,{useState} from 'react'
import { IoEyeOff,IoEye } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider,sendEmailVerification, updateProfile} from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Config/firebase-config";
import axios from '../utils/axios';
const SignUp = () => {
	
	const navigate = useNavigate()


	// Handle Password and email state
	const [uid,setuid] = useState("")
	var [username,setusername] = useState("")
	const [email,setemail] = useState("")
	const [password,setpassword] = useState("")
	const [confirmpassword,setconfirmpassword] = useState("")
	const [photoURL,setphotoURL] = useState("")
	var emailApproved = false 

	// Handle Create password hidden state
	const [open,setopen] = useState(false)
	const toggle = () => {
		setopen(!open)
	}


	// Handle Email warnexisting state
	const EmailUncheck = async(e) => {
		document.querySelector(".warnexist").style.display = "none"
		document.querySelector(".email").style.borderColor = "#0080FF"
	}

	// Handle Email Availabilty
	const EmailCheck = async(e)=>{
		const response = await axios.post("/CheckEmail",{email})
		if(response.data){
			document.querySelector(".email").style.borderColor = "red"
			document.querySelector(".warnexist").style.display = "initial"
			document.querySelector(".warnexist").style.color = "red"

		}
	}
	// Handle SignUp with Google
	const SignUpWithGoogle=async()=>{
		const provider = new GoogleAuthProvider();

		try{
			const result = await signInWithPopup(auth,provider)
			setemail(result.user.email)
			setuid(result.user.uid)
			setphotoURL(result.user.photoURL)
			await RegisterUserInMongo({
				email: result.user.email,
				uid: result.user.uid,
				photoURL: result.user.photoURL,
				emailApproved:true
			})
			await updateProfile(auth.currentUser, {
				displayName: username,
			})
			console.log(auth.currentUser)
		} catch(err){ 
			console.error(err)
		}
		
	}

	// Handle Register user in mongo
	const RegisterUserInMongo = async(e) => {
		e.preventDefault
			try{
				const response = await axios.post("/signup/Firebase",{
					email:e.email,
					uid:e.uid,
					photoURL:e.photoURL,
					emailApproved:e.emailApproved
				}) 
				username = response.data.username
				if(response.data.exists){
					console.log("Already exists")
				}
				else{
					console.log("Successfully created")
				}
				navigate(response.data.redirect)					
			}catch(err){
				console.log(err)
			}	
	}

	// Handle Submit
	const HandleSubmit= async(e) => {
		e.preventDefault()
		
		try{
			await createUserWithEmailAndPassword(auth, email, password)
			.then(async(userCredential) => {
				// Signed up 
				const user = userCredential.user;
	
				// setemail(user.email)
				setphotoURL(user.photoURL)
				setuid(user.uid)
				await RegisterUserInMongo({
					email:user.email,
					uid:user.uid,
					photoURL:user.photoURL,
					emailApproved:false
				})
				console.log("Successfully created") 
				await updateProfile(auth.currentUser, {
					displayName: username,
				})
				console.log(auth.currentUser)
				await sendEmailVerification(auth.currentUser)

				await checkEmailVerification(user)
				// ...
			})
			.catch((error) => {
				if(error.message === "Firebase: Error (auth/email-already-in-use)."){
					document.querySelector(".email").style.borderColor = "red"
					document.querySelector(".warnexist").style.display = "initial"
					document.querySelector(".warnexist").style.color = "red"
				}else if(error.message === "Firebase: Error (auth/invalid-email)."){
					document.querySelector(".email").style.borderColor = "red"
					document.querySelector(".warninvalid").style.display = "initial"
					document.querySelector(".warninvalid").style.color = "red"
				}
				console.log(error.message)
				// ..
			});

		} catch(err){
			console.error(err)
		}
	}


	const checkEmailVerification = async (user) => {
        const intervalId = setInterval(async () => {
            await user.reload(); // Reload the user to get the latest status
            if (user.emailVerified) {
                clearInterval(intervalId); // Stop the interval once verified
                await axios.post("/updateEmailApproved", {
                    uid: user.uid,
                    emailApproved: true
                });
				navigate("/Main"); // Redirect to phone verification route
				
			}
        }, 5000); // Check every 5 seconds
    };

  return (
    
    <div className='relative w-full h-screen'>
      
      <div className='flex items-center space-x-3 w-fit h-[50px] mt-4 ml-4'>
        <img className='w-[50px] h-full object-cover rounded-[45%]' src="/images/logo1.jpg" alt="" />
        <h1 className='font-mono text-[25px]'>INCOM</h1>
      </div>
      <h1 className='text-[40px] mt-3 font-semibold ml-5'>Create an account</h1>
      <div className='w-[90%] h-[68%] ml-5 mt-3 '>
        
        <form onSubmit={HandleSubmit}>

			{/* email */}
			<h1 className='text-[18px]'>Email</h1>
			<input 
			required
			onFocus={EmailUncheck}
			onChange={(e)=>{
			setemail(e.target.value)
			}}
			className='email w-[100%] h-[50px] rounded-lg py-2 px-4 bg-slate-200 border-[2px] border-slate-400 outline-none' 
			type="email" 
			name="email" 
			placeholder='abcd@abcd.com'/>
			<h1 className='warnexist hidden text-red-600 tracking-normal mt-1'>Email already in use. Please Login</h1>
			<h1 className='warninvalid hidden text-red-600 tracking-normal mt-1'>Invalid Email</h1>

			{/* Password */}
			<h1 className='text-[18px] mt-3'>Pasword</h1>
			<div className='relative w-full h-fit'>
			<input 
			required
			onFocus={EmailCheck}
			onChange={(e)=>{
				setpassword(e.target.value)
				e.target.value.length < 8 ?  document.querySelector('.Rules').style.color = 'red' : document.querySelector('.Rules').style.color = 'green'
				confirmpassword !== e.target.value ? document.querySelector(".confirm").style.borderColor = "red" : document.querySelector(".confirm").style.borderColor = "green"
				
			}}
			className='pass w-[100%] h-[50px] rounded-lg py-2 px-4 bg-slate-200 border-[2px] border-slate-400 outline-none focus:border-blue-500' 
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
			<h1 className='ml-14 mt-6'>Already have an account? <Link className='text-blue-700 font-semibold'  to='/'>Login</Link></h1>

        </form>
        
		<button 
            className='flex justify-between items-center w-full h-[50px] border-2 border-zinc-500 px-5 rounded-lg mt-2'
	        onClick={SignUpWithGoogle}>
            SignUp with Google<FcGoogle className='w-[40px] h-full '/>
        </button>

      </div>

    </div>
  
  )
}

export default SignUp
