import {useEffect, useRef}  from "react"
import { io } from "socket.io-client";


const UseSocket = (userId) => {

    //useRef = ?  becuase we dont make socket for every re-render
    const socketRef = useRef(null);

    // take user from localstorage 
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(()=>{
        if(!user?._id) return; //if logout then userId is null, we dont want to connect to socket

        //step 1: connect to socket
        socketRef.current = io(
            import.meta.env.VITE_API_URL?.replace("/api","") || "http://localhost:5000",
            
                {query: {userId: user._id}}
)

        //step 2: disconnect when component unmounts
        return () => {
            socketRef.current?.disconnect();
        }

    },[user._id]) //depend on userId, when userId changes, we want to connect to new socket

    //step 3: return socketRef so we can use it in other components
    return socketRef.current;
}

export default UseSocket;
