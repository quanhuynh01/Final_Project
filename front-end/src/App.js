import { useEffect, useState } from "react";
import PrivateRouter from "./Route/PrivateRouter";
import PublishRouter from "./Route/PublishRouter";
import Login from "./User/Component/Login/Login";
import { jwtDecode } from "jwt-decode";
 
function App() {
  const [IsAdmin, setIsAdmin] = useState();
  const [role, setRole] = useState();
  const [isTokenDecoded, setTokenDecoded] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      //giải mã code lấy role
      setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      setTokenDecoded(true);
    }
    else {
      setTokenDecoded(false);
    }
  }, []);
  if (role === "Admin") {
    return (
      <>
        <PrivateRouter />
        <PublishRouter />
      </>
    );
  }  
  else{
    return (
      
      <div >
        <PublishRouter />
      </div>
    );
  }
 
}

export default App;
