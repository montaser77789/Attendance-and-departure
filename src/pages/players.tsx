import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import Button from "../components/ui/Button";
import { NavLink } from "react-router-dom";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { useCreatePlayerMutation } from "../app/Api/PlayerSliceApi";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  id?: number;
  firstName: string;
  nationality: string;
  idNumber: string;
  image?: FileList; 
  birthday?: string;
  phoneNumber?: string;
  category?: string;
  coach?: string;
}

const Players = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  
  const [createPlayer] = useCreatePlayerMutation();

  const players = [
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

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { register, handleSubmit, reset } = useForm<IFormInput>();

  const handleSubmitCreate: SubmitHandler<IFormInput> = (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("nationality", data.nationality);
    formData.append("idNumber", data.idNumber);
    if (data.image) {
      formData.append("image", data.image[0]);
    }
    formData.append("birthday", data.birthday || "");
    formData.append("phoneNumber", data.phoneNumber || "");
    formData.append("category", data.category || "");
    formData.append("coach", data.coach || "");
  
    createPlayer(formData)
      .unwrap()
      .then((response) => {
        console.log("Player created:", response);
        setIsOpen(false);
        reset();
      })
      .catch((error) => {
        console.error("Failed to create player:", error);
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
          <Button className="align-center w-[100%]" onClick={() => setIsOpen(true)}>اضافه لاعب جديد</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
          >
            <img
              src={player.image}
              alt={player.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{player.name}</h3>
              <p className="text-gray-700 mb-1 text-xl">
                الجنسية:<span className="text-gray-500"> {player.nationality}</span>
              </p>
              <p className="text-gray-700 mb-4 text-xl">
                رقم الهوية:<span className="text-gray-500"> {player.idNumber}</span>
              </p>
              <div className="flex justify-between items-center mt-auto">
                <NavLink to={`/players/${player.id}`}>
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
      <Modal title="اضافه لاعب جديد" isopen={isOpen} closeModal={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit(handleSubmitCreate)} dir="rtl">
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="playername">اسم اللاعب:</label>
            <Input {...register("firstName")} id="playername" placeholder="اسم اللاعب" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="player">صوره اللاعب:</label>
            <Input {...register("image")} id="player" placeholder="صوره اللاعب" type="file" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="playerbirthday">تاريخ الميلاد:</label>
            <Input {...register("birthday")} id="playerbirthday" placeholder="تاريخ الميلاد" type="date" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="playerphone">رقم الهاتف:</label>
            <Input {...register("phoneNumber")} id="playerphone" placeholder="رقم الهاتف" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="playercategory">الفئة:</label>
            <Input {...register("category")} id="playercategory" placeholder="الفئة" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="playercoach">المدرب:</label>
            <Input {...register("coach")} id="playercoach" placeholder="المدرب" type="text" />
          </div>
          <Button type="submit">حفظ</Button>
        </form>
      </Modal>
  
      <Modal title="حذف اللاعب" isopen={isOpenDelete} closeModal={() => setIsOpenDelete(false)}>
        <p>هل أنت متأكد أنك تريد حذف هذا اللاعب؟</p>
        <div className="flex gap-4 mt-4">
          <Button onClick={() => setIsOpenDelete(false)} variant="outline">إلغاء</Button>
          <Button variant="danger">حذف</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Players;
