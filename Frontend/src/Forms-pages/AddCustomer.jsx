import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/API";

const AddCustomer = () => {
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
    pinCode: "", 
    country: "",
    preferredCountry: "",
    qualification: "",
    leadStatus: "cold",
    sku:'alliance',
    isActive:"true"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.email) {
      return alert("Name & Email required");
    }

    try {
      await API.post("/students", form);

      alert("Customer Added");
      navigate("/customers");

    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Failed to add customer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <div className="bg-white shadow-xl rounded-2xl w-full max-w-5xl p-8">

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Add Customer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Personal */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">Personal Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input name="firstName" onChange={handleChange} placeholder="First Name" className="input" required />
              <input name="lastName" onChange={handleChange} placeholder="Last Name" className="input" />

              <input name="dob" type="date" onChange={handleChange} className="input" />
              <input name="age" onChange={handleChange} placeholder="Age" className="input" />

            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">Contact Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input name="email" onChange={handleChange} placeholder="Email" className="input" required />
              <input name="phone" onChange={handleChange} placeholder="Phone" className="input" />

              <input name="address" onChange={handleChange} placeholder="Address" className="input col-span-2" />

              <input name="city" onChange={handleChange} placeholder="City" className="input" />
              <input name="state" onChange={handleChange} placeholder="State" className="input" />

              <input name="pinCode" onChange={handleChange} placeholder="Pin Code" className="input" />
              <input name="country" onChange={handleChange} placeholder="Country" className="input" />

            </div>
          </div>

          {/* Family */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">Family Info</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input name="fatherName" onChange={handleChange} placeholder="Father Name" className="input" />
              <input name="motherName" onChange={handleChange} placeholder="Mother Name" className="input" />

            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">Education & Preference</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input name="qualification" onChange={handleChange} placeholder="Qualification" className="input" />
              <input name="preferredCountry" onChange={handleChange} placeholder="Preferred Country" className="input" />

            </div>
          </div>

          {/*  FIXED STATUS */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">Lead Status</h2>

            <select
              name="leadStatus"
              value={form.leadStatus}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="cold">Cold</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
            </select>
          </div>

          {/* SKU */}
                  <div>
                    <h2 className="text-lg font-semibold mb-3 text-gray-600">
                      SKU Category
                    </h2>
                    <select
                      name="sku"
                      value={form.sku}
                      onChange={handleChange}
                      className="input w-full"
                    >
                      <option value="alliance">Alliance — Basic</option>
                      <option value="value+">Value+ — Standard</option>
                      <option value="premium">Premium — Priority</option>
                      <option value="superPremium">Super Premium — VIP 💎</option>
                    </select>

                    {/* SKU Description */}
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="bg-gray-50 rounded-lg p-2 text-center text-xs">
                        <p className="font-bold text-gray-500">Alliance</p>
                        <p className="text-gray-400">48hr response</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-2 text-center text-xs">
                        <p className="font-bold text-blue-500">Value+</p>
                        <p className="text-gray-400">24hr response</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-2 text-center text-xs">
                        <p className="font-bold text-purple-500">Premium</p>
                        <p className="text-gray-400">8hr response</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-2 text-center text-xs">
                        <p className="font-bold text-yellow-500">Super Premium 💎</p>
                        <p className="text-gray-400">4hr response</p>
                      </div>
                    </div>
                  </div>

          {/**isActive  */}
            <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-600">IsActive</h2>

            <select
              name="isActive"
              value={form.isActive}
              onChange={handleChange}
              className="input w-full"
            >
              <option value='true'>True</option>
              <option value='false'>False</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={() => navigate("/customers")}
              className="px-5 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
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
    </div>
  );
};

export default AddCustomer;