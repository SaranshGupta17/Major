import React,{useState,useEffect} from 'react'
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom'
import {auth} from "../Config/firebase-config"
import axios from "../utils/axios"
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { FaRupeeSign } from "react-icons/fa";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import Protect from './Protect'
function Main() {

  const [data,setData] = useState([])
  const [watchList,setWatchList] = useState({
    "WatchList 1":[],
    "Watchlist 2":[],
    "WatchList 3":[]
  })
  const [activeWatchList, setActiveWatchList] = useState("WatchList 1");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const user = auth.currentUser
  // Generates sign for each stock
  const generateSign=()=>{
    const symbol = ["+","-"]
    const randomIndex = Math.floor(Math.random()*symbol.length)
    return(symbol[randomIndex])
  }

  // Handles saving stock in WatchList 
  const handleWatchList= async(listnumber,stockSymbol)=>{
    try{
      if(watchList[listnumber].length <= 9){
        const response = await axios.post("/watchList",{uid:user.uid,listnumber,stockSymbol})
        const updatedWatchlist = response.data
        setWatchList((prev)=>({
          ...prev,
          ...updatedWatchlist
        }))
      }
      else{
        alert("You can only add upto 10 stocks in 1 watchlist")
      }
    }catch(err){
      console.error(err)
    }
    

  }
  
  
  // Handles fetching data from csv and displaying it in stockList and also Handles continuous fluctuation of stock price in range of 1% of LTP
  useEffect(()=>{
    const fetchData = async()=>{
      const response = await fetch('/src/Data.csv')
      const reader = response.body.getReader()
      const result = await reader.read()
      const decoder = new TextDecoder('utf-8')
      const csvData = decoder.decode(result.value)
      
      const parseData = Papa.parse(csvData,{
        header:true,
        skipEmptyLines:true
      }).data
      
      setData(parseData) 
      
    }
    fetchData()
    

    // Updating  Live NIfty 50 stocks
    const IntervalID = setInterval(()=>{

      setData(prevstock => 
        prevstock.map(stock => {
          const sign = generateSign(); // Generate sign for each stock
          const currentLTP = parseFloat(String(stock.LTP).replace(/,/g, ''));
          const openLTP = parseFloat(String(stock.OPEN).replace(/,/g, ''));
          const changeCENT = parseFloat(String(stock['%CHNG']).replace(/,/g, ''));

          // Calculate new LTP based on sign
          const updatedLTP = sign === "+"
            ? (currentLTP + Math.random() * Math.round(currentLTP / 100)).toFixed(2)
            : (currentLTP - Math.random() * Math.round(currentLTP / 100)).toFixed(2);

          return {
            ...stock,
            LTP: updatedLTP,
            CHNG:(updatedLTP-openLTP).toFixed(2),
            '%CHNG':(((updatedLTP-openLTP)*100)/openLTP).toFixed(2)
          };
        })
      )    

    },1000)
    
    setTimeout(()=>{
      clearInterval(IntervalID)
    },1000000)
    return () => clearInterval(IntervalID);

  },[])


  // Handles fetching chart data 
  const getdata=async()=>{
    const response = await axios.post('/ChartData')
    console.log(response.data)
  }

  return (
    
    <>
      {/* <Protect/> */}
      <div className='overflow-hidden md:w-screen md:h-screen flex'>

        <Sidebar/>
        <div className='w-full h-full'>
          <Navbar/>
          <div className='graph h-[45%] w-full shadow-md'>
            <button className='m-5 h-[12%] w-[15%] bg-blue-600 text-white' onClick={getdata}>Submit</button>
          </div>
          
          
          
          
          <div  
            style={{ userSelect: 'none' }}
            className='stocks h-[45%] w-full py-7 p-4 flex justify-around'>

          <div className='stocksList h-full w-[47.5%] border-2 border-black rounded-xl overflow-auto'>

            <div className='w-full h-[20%] flex justify-between items-center p-4 font-semibold'>
              <h1 className='text-[19px]'>Nifty 50 Stocks</h1>
              <h1 className='text-[15px]'>View all</h1>  
            </div>

            <div className='list w-full h-[80%] flex-col'>

              {
                
                data.map((stocks,index)=>(

                  <div key={index} className='relative w-full h-[20%] border-b-[2px] border-slate-300 flex justify-between items-center px-4'>
                    <div className='h-full w-[94%] flex justify-between items-center'>
                      <h1>{stocks.SYMBOL}</h1>
                      <h1 className='h-full flex items-center font-semibold'><FaRupeeSign  /> {stocks.LTP} <span className={`ml-[4.5px] ${parseFloat(String(stocks.OPEN).replace(/,/g, ''))<stocks.LTP?'text-green-500':'text-red-500'}`}>{stocks.CHNG>0?"+"+stocks.CHNG:stocks.CHNG}({stocks['%CHNG']}%)</span></h1>
                    </div>
                    <MdOutlineAddCircleOutline 
                    onMouseEnter={() => setHoveredIndex(index)}
                      className='add text-[30px] rounded-lg bg-slate-50 block'
                    />
                    <div
                      onClick={(e)=>{
                        handleWatchList(e.target.innerHTML,stocks.SYMBOL)
                      }} 
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`watch bg-white w-[200px] h-[120px] rounded-lg absolute right-14 bottom-0 ${hoveredIndex === index ? 'block' : 'hidden'} border-2 border-black`}>
                      <h1 className='w-full h-[25%] border-b-2 border-slate-400 px-2'>Save to</h1>
                      <h1 className='px-3 h-[25%] hover:bg-blue-300'>WatchList 1</h1>
                      <h1 className='px-3 h-[25%] hover:bg-blue-300'>WatchList 2</h1>
                      <h1 className='px-3 h-[25%] hover:bg-blue-300'>WatchList 3</h1>
                    </div>
                  </div>
                ))

              }
            
            </div>
          </div>

          <div className='watchList h-full w-[47.5%] border-2 border-black rounded-xl overflow-auto'>
            <div className='w-full h-[20%] flex justify-between items-center p-4 font-semibold'>
              <h1 className='text-[19px]'>My Watchlist</h1>
              <h1 className='text-[15px]'>{watchList[activeWatchList].length} items</h1>  
            </div>

            <div className='w-[80%] flex'>
              <h1 onClick={()=>{setActiveWatchList("WatchList 1")}} className={`h-[54px] py-3 px-4 ${activeWatchList === "list1"? ' border-b-2 border-blue-400':'border-b-2'}`}>WatchList 1</h1>
              <h1 onClick={()=>{setActiveWatchList("WatchList 2")}} className={`h-[54px] py-3 px-4 ${activeWatchList === "list2"? ' border-b-2 border-blue-400':'border-b-2'}`}>WatchList 2</h1>
              <h1 onClick={()=>{setActiveWatchList("WatchList 3")}} className={`h-[54px] py-3 px-4 ${activeWatchList === "list3"? ' border-b-2 border-blue-400':'border-b-2'}`}>WatchList 3</h1>
            </div>

            <div className='w-full h-[70%] flex-col'>

              {

                watchList[activeWatchList] && watchList[activeWatchList].length>0?(
                  data.filter(stocks=>watchList[activeWatchList].includes(stocks.SYMBOL)).map((stock,index)=>(
                      <div key={index} className='w-full h-[22%] border-b-[2px] border-slate-300 flex justify-between items-center px-4'>
                        <h1>{stock.SYMBOL}</h1>
                        <h1 className='h-full flex items-center font-semibold'><FaRupeeSign  /> {stock.LTP} <span className={`ml-[4.5px] ${parseFloat(String(stock.OPEN).replace(/,/g, ''))<stock.LTP?'text-green-500':'text-red-500'}`}>{stock.CHNG>0?"+"+stock.CHNG:stock.CHNG}({stock['%CHNG']}%)</span></h1>
                      </div>
                    
                  ))
                ):(
                  <h1 className='w-full h-[90%] flex justify-around items-center'>No stocks saved yet</h1>
                )
              
              }

            </div>
          </div>

          </div>
         
        </div>

      </div>
    </>
  )
}

export default Main
