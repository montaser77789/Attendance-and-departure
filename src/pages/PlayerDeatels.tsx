import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { useUpdatePlayerMutation } from "../app/Api/PlayerSliceApi";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface IFormInput {
  id?: number;
  firstName: string;
  nationality: string;
  idNumber: string;
  image?: string | FileList; // Accepts both string and FileList
  birthday?: string;
  phoneNumber?: string;
  category?: string;
  coach?: string;
}

const PlayerDetails = () => {
  const { playerId } = useParams();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const { register, handleSubmit, setValue } = useForm<IFormInput>();

  const [selectedPlayer, setSelectedPlayer] = useState<IFormInput | null>(null);
  const [imageSrc, setImageSrc] = useState<string | undefined>();

  const [updatePlayer] = useUpdatePlayerMutation();

  const player: IFormInput = {
    id: 1,
    firstName: "محمد علي",
    nationality: "سعودي",
    idNumber: "1234567890",
    image:
      "https://i.pinimg.com/1200x/a3/11/f5/a311f515ee23f8cca912022cb64d633f.jpg", // URL
    birthday: "01/01/1990",
    phoneNumber: "+966123456789",
    category: "الفئة العمرية",
    coach: "المدرب أحمد",
  };

  useEffect(() => {
    if (player.image) {
      if (typeof player.image === "string") {
        setImageSrc(player.image);
      } else {
        const file = player.image[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result as string);
        };
        if (file) {
          reader.readAsDataURL(file);
        }
      }
    }
  }, [player.image]);

  const handleGenerateReport = () => {
    alert(`Report for player ID ${playerId} generated.`);
  };

  const handleEditPlayer = (player: IFormInput) => {
    setSelectedPlayer(player);
    setIsOpenEdit(true);
    setValue("firstName", player.firstName);
    setValue("nationality", player.nationality);
    setValue("idNumber", player.idNumber);
    setValue("birthday", player.birthday || "");
    setValue("phoneNumber", player.phoneNumber || "");
    setValue("category", player.category || "");
    setValue("coach", player.coach || "");
  };

  const handleSubmitEdit: SubmitHandler<IFormInput> = (data) => {
    if (selectedPlayer) {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("nationality", data.nationality);
      formData.append("idNumber", data.idNumber);
      if (data.image instanceof FileList) {
        formData.append("image", data.image[0]);
      } else if (typeof data.image === "string") {
        formData.append("image", data.image); // Handle URL if needed
      }
      formData.append("birthday", data.birthday || "");
      formData.append("phoneNumber", data.phoneNumber || "");
      formData.append("category", data.category || "");
      formData.append("coach", data.coach || "");

      updatePlayer({ id: selectedPlayer.id, ...data })
        .unwrap()
        .then((response) => {
          console.log("Player updated:", response);
          setIsOpenEdit(false);
        })
        .catch((error) => {
          console.error("Failed to update player:", error);
        });
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/3">
          <img
            src={imageSrc}
            alt="Player"
            className="rounded-full w-48 h-48 object-cover mx-auto"
          />
        </div>
        <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-6 text-right">
          <h2 className="text-2xl font-bold mb-2">{player.firstName}</h2>
          <p className="mb-2">
            <strong>تاريخ الميلاد:</strong> {player.birthday}
          </p>
          <p className="mb-2">
            <strong>رقم الجوال:</strong> {player.phoneNumber}
          </p>
          <p className="mb-2">
            <strong>الجنسية:</strong> {player.nationality}
          </p>
          <p className="mb-2">
            <strong>رقم الهوية:</strong> {player.idNumber}
          </p>
          <p className="mb-2">
            <strong>الفئة:</strong> {player.category}
          </p>
          <p className="mb-2">
            <strong>المدرب المسئول:</strong> {player.coach}
          </p>
          <div className="flex gap-2">
            <Button onClick={handleGenerateReport}>عمل تقرير</Button>
            <Button onClick={() => handleEditPlayer(player)} size="sm">
              تعديل التفاصيل
            </Button>
          </div>
        </div>
      </div>
      <Modal
        title="تعديل اللاعب"
        isopen={isOpenEdit}
        closeModal={() => setIsOpenEdit(false)}
      >
        <form onSubmit={handleSubmit(handleSubmitEdit)} dir="rtl">
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayername">اسم اللاعب:</label>
            <Input
              {...register("firstName")}
              id="editplayername"
              placeholder="اسم اللاعب"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayer">صوره اللاعب:</label>
            <Input
              {...register("image")}
              id="editplayer"
              placeholder="صوره اللاعب"
              type="file"
            />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayerbirthday">تاريخ الميلاد:</label>
            <Input
              {...register("birthday")}
              id="editplayerbirthday"
              placeholder="تاريخ الميلاد"
              type="date"
            />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayerphone">رقم الهاتف:</label>
            <Input
              {...register("phoneNumber")}
              id="editplayerphone"
              placeholder="رقم الهاتف"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayercategory">الفئة:</label>
            <Input
              {...register("category")}
              id="editplayercategory"
              placeholder="الفئة"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayercoach">المدرب:</label>
            <Input
              {...register("coach")}
              id="editplayercoach"
              placeholder="المدرب"
              type="text"
            />
          </div>
          <div className="space-y-2 flex gap-2 justify-end items-center">
            <Button  type="submit">حفظ التعديلات</Button>
            <Button
              type="button"
              variant={"danger"}
              onClick={() => setIsOpenEdit(false)}
            >
              الغاء
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlayerDetails;
