import axios from "axios";
import { getConfig } from "../../../../utils/config";
import { base_url } from "../../../../utils/base_url";
// import { config, getConfig } from "../../utils/config";

const login = async (userData) => {
    // console.log(userData)
    const response = await axios.post(`${base_url}/auth/admin-login`, userData);
    console.log(response)

    if(response.status === 201){
        localStorage.setItem('user',JSON.stringify(response.data))
    }
    return response.data.result; 
}

const signOut = async ()=>{
    const response = await axios.put(`${base_url}/logout`,{}, getConfig())
    if(response.data){
      ['user', 'collapsed', 'selectedKey', 'dashboardThemeState' , 'tour' , 'offline-image'].forEach((key) => localStorage.removeItem(key));
    }
    // console.log(response.data)
    return response.data
    
}

const register = async (data)=>{
    const response = await axios.post(`${base_url}/auth/register`, data ,{
        headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response)
    return response.data.result


}

const forgotPassword = async (data)=>{
  const response = await axios.post(`${base_url}/auth/forgot-password` , data)
  console.log(response)
  return response.data
}

const resetPassword = async (data)=>{
  try {
      const {password ,token} = data
  const response = await axios.put(`${base_url}/auth/reset-password/${token}` , {password})
  console.log(response)
  return response.data
  } catch (error) {
      return error.message
      
  }
}





const authService = {
    login,signOut,register,forgotPassword,resetPassword
}

export default authService;
