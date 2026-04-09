import { BrowserRouter, Routes, Route } from "react-router-dom"
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Customer from "./pages/Customer";
import Application from "./pages/Application";
import Document from "./pages/Document";

const App = () => {
  return (
    <>
      <BrowserRouter>
      <Routes>
        {/**layout Wrapper */}
        <Route path="/" element={<MainLayout/>}>
          <Route index element={<Dashboard/>} />
          <Route path="customers" element={<Customer/>} />
          <Route path="applications" element={<Application/>} />
          <Route path="documents" element={<Document/>} />

         </Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
