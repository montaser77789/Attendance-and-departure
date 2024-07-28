import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateTrainerMutation, useGetTrainersQuery } from "../app/Api/TrainerApiSlice";
import { Player } from "../interfaces";
import { errormsg, successmsg } from "../toastifiy";
import TrainerCard from "../components/TrainerCard";



interface IFormInput {
  _id?: string;
  name: string;
  nationality: string;
  mobile: string;
  picture?: FileList;
  card_Number?: string;
  coach?: string;
  email : string ;
  password : string ;
}


const Trainer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [createTrainer ,{isLoading: isCreating}] = useCreateTrainerMutation();
  const { data: trainers , refetch , isLoading } = useGetTrainersQuery({})
  console.log(trainers);



const regEmail = /^(([^<>().,;:\s@"]+(\.[^<>().,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;



  const filteredTrainers = trainers ? trainers.filter((trainer: Player) =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];
  
  const { register, handleSubmit, reset , formState: { errors }, } = useForm<IFormInput>();

  const handleSubmitCreate: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("nationality", data.nationality);
    formData.append("card_Number", data.card_Number || ""); 

    if (data.picture) {
      formData.append("file", data.picture[0]);
    }
    formData.append("mobile", data.mobile || "");
    formData.append("email", data.email); 
    formData.append("password", data.password); 


    createTrainer(formData)
      .unwrap()
      .then((response) => {
        refetch();
        setIsOpen(false);
        reset();
        successmsg({msg:'تمت الاضافه بنجاح '})
        console.log(response);
        
        
      })
      .catch((error) => {
        console.error("Failed to create player:", error);
        errormsg({ msg: `${error.data}`})
      });
  };



  return (
    <div className="w-full p-4 mt-20" dir="rtl">
      <div className="flex justify-between gap-2 flex-wrap w-full mb-4">
        <div className="md:w-[40%] w-[100%]">
          <Input
            type="text"
            placeholder="بحث"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="md:w-auto w-[100%] flex justify-center">
          <Button className="align-center w-[100%]" onClick={() => setIsOpen(true)}>اضافه مدرب جديد</Button>
        </div>
      </div>
      <div>
      {isLoading ? (
        <p className="text-center text-gray-700">جاري تحميل المدربين...</p>
      ) : filteredTrainers?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTrainers.map((trainer: Player , index: number) => (
           <TrainerCard index={index} key={trainer._id} trainer={trainer}/>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-700">لا يوجد مدربين حتى الآن</p>
      )}
      </div>
      <Modal title="اضافه مدرب جديد" isopen={isOpen} closeModal={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit(handleSubmitCreate)} dir="rtl">
        <div className="mb-2 space-y-1 text-right">
  <label htmlFor="trainername">اسم المدرب:</label>
  <Input
    {...register("name", { required: "اسم المدرب مطلوب", minLength: { value: 3, message: "اسم المدرب يجب أن يتكون من 3 أحرف على الأقل" } })}
    error={Boolean(errors.name)}
    helperText={errors.name?.message}
    id="trainername"
    placeholder="اسم المدرب"
    type="text"
  />
</div>

          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="trainer">صوره المدرب:</label>
            <Input {...register("picture")} id="trainer" placeholder="صوره المدرب" type="file" />
          </div>
        
          <div className="mb-2 space-y-2 text-right">
  <label htmlFor="trainerphone">رقم الهاتف:</label>
  <Input
    {...register("mobile", { required: "رقم الهاتف مطلوب",  pattern: {
      value: /^[0-20]/,
      message: "رقم الهاتف يجب أن يتكون من 6 إلى 20 أرقام"
    } })}
    error={Boolean(errors.mobile)}
    helperText={errors.mobile?.message}
    id="trainerphone"
    placeholder="رقم الهاتف"
    type="text"
  />
</div>

<div className="mb-2 space-y-2 text-right">
  <label htmlFor="card_Number">رقم الهوية:</label>
  <Input
    {...register("card_Number", { required: "رقم الهوية مطلوب", pattern: { value: /^[0-9]+$/, message: "رقم الهوية يجب أن يحتوي على أرقام فقط" } })}
    error={Boolean(errors.card_Number)}
    helperText={errors.card_Number?.message}
    id="card_Number"
    placeholder="رقم الهوية"
    type="text"
  />
</div>

        
      
<div className="mb-2 space-y-2 text-right">
  <label htmlFor="player">الجنسية:</label>
  <Input
    {...register("nationality", { required: "الجنسية مطلوبة" })}
    error={Boolean(errors.nationality)}
    helperText={errors.nationality?.message}
    id="player"
    placeholder="الجنسية"
    type="text"
  />
</div>

<div className="mb-2 space-y-2 text-right">
  <label htmlFor="player">الايميل:</label>
  <Input
    {...register("email", {
      required: "الايميل مطلوب",
      pattern: {
        value: regEmail,
        message: "الايميل غير صحيح",
      },
    })}
    error={Boolean(errors.email)}
    helperText={errors.email?.message}
    id="player"
    placeholder="الايميل"
    type="text"
  />
</div>

<div className="mb-2 space-y-2 text-right">
  <label htmlFor="password">كلمه السر:</label>
  <Input
    {...register("password", {
      required: "كلمة السر مطلوبة",
      minLength: {
        value: 6,
        message: "كلمة السر يجب أن تكون على الأقل 6 أحرف"
      },
    })}
    error={Boolean(errors.password)}
    helperText={errors.password?.message}
    id="password"
    placeholder="كلمه السر"
    type="password" // Changed to password to hide text
  />
</div>

          <div className="flex justify-end gap-4">

          <Button variant={"danger"} type="button" onClick={() => setIsOpen(false)}>الغاء</Button>
          <Button isloading={isCreating} type="submit">حفظ</Button>
          </div>
        </form>
      </Modal>

    
    </div>
  );
};

export default Trainer;
