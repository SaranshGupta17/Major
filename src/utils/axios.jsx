import axios from 'axios'

const instance = axios.create({
    baseURL:'http://localhost:3001',
    headers:{
        accept:'application/json'
    }
})

export default instance