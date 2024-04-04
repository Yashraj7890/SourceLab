import {Toaster} from "react-hot-toast";
import { Route, Routes,Navigate } from "react-router-dom";

import Login from "./Components/Login.jsx";
import SignUp from "./Components/SignUp.jsx";
import Home from "./Components/Home";
import Explore from "./Components/Explore.jsx";
import Likes from "./Components/Likes.jsx";
import SideBar from "./Components/SideBar.jsx";
import { useAuthContext } from "./Context/Context.jsx";

function App() {
  const {authUser,loading}=useAuthContext();
  if(loading) return null;
  return (
    <div className="flex">
      <SideBar />
      <div className="max-w-5xl my-5 text-white mx-auto transition-all duration-300 flex-1">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={!authUser?<Login/>:<Navigate to={"/"}/>}></Route>
          <Route path="/signup" element={!authUser?<SignUp/>:<Navigate to={"/"}/>}></Route>
          <Route path="/explore" element={authUser?<Explore/>:<Navigate to={"/login"}/>}></Route>
          <Route path="/likes" element={authUser?<Likes/>:<Navigate to={"/login"}/>}></Route>
        </Routes>
        <Toaster/>
      </div>
    </div>
  );
}

export default App;
