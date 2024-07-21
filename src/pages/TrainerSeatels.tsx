import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { useUpdatePlayerMutation } from "../app/Api/PlayerSliceApi";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGetTrainerByIdQuery } from "../app/Api/TrainerApiSlice";

interface IFormInput {
  _id?: number;
  name: string;
  nationality: string;
  idNumber: string;
  image?: string | FileList;
  dateOfBirth?: string;
  mobile?: string;
  category?: string;
  coach?: string;
}
const TrainerDetails = () => {
  const params = useParams();
  const trainerId = params.trainerId;
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const { register, handleSubmit, setValue } = useForm<IFormInput>();
  const [selectedPlayer, setSelectedPlayer] = useState<IFormInput | null>(null);
  const [updatePlayer] = useUpdatePlayerMutation();
  const { data } = useGetTrainerByIdQuery(trainerId || "");
  console.log(data);
  const picture = data?.picture;
  const category = data?.category;
  const nationality = data?.nationality;
  const mobile = data?.mobile;
  const name = data?.name;
  const coach = data?.coach;
  const dateOfBirth = data?.dateOfBirth;
  const card_Number = data?.card_Number;

  const handleGenerateReport = () => {
    alert(`تم إنشاء تقرير للمدرب ID ${trainerId}.`);
  };

  const handleEditPlayer = (player: IFormInput) => {
    setSelectedPlayer(player);
    setIsOpenEdit(true);
    setValue("name", player.name);
    setValue("nationality", player.nationality);
    setValue("idNumber", player.idNumber);
    setValue("dateOfBirth", player.dateOfBirth);
    setValue("mobile", player.mobile);
    setValue("category", player.category);
    setValue("coach", player.coach);
  };

  const handleSubmitEdit: SubmitHandler<IFormInput> = (data) => {
    if (selectedPlayer) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("nationality", data.nationality);
      formData.append("idNumber", data.idNumber);
      if (data.image instanceof FileList) {
        formData.append("image", data.image[0]);
      } else if (typeof data.image === "string") {
        formData.append("image", data.image);
      }
      formData.append("birthday", data.dateOfBirth || "");
      formData.append("mobile", data.mobile || "");
      formData.append("category", data.category || "");
      formData.append("coach", data.coach || "");

      updatePlayer({ id: selectedPlayer._id, formData })
        .unwrap()
        .then((response) => {
          console.log("تم تحديث المدرب:", response);
          setIsOpenEdit(false);
        })
        .catch((error) => {
          console.error("فشل تحديث المدرب:", error);
        });
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/3">
          <img
            src={picture}
            alt="مدرب"
            className="rounded-full w-48 h-48 object-cover mx-auto"
          />
        </div>
        <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-6 text-right">
          <h2 className="text-2xl font-bold mb-2">{name || "اسم المدرب"}</h2>
          <p className="mb-2">
            <strong>تاريخ الميلاد:</strong> {dateOfBirth || "غير محدد"}
          </p>
          <p className="mb-2">
            <strong>رقم الجوال:</strong> {mobile || "غير محدد"}
          </p>
          <p className="mb-2">
            <strong>الجنسية:</strong> {nationality || "غير محدد"}
          </p>
          <p className="mb-2">
            <strong>رقم الهوية:</strong> {card_Number || "غير محدد"}
          </p>
          <p className="mb-2">
            <strong>الفئة:</strong> {category || "غير محدد"}
          </p>
          <p className="mb-2">
            <strong>المدرب المسئول:</strong> {coach || "غير محدد"}
          </p>
          <div className="flex gap-2">
            <Button onClick={handleGenerateReport}>عمل تقرير</Button>
            <Button onClick={() => handleEditPlayer(data)} >
              تعديل التفاصيل
            </Button>
          </div>
        </div>
      </div>
      <Modal
        title="تعديل المدرب"
        isopen={isOpenEdit}
        closeModal={() => setIsOpenEdit(false)}
      >
        <form onSubmit={handleSubmit(handleSubmitEdit)} dir="rtl">
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayername">اسم المدرب:</label>
            <Input
              {...register("name")}
              id="editplayername"
              placeholder="اسم المدرب"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayer">صورة المدرب:</label>
            <Input
              {...register("image")}
              id="editplayer"
              placeholder="صورة المدرب"
              type="file"
            />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayerbirthday">تاريخ الميلاد:</label>
            <Input
              {...register("dateOfBirth")}
              id="editplayerbirthday"
              placeholder="تاريخ الميلاد"
              type="date"
            />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayerphone">رقم الهاتف:</label>
            <Input
              {...register("mobile")}
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
          <div className=" flex gap-2 justify-end items-center">
            <Button type="submit">حفظ التعديلات</Button>
            <Button variant={"danger"} onClick={() => setIsOpenEdit(false)}>
              الغاء
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TrainerDetails;
