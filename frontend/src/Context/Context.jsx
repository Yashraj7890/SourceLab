import toast from "react-hot-toast";
import { createContext, useContext, useEffect,useState } from "react";

export const AuthContext=createContext();

export const useAuthContext=()=>{
    return useContext(AuthContext);
}

export const AuthContextProvider=({children})=>{
    const [authUser,setAuthUser]=useState(null);
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        const checkUser=async()=>{
            setLoading(true);
            try{
            const res=await fetch("https://sourcelab.onrender.com/check",{credentials:"include"});
            const data=await res.json();
            setAuthUser(data.user);
            }catch(err){
             console.log(err);
             toast.error(err.message);
            }finally{
                setLoading(false);
            }
        }
        checkUser();
    },[]
    );

 return(
<AuthContext.Provider value={{authUser,setAuthUser,loading}}>
    {children}
</AuthContext.Provider>
 );
};