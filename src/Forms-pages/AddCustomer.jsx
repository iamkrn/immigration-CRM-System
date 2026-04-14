import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddCustomer = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

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
    <div style={{ padding: "20px" }}>
      <h1>Add Customer</h1>

      <form onSubmit={handleSubmit}>
        <input
          name='name'
          placeholder='Enter Your name'
          value={form.name}
          onChange={handleChange}
        />

        <input
          name='email'
          placeholder='Enter Your E-mail'
          value={form.email}
          onChange={handleChange}
        />

        <input
          name='phone'
          placeholder='Enter Your Phone-no'
          value={form.phone}
          onChange={handleChange}
        />

        <br />

        <button type='submit'>Add</button>

        <button
          type="button"   
          onClick={() => navigate('/customers')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddCustomer;