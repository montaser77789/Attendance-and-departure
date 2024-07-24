import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import Button from "../components/ui/Button";
import { NavLink } from "react-router-dom";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateTrainerMutation, useDeleteTrainerMutation, useGetTrainersQuery } from "../app/Api/TrainerApiSlice";
import { Player } from "../interfaces";
import { errormsg, successmsg } from "../toastifiy";



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
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const [createTrainer ,{isLoading: isCreating}] = useCreateTrainerMutation();
  const { data: trainers , refetch , isLoading } = useGetTrainersQuery({})
  console.log(trainers);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>("");
  const [deleteTrainer, { isLoading: isDeleting } ] = useDeleteTrainerMutation();

console.log(selectedTrainerId);

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
    formData.append("card_Number", data.mobile); 

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
  const handleDelete = () => {
    if (selectedTrainerId) {
      console.log(selectedTrainerId);
      
      deleteTrainer(selectedTrainerId)
        .unwrap()
        .then((response) => {
          console.log(response);
          successmsg({ msg: `${response}` });
          refetch(); 
          setIsOpenDelete(false);
          setSelectedTrainerId("");
        })
        .catch((error) => {
          errormsg({msg:`${error}`})
          console.error("Failed to delete player:", error);
        });
    }
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
          {filteredTrainers.map((trainer: Player) => (
            <div
              key={trainer._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
            >
              <img
                src={trainer.picture ? trainer.picture : '/path/to/default-image.jpg'}
                alt={trainer.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{trainer.name}</h3>
                <p className="text-gray-700 mb-1 text-xl">
                  الجنسية: <span className="text-gray-500"> {trainer.nationality}</span>
                </p>
                <p className="text-gray-700 mb-4 text-xl">
                  رقم الهوية: <span className="text-gray-500"> {trainer.card_Number}</span>
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <NavLink to={`/trainers/${trainer._id}`}>
                    <Button size="sm">تفاصيل</Button>
                  </NavLink>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedTrainerId(trainer._id);
                        setIsOpenDelete(true);
                      }}
                      size="sm"
                      variant="danger"
                    >
                      <BsTrash size={17} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
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

      <Modal title="حذف المدرب" isopen={isOpenDelete} closeModal={() => setIsOpenDelete(false)}>
      <p className="text-right" dir="rtl">هل أنت متأكد أنك تريد حذف هذا المدرب؟</p>
      <div className="flex justify-start mt-4">
          <Button onClick={() => setIsOpenDelete(false)} >الغاء</Button>
          <Button isloading={isDeleting}  onClick={handleDelete} className="ml-2" variant="danger">حذف</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Trainer;
