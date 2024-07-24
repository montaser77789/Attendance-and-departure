import { useDispatch, useSelector } from 'react-redux';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom'; // استيراد useNavigate
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
  const navigate = useNavigate(); // تهيئة useNavigate
  const { loading, error } = useSelector((state: RootState) => state.auth);

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
        navigate('/'); // Navigate to home after successful login
        window.location.reload(); // Reload the page after navigation
      }, 1000); // Delay for 1 second
    
      console.log(res);
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };

  const handleLogin = data_login.map(({ name, placeholder, type, validation }, index) => (
    <div dir="rtl" key={index}>
      <Input
        dir="rtl"
        {...register(name as keyof IFormInput, validation)}
        placeholder={placeholder}
        type={type}
      />
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
