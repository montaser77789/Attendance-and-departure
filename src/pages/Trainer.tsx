import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import Button from "../components/ui/Button";
import { NavLink } from "react-router-dom";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateTrainerMutation } from "../app/Api/TrainerApiSlice";

interface IFormInput {
  firstName: string;
  image: FileList;
  birthday?: string;
  phoneNumber?: string;
  category?: string;
  coach?: string;
}

const Trainer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const [createTrainer] = useCreateTrainerMutation();

  const trainers = [
    {
      id: 1,
      name: "علي",
      nationality: "مصري",
      idNumber: "363623453",
      image: "https://i.pinimg.com/1200x/a3/11/f5/a311f515ee23f8cca912022cb64d633f.jpg",
    },
    {
      id: 2,
      name: "أحمد",
      nationality: "سعودي",
      idNumber: "123456789",
      image: "https://i.pinimg.com/1200x/a3/11/f5/a311f515ee23f8cca912022cb64d633f.jpg",
    },
  ];

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { register, handleSubmit, reset } = useForm<IFormInput>();

  const handleSubmitCreate: SubmitHandler<IFormInput> = (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    if (data.image) {
      formData.append("image", data.image[0]);
    }
    formData.append("birthday", data.birthday || "");
    formData.append("phoneNumber", data.phoneNumber || "");
    formData.append("category", data.category || "");
    formData.append("coach", data.coach || "");
  
    createTrainer(formData)
      .unwrap()
      .then((response) => {
        console.log("Trainer created:", response);
        setIsOpen(false);
        reset();
      })
      .catch((error) => {
        console.error("Failed to create trainer:", error);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredTrainers.map((trainer) => (
          <div
            key={trainer.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
          >
            <img
              src={trainer.image}
              alt={trainer.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{trainer.name}</h3>
              <p className="text-gray-700 mb-1 text-xl">
                الجنسية:<span className="text-gray-500"> {trainer.nationality}</span>
              </p>
              <p className="text-gray-700 mb-4 text-xl">
                رقم الهوية:<span className="text-gray-500"> {trainer.idNumber}</span>
              </p>
              <div className="flex justify-between items-center mt-auto">
                <NavLink to={`/players/${trainer.id}`}>
                  <Button size="sm">تفاصيل</Button>
                </NavLink>
                <div className="flex gap-2">
                  <Button onClick={() => setIsOpenDelete(true)} size="sm" variant="danger">
                    <BsTrash size={17} />
                  </Button>
             
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal title="اضافه مدرب جديد" isopen={isOpen} closeModal={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit(handleSubmitCreate)} dir="rtl">
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="trainername">اسم المدرب:</label>
            <Input {...register("firstName")} id="trainername" placeholder="اسم المدرب" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="trainer">صوره المدرب:</label>
            <Input {...register("image")} id="trainer" placeholder="صوره المدرب" type="file" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="trainerbirthday">تاريخ الميلاد:</label>
            <Input {...register("birthday")} id="trainerbirthday" placeholder="تاريخ الميلاد" type="date" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="trainerphone">رقم الهاتف:</label>
            <Input {...register("phoneNumber")} id="trainerphone" placeholder="رقم الهاتف" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="trainercategory">الفئة:</label>
            <Input {...register("category")} id="trainercategory" placeholder="الفئة" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="trainercoach">المدرب:</label>
            <Input {...register("coach")} id="trainercoach" placeholder="المدرب" type="text" />
          </div>
          <Button type="submit">حفظ</Button>
        </form>
      </Modal>

      <Modal title="حذف المدرب" isopen={isOpenDelete} closeModal={() => setIsOpenDelete(false)}>
        <p>هل أنت متأكد أنك تريد حذف هذا المدرب؟</p>
        <div className="flex gap-4 mt-4">
          <Button onClick={() => setIsOpenDelete(false)} variant="outline">إلغاء</Button>
          <Button variant="danger">حذف</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Trainer;
