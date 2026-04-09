import Footer from "../components/Footer"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"



const MainLayout = () => {
  return (
    <>
      <Header/>
      <div className="flex">
        <Sidebar/>
        <div className="p-4 w-full min-h-screen bg-gray-100">
          <Outlet/>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default MainLayout
