import { useDispatch, useSelector } from 'react-redux';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'; // استيراد useState
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // استيراد الأيقونات
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import InputErrormesg from '../components/ui/Inputerrormessage';
import { data_login } from '../data';
import { LoginSchema } from '../validation';
import { RootState, AppDispatch } from '../app/store';
import { loginUser } from '../app/Api/Login';

interface IFormInput {
  email: string;
  password: string;
}

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [passwordVisible, setPasswordVisible] = useState(false); // حالة تتبع نوع الإدخال

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const res = await dispatch(loginUser(data)).unwrap();
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
      console.log(res);
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  const handleLogin = data_login.map(({ name, placeholder, type, validation }, index) => (
    <div dir="rtl" key={index} className="relative">
      <Input
        dir="rtl"
        {...register(name as keyof IFormInput, validation)}
        placeholder={placeholder}
        type={name === "password" ? (passwordVisible ? "text" : "password") : type} // تبديل نوع الإدخال
      />
      {name === "password" && (
        <span
          className="absolute left-2 top-1/2 transform -translate-y-1/2 cursor-pointer" // ضبط الموقع باستخدام left
          onClick={() => setPasswordVisible(!passwordVisible)} // تبديل حالة الرؤية
        >
          {passwordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
        </span>
      )}
      {errors[name as keyof IFormInput] && (
        <InputErrormesg msg={errors[name as keyof IFormInput]?.message} />
      )}
    </div>
  ));

  return (
    <div className="w-[80%] md:w-1/3 mt-40 mx-auto">
      <h2 className="text-center mb-4 text-3xl font-semibold">تسجيل الدخول</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {handleLogin}
        <Button fullWidth isloading={loading}>
          {loading ? '...جاري تسجيل الدخول' : 'تسجيل الدخول'}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
