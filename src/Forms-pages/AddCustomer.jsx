import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddCustomer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email:"" ,
    phone:"" ,
    dob:"",
    age:"",
    fatherName:"",
    motherName:"",
    address:"",
    city:"",
    pincode:"",
    country:"",
    state:"",
    preferredCountry:"",
    qualification:"",
  leadStatus:"new" });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token); 

      if (!token) {
        alert("Please login first");
        return navigate("/login");
      }

      await axios.post(
        'http://localhost:5000/api/students',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Customer Added ');
      navigate('/customers');

    } catch (error) {
      console.log(error.response?.data || error.message);

      if (error.response?.status === 401) {
        alert("Unauthorized! Please login again");
        navigate("/login");
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

  <div className="bg-white shadow-xl rounded-2xl w-full max-w-5xl p-8">

    <h1 className="text-3xl font-bold mb-6 text-gray-800">
      Add Customer
    </h1>

    <form onSubmit={handleSubmit} className="space-y-6">

      {/* 🔹 Personal Info */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-600">Personal Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input name="firstName" onChange={handleChange} placeholder="First Name" className="input" />
          <input name="lastName" onChange={handleChange} placeholder="Last Name" className="input" />

          <input name="dob" type="date" onChange={handleChange} className="input" />
          <input name="age" onChange={handleChange} placeholder="Age" className="input" />

        </div>
      </div>

      {/* 🔹 Contact Info */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-600">Contact Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input name="email" onChange={handleChange} placeholder="Email" className="input" />
          <input name="phone" onChange={handleChange} placeholder="Phone" className="input" />

          <input name="address" onChange={handleChange} placeholder="Address" className="input col-span-2" />

          <input name="city" onChange={handleChange} placeholder="City" className="input" />
          <input name="state" onChange={handleChange} placeholder="State" className="input" />

          <input name="pincode" onChange={handleChange} placeholder="Pincode" className="input" />
          <input name="country" onChange={handleChange} placeholder="Country" className="input" />

        </div>
      </div>

      {/* 🔹 Family Info */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-600">Family Info</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input name="fatherName" onChange={handleChange} placeholder="Father Name" className="input" />
          <input name="motherName" onChange={handleChange} placeholder="Mother Name" className="input" />

        </div>
      </div>

      {/* 🔹 Education / Immigration */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-600">Education & Preference</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input name="qualification" onChange={handleChange} placeholder="Qualification" className="input" />
          <input name="preferredCountry" onChange={handleChange} placeholder="Preferred Country" className="input" />

        </div>
      </div>
        <select
          name='leadStatus'
          value={form.leadStatus}
          onChange={handleChange}
          className='border p-2 rounded'>
            <option value="new">New</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>

        </select>
      {/* 🔘 Buttons */}
      <div className="flex justify-end gap-4 pt-4">

        <button
          type="button"
          onClick={() => navigate('/customers')}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-md"
        >
          Save Customer
        </button>

      </div>

    </form>
  </div>
</div> );
};

export default AddCustomer;