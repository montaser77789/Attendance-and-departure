import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGetTrainerByIdQuery, useUpdateTrainerMutation } from "../app/Api/TrainerApiSlice";
import { errormsg, successmsg } from "../toastifiy";

interface IFormInput {
  _id?: number;
  name: string;
  nationality: string;
  idNumber: string;
  picture?:  FileList;
  mobile?: string;
  category?: string;
  coach?: string;
  email: string;
  password: string;
}

const TrainerDetails = () => {
  const params = useParams();
  const trainerId = params.trainerId;
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const { register, handleSubmit, setValue } = useForm<IFormInput>();
  const [selectedPlayer, setSelectedPlayer] = useState<IFormInput | null>(null);
  const [updateTrainer, { isLoading: isUpdating }] = useUpdateTrainerMutation();
  const { data, refetch } = useGetTrainerByIdQuery(trainerId || "");
console.log(data);

  // Extract existing data
  const { picture, nationality, mobile, name, email, password, dateOfBirth, card_Number } = data || {};

  const handleGenerateReport = () => {
    alert(`تم إنشاء تقرير للمدرب ID ${trainerId}.`);
  };

  const handleEditPlayer = (player: IFormInput) => {
    setSelectedPlayer(player);
    setIsOpenEdit(true);
    setValue("name", player.name);
    setValue("nationality", player.nationality);
    setValue("idNumber", player.idNumber);
    setValue("mobile", player.mobile);
    setValue("email", player.email);
    setValue("password", player.password);
  };

  const handleSubmitEdit: SubmitHandler<IFormInput> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("nationality", data.nationality);
    formData.append("idNumber", data.idNumber);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.picture instanceof FileList && data.picture.length > 0) {
      const file = data.picture[0];
      formData.append("file", file);
      console.log("فيه صوره");
      
    } 
    if (data.mobile) {
      formData.append("mobile", data.mobile);
    }

    updateTrainer({ id: selectedPlayer?._id, formData })
      .unwrap()
      .then((response) => {
        successmsg({ msg: `${response}` });
        setIsOpenEdit(false);
        refetch();
      })
      .catch((error) => {
        errormsg({ msg: `${error}` });
      });
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/3">
          <img
            src={picture || 'default-image-url'} // Fallback to a default image if none exists
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
            <strong>الايميل:</strong> {email || "غير محدد"}
          </p>
          <p className="mb-2">
            <strong>كلمه السر:</strong> {password || "غير محدد"}
          </p>
          <div className="flex gap-2">
            <Button onClick={handleGenerateReport}>عمل تقرير</Button>
            <Button onClick={() => handleEditPlayer(data)}>
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
              {...register("picture")}
              id="editplayer"
              placeholder="صورة المدرب"
              type="file"
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
            <label htmlFor="editplayeremail">الايميل:</label>
            <Input
              {...register("email")}
              id="editplayeremail"
              placeholder="الايميل"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayerpassword">كلمه السر:</label>
            <Input
              {...register("password")}
              id="editplayerpassword"
              placeholder="كلمه السر"
              type="text"
            />
          </div>
          <div className="flex gap-2 justify-end items-center">
            <Button isloading={isUpdating} type="submit">حفظ التعديلات</Button>
            <Button type="button" variant={"danger"} onClick={() => setIsOpenEdit(false)}>
              الغاء
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TrainerDetails;
