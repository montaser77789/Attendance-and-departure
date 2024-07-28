import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import {
  useCreatePlayerMutation,
  useGetPlayersQuery,
} from "../app/Api/PlayerSliceApi";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import { Player } from "../interfaces";
import Playercard from "../components/Playercard";

interface IOption {
  value: string;
  label: string;
}

const categoryOptions: IOption[] = [
  { value: "فريق اول", label: "فريق اول" },
  { value: "اولمبي", label: "اولمبي" },
  { value: "شباب", label: "شباب" },
  { value: "براعم", label: "براعم" },
  { value: "ناشئين", label: "ناشئين" },
];

interface IFormInput {
  _id?: string;
  name: string;
  nationality: string;
  mobile: string;
  picture?: FileList;
  dateOfBirth?: string;
  card_Number: string;
  category?: IOption;
  coach?: string;
  doc_start: string;
  doc_end: string;
}

const Players = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { data: players, refetch, isLoading } = useGetPlayersQuery({});
  const [createPlayer, { isLoading: isCreating, reset: resetCreateApi }] =
    useCreatePlayerMutation();
  const isOpenModalCreate = () => setIsOpen(true);

  const filteredPlayers = players?.filter((player: Player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<IFormInput>();

  const handleSubmitCreate: SubmitHandler<IFormInput> = (data) => {
    console.log(data);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("nationality", data.nationality);
    formData.append("card_Number", data.card_Number);
    if (data.picture) {
      console.log(data.picture[0]);
      formData.append("file", data.picture[0]);
    }
    formData.append("dateOfBirth", data.dateOfBirth || "");
    formData.append("mobile", data.mobile || "");
    formData.append("category", data.category?.value || "");
    formData.append("coach", data.coach || "");
    formData.append("doc_start", data.doc_start);
    formData.append("doc_end", data.doc_end);

    createPlayer(formData)
      .unwrap()
      .then(() => {
        refetch(); // Refetch players to update UI
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
          <Button className="align-center w-[100%]" onClick={isOpenModalCreate}>
            اضافه لاعب جديد
          </Button>
        </div>
      </div>
      <div>
        {isLoading ? (
          <p className="text-center text-gray-700">جاري تحميل اللاعبين...</p>
        ) : filteredPlayers?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlayers.map((player : Player, index : number) => (
            <Playercard index={index} key={player._id} player={player} />
          ))}
        </div>
        
        
        ) : (
          <p className="text-center text-gray-700">
            لا يوجد لاعبين حتى الآن من فضلك اضف لاعب جديد .
          </p>
        )}
      </div>

      <Modal
        title="اضافه لاعب جديد"
        isopen={isOpen}
        closeModal={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit(handleSubmitCreate)} dir="rtl">
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="playername">اسم اللاعب:</label>
            <Input
              {...register("name", {
                required: "الاسم مطلوب",
                minLength: {
                  value: 3,
                  message: "يجب أن يتكون الاسم من 3 أحرف على الأقل",
                },
              })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              id="playername"
              placeholder="اسم اللاعب"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="player">صوره اللاعب:</label>
            <Input
              {...register("picture")}
              id="player"
              placeholder="صوره اللاعب"
              type="file"
            />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="playernationality">الجنسية:</label>
            <Input
              {...register("nationality", { required: "الجنسية مطلوبة" })}
              error={Boolean(errors.nationality)}
              helperText={errors.nationality?.message}
              id="playernationality"
              placeholder="الجنسية"
              type="text"
            />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="playerbirthday">تاريخ الميلاد:</label>
            <Input
              {...register("dateOfBirth", { required: "تاريخ الميلاد مطلوب" })}
              error={Boolean(errors.dateOfBirth)}
              helperText={errors.dateOfBirth?.message}
              id="playerbirthday"
              placeholder="تاريخ الميلاد"
              type="date"
            />
          </div>

          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="playerphone">رقم الهاتف:</label>
            <Input
              {...register("mobile")}
              helperText={errors.mobile?.message}
              id="playerphone"
              placeholder="رقم الهاتف"
              type="text"
            />
          </div>

          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="card_Number">رقم الهوية:</label>
            <Input
              {...register("card_Number", {
                required: "رقم الهوية مطلوب",
                minLength: {
                  value: 6,
                  message: "رقم الهوية يجب أن يتكون من 6 أرقام على الأقل",
                },
              })}
              error={Boolean(errors.card_Number)}
              helperText={errors.card_Number?.message}
              id="card_Number"
              placeholder="رقم الهوية"
              type="text"
            />
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
                    options={categoryOptions}
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
                        overflowY: "auto",
                      }),
                      control: (provided) => ({
                        ...provided,
                        minHeight: 38,
                        borderColor: "#ddd",
                        boxShadow: "none",
                        "&:hover": {
                          borderColor: "#aaa",
                        },
                      }),
                    }}
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption)
                    }
                  />
                )}
              />
            </div>
          </div>

          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="playercoach">المدرب:</label>
            <Input
              {...register("coach", { required: "اسم المدرب مطلوب" })}
              error={Boolean(errors.coach)}
              helperText={errors.coach?.message}
              id="playercoach"
              placeholder="المدرب"
              type="text"
            />
          </div>

          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="doc_start">تاريخ بدايه العقد:</label>
            <Input
              {...register("doc_start")}
              id="doc_start"
              placeholder="تاريخ بدايه العقد"
              type="date"
            />
          </div>

          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="doc_end">تاريخ نهايه العقد:</label>
            <Input
              {...register("doc_end")}
              id="doc_end"
              placeholder="تاريخ نهايه العقد"
              type="date"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="submit" isloading={isCreating}>
              حفظ
            </Button>
            <Button
              type="button"
              onClick={() => {
                resetCreateApi();
                reset();
                setIsOpen(false);
              }}
              variant="danger"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Players;
