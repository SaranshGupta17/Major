import React from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../Config/firebase-config'
function protect() {
    const navigate = useNavigate()
    const user = auth.currentUser
    console.log("not found")
    return (
      user==null ? navigate("/"):null
    )
}

export default protect
