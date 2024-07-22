import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import Button from "../components/ui/Button";
import { NavLink } from "react-router-dom";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useCreateTrainerMutation, useDeleteTrainerMutation, useGetTrainersQuery } from "../app/Api/TrainerApiSlice";
import Select from "react-select";
import { Player } from "../interfaces";
import { successmsg } from "../toastifiy";

interface Ioption {
  value: string,
  label: string
}

const catagoryOptions: Ioption[] = [
  { value: "فريق اول ", label: "فريق اول" },
  { value: "اولمبيا", label: "اولمبيا" },
  { value: "شباب", label: "شباب" },
  { value: "ناشئين", label: "ناشئين" },
  { value: "اشبال", label: "اشبال" },
  { value: "براعم", label: "براعم" },
];

interface IFormInput {
  _id?: string;
  name: string;
  nationality: string;
  mobile: string;
  picture?: FileList;
  dateOfBirth?: string;
  card_Number?: string;
  category?: Ioption;
  coach?: string;
  email : string ;
  password : string ;
}


const Trainer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const [createTrainer] = useCreateTrainerMutation();
  const { data: trainers , refetch , isLoading } = useGetTrainersQuery({})
  console.log(trainers);
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  const [deleteTrainer, { isLoading: isDeleting } ] = useDeleteTrainerMutation();



  const filteredTrainers = trainers ? trainers.filter((trainer: Player) =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];
  
  const { register, handleSubmit, reset, control } = useForm<IFormInput>();

  const handleSubmitCreate: SubmitHandler<IFormInput> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("nationality", data.nationality);
    formData.append("card_Number", data.mobile); 
    if (data.picture) {
      formData.append("picture", data.picture[0]);
    }
    formData.append("dateOfBirth", data.dateOfBirth || "");
    formData.append("mobile", data.mobile || "");
    formData.append("category", data.category?.value || ""); 
    formData.append("coach", data.coach || "");

    createTrainer(formData)
      .unwrap()
      .then(() => {
        refetch();
        setIsOpen(false);
        reset();
      })
      .catch((error) => {
        console.error("Failed to create player:", error);
      });
  };
  const handleDelete = () => {
    if (selectedTrainerId) {
      deleteTrainer(selectedTrainerId)
        .unwrap()
        .then(() => {
          refetch(); 
          setIsOpenDelete(false);
          setSelectedTrainerId(null);
          successmsg({ msg: "تم الحذف بنجاح" })
        })
        .catch((error) => {
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
        <p className="text-center text-gray-700">جاري تحميل البيانات...</p>
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
                  رقم الهوية: <span className="text-gray-500"> {trainer.idNumber}</span>
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
            <Input {...register("name")} id="trainername" placeholder="اسم المدرب" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="trainer">صوره المدرب:</label>
            <Input {...register("picture")} id="trainer" placeholder="صوره المدرب" type="file" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="trainerbirthday">تاريخ الميلاد:</label>
            <Input {...register("dateOfBirth")} id="trainerbirthday" placeholder="تاريخ الميلاد" type="date" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="trainerphone">رقم الهاتف:</label>
            <Input {...register("mobile")} id="trainerphone" placeholder="رقم الهاتف" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="card_Number">رقم الهوية:</label>
            <Input {...register("card_Number")} id="card_Number" placeholder="رقم الهوية" type="text" />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="category">الفئة:</label>
            <div className="relative">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={catagoryOptions}
                    placeholder="اختر الفئة"
                    className="basic-single w-full"
                    classNamePrefix="select"
                    styles={{
                      menu: (provided) => ({
                        ...provided,
                        zIndex: 9999,
                        maxHeight: 200,
                      }),
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: 200,
                        overflowY: 'auto',
                      }),
                      control: (provided) => ({
                        ...provided,
                        minHeight: 38,
                        borderColor: '#ddd',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#aaa',
                        },
                      }),
                    }}
                    onChange={(selectedOption) => field.onChange(selectedOption)}
                  />
                )}
              />
            </div>
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="trainercoach">المدرب:</label>
            <Input {...register("coach")} id="trainercoach" placeholder="المدرب" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="player">الجنسية:</label>
            <Input {...register("nationality")} id="player" placeholder="الجنسية" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="player">الايميل:</label>
            <Input {...register("email")} id="player" placeholder="الايميل" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="player">كلمه السر:</label>
            <Input {...register("password")} id="player" placeholder="كلمه السر" type="text" />
          </div>
          <div className="flex justify-end gap-4">

          <Button variant={"danger"} type="button" onClick={() => setIsOpen(false)}>الغاء</Button>
          <Button type="submit">حفظ</Button>
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
