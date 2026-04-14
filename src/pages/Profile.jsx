import { useEffect } from "react";
import API from "../services/API";

function Profile() {

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/user/profile", {
      })
    .then(res => console.log(res.data))
    .catch(err => console.log(err));

  }, []);

  return (
    <div>
      <h2>Profile Page</h2>
    </div>
  );
}

export default Profile;