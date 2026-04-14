import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/API";

const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    age: "",
    fatherName: "",
    motherName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    qualification: "",
    preferredCountry: "",
    leadStatus:"new"
  });

  // ✅ correct useEffect
  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    try {
      const res = await API.get(`/students/${id}`);
      if (res.data.success) {
        setForm(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/students/${id}`, form);
      navigate("/customers");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-xl rounded-2xl w-full max-w-5xl p-8 border">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Edit Customer
        </h1>

        <form onSubmit={handleEdit} className="space-y-6">

          {/* 🔹 Personal Info */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">Personal Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" />
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" />

              <input name="dob" type="date" value={form.dob} onChange={handleChange} className="border p-2 rounded" />
              <input name="age" value={form.age} onChange={handleChange} placeholder="Age" className="border p-2 rounded" />

            </div>
          </div>

          {/* 🔹 Contact */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">Contact Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="border p-2 rounded" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border p-2 rounded" />

              <input name="address" value={form.address} onChange={handleChange} placeholder="Address" className="border p-2 rounded md:col-span-2" />

              <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="border p-2 rounded" />
              <input name="state" value={form.state} onChange={handleChange} placeholder="State" className="border p-2 rounded" />

              <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" className="border p-2 rounded" />
              <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="border p-2 rounded" />

            </div>
          </div>

          {/* 🔹 Family */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">Family Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input name="fatherName" value={form.fatherName} onChange={handleChange} placeholder="Father Name" className="border p-2 rounded" />
              <input name="motherName" value={form.motherName} onChange={handleChange} placeholder="Mother Name" className="border p-2 rounded" />

            </div>
          </div>

          {/* 🔹 Education */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">Education & Preference</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input name="qualification" value={form.qualification} onChange={handleChange} placeholder="Qualification" className="border p-2 rounded" />
              <input name="preferredCountry" value={form.preferredCountry} onChange={handleChange} placeholder="Preferred Country" className="border p-2 rounded" />

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
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow"
            >
              Update Customer
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default EditCustomer;