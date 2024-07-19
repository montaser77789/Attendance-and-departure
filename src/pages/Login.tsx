import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import InputErrormesg from "../components/ui/Inputerrormessage";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { data_login } from "../data";
import { LoginSchema } from "../validation";

const LoginPage = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(LoginSchema),
  });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {

    console.log(data);

   
  };
  interface IFormInput {
    email: string;
    password: string;
  }

  ///////  RENDERS   ///////
  const handleLogin = data_login.map(
    ({ name, placeholder, type, validation }, index) => (
      <div dir="rtl" key={index}>
        <Input
         dir="rtl"
          {...register(name, validation)}
          placeholder={placeholder}
          type={type}
        />
        {errors[name] && <InputErrormesg msg={errors[name]?.message} />}
      </div>
    )
  );
  return (
    <div className="w-[80%] md:w-1/3 mt-40 mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">
        تسجيل الدخول    
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {handleLogin}
        <Button fullWidth isloading={false}>
          {/* {false ? "loading.." : "Login"} */}
          تسجيل الدخول
        </Button>
      </form>
    </div>
  );
  
};

export default LoginPage;
