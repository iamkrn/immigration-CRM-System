function Customers() {

  const students = [
    {
      name:"rahul",
      email:"rahul@gmail.com",
      phone:"9812314951",
      status:"Active"
    },
  {
      name:"Aman",
      email:"Aman@gmail.com",
      phone:"9812314951",
      status:"Peding"
    }
  ]

  const handleAddStudent=() =>{
          console.log("cliked")
  }
  return (
    <div className="p-6">
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Customers</h2>
        <button
         onClick={handleAddStudent}
         className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Customer
        </button>
      </div>

      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>

        <tbody>
  {students.map((s, i) => (
    <tr key={i} className="text-center border-t">
      <td className="p-2">{s.name}</td>
      <td className="p-2" >{s.email}</td>
      <td className="p-2" >{s.phone}</td>
      <td className="p-2" >{s.status}</td>
    </tr>
  ))}
</tbody>
</table>

    </div>
  );
}

export default Customers;