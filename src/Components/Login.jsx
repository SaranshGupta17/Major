import React,{useEffect, useState} from 'react'
import { IoEyeOff,IoEye } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Link,useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider,updateProfile } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "../Config/firebase-config";
import axios from "../utils/axios"
 
const Login = () => {

	const navigate = useNavigate() //navigates to specific route


  // Handle password hidden state
  const [open,setOpen] = useState(false)
  const flag = () => {
    setOpen(!open)
  }

  var [email,setemail] = useState("")
  const [password,setpassword] = useState("")
  const [uid,setuid] = useState("")
  const [photoURL,setphotoURL] = useState("")
  var [username,setusername] = useState("")
  // var emailApproved = false
  
  // Handle Email warnexisting state
  const EmailUncheck = async(e) => {
		document.querySelector(".warn").style.display = "none"
		document.querySelector(".email").style.borderColor = "#0080FF"
	}

	// Handle Email Availabilty
	const EmailCheck = async(e)=>{
    var response = ""
    if(!email.includes("@")){
      response = await axios.post("/CheckEmail",{username:email})
    }
    else{
      response = await axios.post("/CheckEmail",{email})

    }
    document.querySelector(".pass").style.borderColor = "#0080FF"
		if(!response.data){
			document.querySelector(".email").style.borderColor = "red"
			document.querySelector(".warn").style.display = "initial"
			document.querySelector(".warn").style.color = "red"

		}
	}
  const HandleSubmit = async(e) => {
    e.preventDefault()
    try{
      
      if(!email.includes("@")){
        const response = await axios.post("/LoginEmail",{username:email})
        if(response.data == "Invalid"){
          document.querySelector(".email").style.borderColor = "red"
			    document.querySelector(".warn").style.display = "initial"
			    document.querySelector(".warn").style.color = "red"
        }
        email = response.data
      }
      
      
      signInWithEmailAndPassword(auth, email, password)
      .then(async(userCredential) => {
        // Signed in 
        if(auth.currentUser.emailVerified){
          navigate("/Main")
        }else{
          navigate("/EmailVerification")
          await checkEmailVerification(userCredential.user)
        }
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if(errorMessage =="Firebase: Error (auth/invalid-credential)."){
          document.querySelector(".warn").style.display = "initial"
          document.querySelector(".email").style.borderColor = "red"
          document.querySelector(".pass").style.borderColor = "red"
        }
      });
  } catch(err){
    console.error(err)
  }
}

  // Register user to mongo
  const RegisterUserToMongo = async(e) => {
    e.preventDefault
      try{
        const response = await axios.post("/login/Firebase",{
          email:e.email,
          uid:e.uid,
          profilepicture:e.profilepicture,
          emailApproved:e.emailApproved
        }) 
        username = response.data.username
        navigate(response.data.redirect)
        
      }catch(err){
        console.log(err)
      }
  }

  // Handle LoginWithGoogle
  const LoginWithGoogle = async() => {

    const provider = new GoogleAuthProvider();

    try{

      const result = await signInWithPopup(auth,provider)
      setuid(result.user.uid)
      setphotoURL(result.user.photoURL)
      
      await RegisterUserToMongo({
        email: result.user.email,
        uid: result.user.uid,
        photoURL: result.user.photoURL,
        emailApproved:true
      })

      await updateProfile(auth.currentUser, {
        displayName: username,
      })

    } catch(err){ 
      console.error(err)
    }
  }

  const checkEmailVerification = async (user) => {
    const intervalId = setInterval(async () => {
      try {
        await user.reload(); // Reload the user to get the latest status
        if (auth.currentUser.emailVerified){
          clearInterval(intervalId); // Stop the interval once verified
          await axios.post("/updateEmailApproved", {
            uid: user.uid,
            emailApproved: true,
          });
          navigate("/Main"); // Redirect to phone verification route
        
        }
      } catch (error) {
        if (error.code === 'auth/user-token-expired') {
          console.log("User token expired, re-authenticating...");
          await handleTokenExpired(user); // Handle token expiration
        } else {
          console.error("Error reloading user:", error);
        }
      }
        
    }, 10); // Check every 5 seconds
};


  return (
    <>
      <div className='relative w-[80px] h-[80px] left-[40%] '>
        <img className='absolute top-[20%] w-full h-full object-cover rounded-[45%]' src="/images/logo1.jpg" alt="" />
      </div>
      <h1 className='mt-11 ml-[40%] text-[26px] font-semibold'>Log In</h1>
      <div className='overflow-hidden relative w-[70%] h-[58%] top-[8%] left-[15%]'>
        
        <form onSubmit={HandleSubmit}>

          {/* Email */}
          <h1 className='text-[18px]'>Email/Username</h1>
          <input 
            onFocus={EmailUncheck}
            onBlur={()=>{
			        document.querySelector(".email").style.borderColor = "#94A3B8"
            }}
            onChange={(e)=>{
              setemail(e.target.value) 
              console.log(e.target.value)
            }}
            value={email}
            className='email w-[100%] h-[50px] rounded-lg py-2 px-4 bg-slate-200 border-[2px] border-slate-400 outline-none ' 
            type={"text"} 
            name={"email"}
            placeholder="Email or Username"/>
			      <h1 className='warn hidden text-red-600 tracking-normal mt-1'>Invalid Email/Username or Password</h1>
            
          {/* Password */}
          <h1 className='text-[18px] mt-3'>Pasword</h1>
          <div className='relative w-full h-fit'>
            <input 
            required
            onBlur={()=>{
			        document.querySelector(".pass").style.borderColor = "#94A3B8"
            }}
            onFocus={email!="" ? EmailCheck:()=>{document.querySelector(".pass").style.borderColor = "#0080FF"}}
            onChange={(e)=>{
              setpassword(e.target.value)
              console.log(e.target.value)
              
            }}
            value={password}
            className='pass w-[100%] h-[50px] rounded-lg py-2 px-4 bg-slate-200 border-[2px] border-slate-400 outline-none ' 
            type={(open === false)?"password":"text"} 
            name='password'
            placeholder='Password'/>

            {
              (open === false)?<IoEyeOff onClick={flag} className='absolute text-[22px] top-[26%] right-3'/>:<IoEye onClick={flag} className='absolute text-[22px] top-[26%] right-3'/>
            }
          </div>
          
          <Link className='text-blue-700 ml-[51%] font-semibold' to='/ForgotPassword'>Forgot Password?</Link>
          <button type="submit" className='w-full h-[50px] bg-blue-700 rounded-lg mt-8 text-white text-[18px]'>Log in</button>
          <h1 className='ml-4 mt-1'>Dont have an account? <Link className='text-blue-700 font-semibold'  to='/SignUp'>Sign Up</Link></h1>
        
        </form>

        <button 
          className='flex justify-between items-center w-full h-[50px] border-2 border-zinc-500 px-5 rounded-lg mt-2'
          onClick={LoginWithGoogle}>
            Login with Google<FcGoogle className='w-[40px] h-full '/>
        </button>

      </div>
    </>
  )
}

export default Login
