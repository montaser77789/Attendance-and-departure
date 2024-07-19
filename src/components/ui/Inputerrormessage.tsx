
interface Ipropse{
    msg?:string 
}
const InputErrormesg =({msg} : Ipropse  )=>{
    return msg ?  <span className="block text-red-700 text-sm" >{msg}</span> : null ;
    
}
export default InputErrormesg