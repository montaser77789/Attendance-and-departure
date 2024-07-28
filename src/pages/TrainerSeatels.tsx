import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useGetTrainerByIdQuery, useUpdateTrainerMutation } from "../app/Api/TrainerApiSlice";
import { errormsg, successmsg } from "../toastifiy";
import axios from "axios";
import Cookies from "js-cookie";

interface IFormInput {
  _id?: number;
  name: string;
  nationality: string;
  idNumber: string;
  picture?: FileList;
  mobile?: string;
  category?: string;
  coach?: string;
  email: string;
  password: string;
}

const TrainerDetails = () => {
  const { trainerId } = useParams();
  const [isOpenAdmin, setIsOpenAdmin] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const { register, handleSubmit, setValue } = useForm<IFormInput>();
  const [selectedPlayer, setSelectedPlayer] = useState<IFormInput | null>(null);
  const [updateTrainer, { isLoading: isUpdating }] = useUpdateTrainerMutation();
  const res = useGetTrainerByIdQuery(trainerId || "");
  
  const data = res.data?.data;
  const { picture, nationality, mobile, name, email, card_Number, _id } = data || {};

  const handleEditPlayer = (player: IFormInput) => {
    setSelectedPlayer(player);
    setIsOpenEdit(true);
    setValue("name", player.name);
    setValue("nationality", player.nationality);
    setValue("idNumber", player.idNumber);
    setValue("mobile", player.mobile);
    setValue("email", player.email);
    setValue("password", res.data?.plaintextPassword);
  };

  const handleSubmitEdit: SubmitHandler<IFormInput> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("nationality", data.nationality);
    formData.append("idNumber", data.idNumber);
    formData.append("email", data.email);
    formData.append("password", data.password);

    if (data.picture instanceof FileList && data.picture.length > 0) {
      formData.append("picture", data.picture[0]);
    }
    if (data.mobile) {
      formData.append("mobile", data.mobile);
    }

    updateTrainer({ id: selectedPlayer?._id, formData })
      .unwrap()
      .then((response) => {
        successmsg({ msg: `${response}` });
        setIsOpenEdit(false);
        res.refetch();
      })
      .catch((error) => {
        errormsg({ msg: `${error}` });
      });
  };

  const handleAdmin = async () => {
    const token = Cookies.get('access_token');
    try {
      const response = await axios.patch(
        `https://pro1-4zoz.onrender.com/app/user/admin/access_admin/${_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      successmsg({ msg: `${response.data}` });
      res.refetch();
      setIsOpenAdmin(false);
    } catch (error) {
      console.error(error);
      errormsg({ msg: "Failed to update admin status" });
    }
  };

  const handleUnAdmin = async () => {
    const token = Cookies.get('access_token');
    try {
      const response = await axios.patch(
        `https://pro1-4zoz.onrender.com/app/user/admin/un_access_admin/${_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      successmsg({ msg: `${response.data}` });
      res.refetch();
      setIsOpenAdmin(false);
    } catch (error) {
      console.error(error);
      errormsg({ msg: "Failed to update admin status" });
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <div className="bg-white shadow-lg  rounded-lg p-6 flex flex-col md:flex-row items-center">
        {res.isLoading ? (
          <div className="text-right w-full" dir="rtl">جاري التحميل...</div>
        ) : (
          <>
            <div className="w-full md:w-1/3">
              <img
                src={picture || 'default-image-url'}
                alt="مدرب"
                className="rounded-xl shadow-2xl w-[400px] h-[300px] mx-auto"
              />
            </div>
            <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-6 text-right space-y-3">
              <h2 className="text-2xl font-bold mb-2">{name || "اسم المدرب"}</h2>
              <p className="mb-2"><strong>رقم الجوال:</strong> {mobile || "غير محدد"}</p>
              <p className="mb-2"><strong>الجنسية:</strong> {nationality || "غير محدد"}</p>
              <p className="mb-2"><strong>رقم الهوية:</strong> {card_Number || "غير محدد"}</p>
              <p className="mb-2"><strong>الايميل:</strong> {email || "غير محدد"}</p>
              <p className="mb-2"><strong>كلمه السر:</strong> {res.data?.plaintextPassword || "غير محدد"}</p>
              <div className="flex gap-2">
                <Button onClick={() => handleEditPlayer(data)}>تعديل التفاصيل</Button>
                {!data?.Admin ? (
                  <Button onClick={() => setIsOpenAdmin(true)}>ادمن</Button>
                ) : (
                  <Button onClick={() => setIsOpenAdmin(true)}>الغاء الادمن</Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Modal
        title="تعديل المدرب"
        isopen={isOpenEdit}
        closeModal={() => setIsOpenEdit(false)}
      >
        <form onSubmit={handleSubmit(handleSubmitEdit)} dir="rtl">
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayername">اسم المدرب:</label>
            <Input {...register("name")} id="editplayername" placeholder="اسم المدرب" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayer">صورة المدرب:</label>
            <Input {...register("picture")} id="editplayer" placeholder="صورة المدرب" type="file" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayerphone">رقم الهاتف:</label>
            <Input {...register("mobile")} id="editplayerphone" placeholder="رقم الهاتف" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayeremail">الايميل:</label>
            <Input {...register("email")} id="editplayeremail" placeholder="الايميل" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="editplayerpassword">كلمه السر:</label>
            <Input {...register("password")} id="editplayerpassword" placeholder="كلمه السر" type="text" />
          </div>
          <div className="flex gap-2 justify-end items-center">
            <Button isloading={isUpdating} type="submit">حفظ التعديلات</Button>
            <Button type="button" variant={"danger"} onClick={() => setIsOpenEdit(false)}>الغاء</Button>
          </div>
        </form>
      </Modal>

      {!data?.Admin && (
        <Modal isopen={isOpenAdmin} closeModal={() => setIsOpenAdmin(false)}>
          <div>
            <h3 className="text-right">جعل هذا المدرب ادمن ؟</h3>
            <div className="flex gap-2">
              <Button onClick={handleAdmin}>نعم</Button>
              <Button onClick={() => setIsOpenAdmin(false)} variant={"danger"}>لا</Button>
            </div>
          </div>
        </Modal>
      )}

      {data?.Admin && (
        <Modal isopen={isOpenAdmin} closeModal={() => setIsOpenAdmin(false)}>
          <div>
            <h3 className="text-right">الغاء الادمن ؟</h3>
            <div className="flex gap-2">
              <Button onClick={handleUnAdmin}>نعم</Button>
              <Button onClick={() => setIsOpenAdmin(false)} variant={"danger"}>لا</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TrainerDetails;
