import toast from "react-hot-toast";
import { MdLogout } from "react-icons/md";
import { useAuthContext } from "../Context/Context";

const Logout = () => {
  const {authUser,setAuthUser}=useAuthContext();
  const handleLogout=async()=>{
    try{
     const res=await fetch(`https://sourcelab.onrender.com/logout`,{credentials:"include"});
     const data=res.json();
     setAuthUser(null);
    }catch(err){
     toast.error(err.message);
    }
  }
  return (
    <>
      <img
        src={
          authUser?.avatarUrl
        }
        className="cursor-pointer w-10 h-10 rounded-full border border-gray-800 hover:bg-gray-900 mx-auto"
      />

      <div className="p-2 cursor-pointer flex justify-center transition-colors duration-200 rounded-md hover:bg-gray-900" onClick={handleLogout}>
        <MdLogout size={22} />
      </div>
    </>
  );
};
export default Logout;
