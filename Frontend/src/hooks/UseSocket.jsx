import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client"

const useSocket = () => {
    const socketRef = useRef(null)
    const [isConnected, setIsConnected] = useState(false)  
    const user = JSON.parse(localStorage.getItem("user")|| "null");

    useEffect(() => {
        if (!user?._id) return

        socketRef.current = io(
            import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000",
            { query: { userId: user._id } }
        )

        socketRef.current.on("connect", () => {
            console.log("Socket connected!", socketRef.current.id)
            setIsConnected(true)  
        })

        return () => {
            socketRef.current?.disconnect()
            setIsConnected(false)
        }
    }, [user?._id ?? null])

    return { socket: socketRef, isConnected }  
}

export default useSocket