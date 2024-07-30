import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import {
  useGetPlayersByIdQuery,
  
  useUpdatePlayerMutation,
} from "../app/Api/PlayerSliceApi";
import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select, { OptionsOrGroups, GroupBase } from "react-select";
import { errormsg, successmsg } from "../toastifiy";

interface IFormInput {
  _id?: number;
  name: string;
  nationality: string;
  idNumber: string;
  dateOfBirth?: string;
  mobile?: string;
  category: IOption;
  coach?: string;
  card_Number: string;
  picture: FileList;
  doc_start: string;
  doc_end: string;
}

interface IOption {
  value: string;
  label: string;
}

const categoryOptions: OptionsOrGroups<IOption, GroupBase<IOption>> = [
  { value: "فريق اول", label: "فريق اول" },
  { value: "اولمبيا", label: "اولمبيا" },
  { value: "شباب", label: "شباب" },
  { value: "ناشئين", label: "ناشئين" },
  { value: "اشبال", label: "اشبال" },
  { value: "براعم", label: "براعم" },
];

const PlayerDetails = () => {
  const { playerId } = useParams();
  const { data, refetch , isLoading } = useGetPlayersByIdQuery(playerId || "");
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const { register, handleSubmit, setValue, control } = useForm<IFormInput>();
  const [selectedPlayer, setSelectedPlayer] = useState<IFormInput | null>(null);
  const [updatePlayer] = useUpdatePlayerMutation();
console.log(data);

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
    setValue("card_Number", player.card_Number);
    setValue("doc_start", player.doc_start);
    setValue("doc_end", player.doc_end);
  };

  const handleSubmitEdit: SubmitHandler<IFormInput> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("nationality", data.nationality);
    formData.append("idNumber", data.idNumber);
    formData.append("birthday", data.dateOfBirth || "");
    formData.append("doc_start", data.doc_start);
    formData.append("doc_end", data.doc_end);
    if (data.mobile) {
      formData.append("mobile", data.mobile);
    }

    if (typeof data.category === "string") {
      formData.append("category", data.category);
    } else if (data.category && typeof data.category.value === "string") {
      formData.append("category", data.category.value);
    }
    formData.append("coach", data.coach || "");
    if (data.picture instanceof FileList && data.picture.length > 0) {
      const file = data.picture[0];
      formData.append("file", file);
    }

    updatePlayer({ id: selectedPlayer?._id, formData })
      .unwrap()
      .then((response) => {
        setIsOpenEdit(false);
        successmsg({ msg: `${response}` });
        refetch();
      })
      .catch((error) => {
        errormsg({ msg: `${error.data}` });
        console.error("Failed to update player:", error);
      });
  };

  return (
    <div className=" mx-auto p-4 mt-20">
      <div className="bg-white shadow-lg rounded-lg p-0 md:p-6 flex flex-col md:flex-row items-center">
        {isLoading ? (
          <div className="text-right w-full" dir="rtl">
            جاري التحميل...
          </div>
        ) : (
          <>
            <div className="w-full md:w-1/3">
              <img
                src={data?.picture}
                alt="Player"
                className="rounded-xl shadow-2xl w-[380px] h-[300px] mx-auto"
              />
            </div>
            <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-6 text-right space-y-3">
              <h2 className="text-3xl font-bold mb-2">
                {data?.name || "اسم اللاعب"}
              </h2>
              <p className="mb-2">
                <strong>تاريخ الميلاد:</strong> {data?.dateOfBirth || "غير محدد"}
              </p>
              <p className="mb-2">
                <strong>رقم الجوال:</strong> {data?.mobile || "غير محدد"}
              </p>
              <p className="mb-2">
                <strong>الجنسية:</strong> {data?.nationality || "غير محدد"}
              </p>
              <p className="mb-2">
                <strong>رقم الهوية:</strong> {data?.card_Number || "غير محدد"}
              </p>
              <p className="mb-2">
                <strong>الفئة:</strong> {data?.category || "غير محدد"}
              </p>
              <p className="mb-2">
                <strong>المدرب المسئول:</strong> {data?.coach || "غير محدد"}
              </p>
              <p className="mb-2">
                <strong>تاريخ بداية العقد:</strong> {data?.doc_start || "غير محدد"}
              </p>
              <p className="mb-2">
                <strong>تاريخ نهاية العقد:</strong> {data?.doc_end || "غير محدد"}
              </p>
              <p className="mb-2">
                <strong>عدد مرات الحضور:</strong> {data?.attendance?.present || "0"}
              </p>
              <p className="mb-2">
                <strong>عدد مرات الغياب:</strong> {data?.attendance?.absent || "0"}
              </p>
              <div className="flex gap-2 text-center justify-end mt-4">
                <Button onClick={() => handleEditPlayer(data)}>تعديل التفاصيل</Button>
              </div>
            </div>
          </>
        )}
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
              {...register("name")}
              id="editplayername"
              placeholder="اسم اللاعب"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayerpicture">صورة اللاعب:</label>
            <Input
              {...register("picture")}
              id="editplayerpicture"
              placeholder="اختار صوره"
              type="file"
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayerdob">تاريخ الميلاد:</label>
            <Input
              {...register("dateOfBirth")}
              id="editplayerdob"
              placeholder="تاريخ الميلاد"
              type="date"
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayermobile">رقم الجوال:</label>
            <Input
              {...register("mobile")}
              id="editplayermobile"
              placeholder="رقم الجوال"
              type="tel"
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayernationality">الجنسية:</label>
            <Input
              {...register("nationality")}
              id="editplayernationality"
              placeholder="الجنسية"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayeridnumber">رقم الهوية:</label>
            <Input
              {...register("idNumber")}
              id="editplayeridnumber"
              placeholder="رقم الهوية"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayercategory">الفئة:</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={categoryOptions}
                  className="text-right"
                  id="editplayercategory"
                />
              )}
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayercoach">المدرب المسئول:</label>
            <Input
              {...register("coach")}
              id="editplayercoach"
              placeholder="المدرب المسئول"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayerdocstart">تاريخ بداية العقد:</label>
            <Input
              {...register("doc_start")}
              id="editplayerdocstart"
              placeholder="تاريخ بداية العقد"
              type="date"
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayerdocend">تاريخ نهاية العقد:</label>
            <Input
              {...register("doc_end")}
              id="editplayerdocend"
              placeholder="تاريخ نهاية العقد"
              type="date"
            />
          </div>
          <div className="mt-4">
            <Button type="submit">حفظ التعديلات</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlayerDetails;
