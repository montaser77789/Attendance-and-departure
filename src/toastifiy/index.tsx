
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
interface Ipropse{
  msg:string
}
export  function successmsg ({msg}:Ipropse){
toast.success(msg, {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
  }
  
  export function errormsg ({msg}:Ipropse){
    toast.error(msg, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  }


        // toast.warn('🦄 Wow so easy!', {
        //     position: "top-right",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "light",
        //     });


