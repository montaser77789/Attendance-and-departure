import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import {
  useGetPlayersByIdQuery,
  useGetReportsQuery,
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

const catagoryOptions: OptionsOrGroups<IOption, GroupBase<IOption>> = [
  { value: "فريق اول", label: "فريق اول" },
  { value: "اولمبيا", label: "اولمبيا" },
  { value: "شباب", label: "شباب" },
  { value: "ناشئين", label: "ناشئين" },
  { value: "اشبال", label: "اشبال" },
  { value: "براعم", label: "براعم" },
];

const PlayerDetails = () => {
  const params = useParams();
  const playerId = params.playerId;
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const { register, handleSubmit, setValue, control } = useForm<IFormInput>();
  const [selectedPlayer, setSelectedPlayer] = useState<IFormInput | null>(null);
  const [updatePlayer] = useUpdatePlayerMutation();
  const { data, refetch } = useGetPlayersByIdQuery(playerId || "");
  console.log(data);
  const id = data?._id;

  const picture = data?.picture;
  const category = data?.category;
  const nationality = data?.nationality;
  const mobile = data?.mobile;
  const name = data?.name;
  const coach = data?.coach;
  const dateOfBirth = data?.dateOfBirth;
  const card_Number = data?.card_Number;
  const doc_start = data?.doc_start;
  const doc_end = data?.doc_end;
  const { data: reportData } = useGetReportsQuery(id || "");

  console.log(reportData);




const handleGenerateReport = () => {
 
}
  
  
  

  const handleEditPlayer = (player: IFormInput) => {
    setSelectedPlayer(player);
    console.log(player);
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
    console.log(data);

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
      console.log("فيه صوره");
    }

    updatePlayer({ id: selectedPlayer?._id, formData })
      .unwrap()
      .then((response) => {
        console.log("Player updated:", response);
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
    <div className="container mx-auto p-4 mt-20">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/3">
          <img
            src={picture}
            alt="Player"
            className="rounded-full w-48 h-48 object-cover mx-auto"
          />
        </div>
        <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-6 text-right">
          <h2 className="text-2xl font-bold mb-2">{name || "اسم اللاعب"}</h2>
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
          <p className="mb-2">
            <strong>تاريخ بدايه العقد:</strong> {doc_start || "غير محدد"}
          </p>
          <p className="mb-2">
            <strong>تاريخ نهايه العقد:</strong> {doc_end || "غير محدد"}
          </p>
          <p className="mb-2">
            <strong>عدد مرات الحضور:</strong> { reportData?.attendance?.present|| "0"}
          </p>
          <p className="mb-2">
            <strong>عدد مرات الغياب:</strong> { reportData?.attendance?.absent  || "0"}
          </p>
          <div className="flex gap-2 text-center justify-center mt-2">
            <Button onClick={handleGenerateReport}>عمل تقرير</Button>
            <Button onClick={() => handleEditPlayer(data)}>
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
              {...register("name")}
              id="editplayername"
              placeholder="اسم اللاعب"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayername">صورة اللاعب:</label>
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
            <label htmlFor="editplayercat">الفئة:</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="اختر الفئة"
                  options={catagoryOptions}
                />
              )}
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayercoach">المدرب:</label>
            <Input
              {...register("coach")}
              id="editplayercoach"
              placeholder="اسم المدرب"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayercard_number">رقم الهوية:</label>
            <Input
              {...register("card_Number")}
              id="editplayercard_number"
              placeholder="رقم الهوية"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayerdoc_start">تاريخ بداية البطاقة:</label>
            <Input
              {...register("doc_start")}
              id="editplayerdoc_start"
              placeholder="تاريخ بداية البطاقة"
              type="date"
            />
          </div>
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="editplayerdoc_end">تاريخ انتهاء البطاقة:</label>
            <Input
              {...register("doc_end")}
              id="editplayerdoc_end"
              placeholder="تاريخ انتهاء البطاقة"
              type="date"
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button type="submit" className="bg-blue-500 text-white">
              تعديل
            </Button>
            <Button
              type="button"
              onClick={() => setIsOpenEdit(false)}
              className="bg-gray-500 text-white"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlayerDetails;
