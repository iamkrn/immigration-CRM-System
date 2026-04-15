import { useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/API";


const AddApplication = () => {

    const[form,setForm] = useState({
        country: "",
        university: "",
        course: "",
        intake: "",   
        student: ""
 
    })

    const navigate = useNavigate();
    const [students, setStudents] = useState([]);

    

    const handleSubmit = async(e)=> {
        e.preventDefault();
        await API.post('/applications',form);
        
        navigate('/applications')


    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }
    useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get(`/students`);
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };


 return (
  <div className="min-h-screen bg-gray-100 flex justify-center items-center p-2">

    <div className="bg-white shadow-xl rounded-2xl w-full max-w-5xl p-8">

      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Add Application
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 🔹 Select Student */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-600">
            Student Info
          </h2>

          <select
            name="student"
            value={form.student}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.firstName} {s.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 Application Details */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-600">
            Application Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              name="university"
              value={form.university}
              onChange={handleChange}
              placeholder="University"
              className="input"
            />

            <input
              name="course"
              value={form.course}
              onChange={handleChange}
              placeholder="Course"
              className="input"
            />

            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
              className="input"
            />

            <select
              name="intake"
              value={form.intake}
              onChange={handleChange}
              className="input"
            >
              <option value="">Select Intake</option>
              <option value="Jan">January</option>
              <option value="May">May</option>
              <option value="Sep">September</option>
            </select>

          </div>
        </div>

        {/* 🔹 Status */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-600">
            Status
          </h2>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* 🔘 Buttons */}
        <div className="flex justify-end gap-4 pt-4">

          <button
            type="button"
            onClick={() => navigate('/applications')}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 shadow-md"
          >
            Save Application
          </button>

        </div>

      </form>
    </div>
  </div>
);}

export default AddApplication
