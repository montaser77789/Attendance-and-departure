import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import Button from "../components/ui/Button";
import { NavLink } from "react-router-dom";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { useCreatePlayerMutation, useDeletePlayerMutation, useGetPlayersQuery } from "../app/Api/PlayerSliceApi";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import { Player } from "../interfaces";
import { successmsg } from "../toastifiy";

interface IOption {
  value: string;
  label: string;
}

const categoryOptions: IOption[] = [
  { value: "فريق اول", label: "فريق اول" },
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
  card_Number: string;
  category?: IOption;
  coach?: string;
  
}

const Players = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const { data: players, refetch , isLoading  } = useGetPlayersQuery({});
  const [createPlayer, { isLoading: isCreating , reset:resetCreateApi }] = useCreatePlayerMutation();
  const [deletePlayer, { isLoading: isDeleting } ] = useDeletePlayerMutation();
  console.log(players)
  const filteredPlayers = players?.filter((player: Player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { register, handleSubmit, reset, control } = useForm<IFormInput>();

  const handleSubmitCreate: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
    
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("nationality", data.nationality);
    formData.append("card_Number", data.card_Number); 
    if (data.picture) {
      console.log(data.picture[0])
      formData.append("file", data.picture[0]); 
    }
    formData.append("dateOfBirth", data.dateOfBirth || "");
    formData.append("mobile", data.mobile || "");
    formData.append("category", data.category?.value || ""); 
    formData.append("coach", data.coach || "");
  
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
  

  const handleDelete = () => {
    if (selectedPlayerId) {
      deletePlayer(selectedPlayerId)
        .unwrap()
        .then(() => {
          refetch(); // Refetch players to update UI
          setIsOpenDelete(false);
          setSelectedPlayerId(null);
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
          <Button className="align-center w-[100%]" onClick={() => setIsOpen(true)}>اضافه لاعب جديد</Button>
        </div>
      </div>
      <div>
      {isLoading ? (
        <p className="text-center text-gray-700">جاري تحميل اللاعبين...</p>
      ) : filteredPlayers?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPlayers.map((player: Player) => (
            <div
              key={player._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
            >
              <img
                src={player.picture}
                alt={player.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{player.name}</h3>
                <p className="text-gray-700 mb-1 text-xl">
                  الجنسية: <span className="text-gray-500"> {player.nationality}</span>
                </p>
                <p className="text-gray-700 mb-4 text-xl">
                  رقم الهوية: <span className="text-gray-500"> {player.card_Number}</span>
                </p>
                <div className="flex justify-between items-center mt-auto">
                  <NavLink to={`/players/${player._id}`}>
                    <Button size="sm">تفاصيل</Button>
                  </NavLink>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedPlayerId(player._id);
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
        <p className="text-center text-gray-700">لا يوجد لاعبين حتى الآن من فضلك اضف لاعب جديد .</p>
      )}
    </div>

    
<Modal title="اضافه لاعب جديد" isopen={isOpen} closeModal={() => setIsOpen(false)}>
        <form onSubmit={handleSubmit(handleSubmitCreate)} dir="rtl">
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="playername">اسم اللاعب:</label>
            <Input {...register("name")} id="playername" placeholder="اسم اللاعب" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="player">صوره اللاعب:</label>
            <Input {...register("picture")} id="player" placeholder="صوره اللاعب" type="file" />
            </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="player">الجنسية:</label>
            <Input {...register("nationality")} id="player" placeholder="الجنسية" type="text" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="playerbirthday">تاريخ الميلاد:</label>
            <Input {...register("dateOfBirth")} id="playerbirthday" placeholder="تاريخ الميلاد" type="date" />
          </div>
          <div className="mb-2 space-y-2 text-right">
            <label htmlFor="playerphone">رقم الهاتف:</label>
            <Input {...register("mobile")} id="playerphone" placeholder="رقم الهاتف" type="text" />
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
            <label htmlFor="playercoach">المدرب:</label>
            <Input {...register("coach")} id="playercoach" placeholder="المدرب" type="text" />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="submit" isloading={isCreating}>حفظ</Button>
            <Button type="button" onClick={() => {

                    resetCreateApi()
                    reset()
              setIsOpen(false)}            }
              variant="danger">إلغاء</Button>
          </div>
        </form>
      </Modal>


      <Modal title="تأكيد الحذف" isopen={isOpenDelete} closeModal={() => setIsOpenDelete(false)}>
        <p className="text-right">هل أنت متأكد من أنك تريد حذف هذا اللاعب؟</p>
        <div className="flex justify-start gap-2 mt-4">
          <Button isloading={isDeleting} type="button" onClick={handleDelete} variant="danger">حذف</Button>
          <Button type="button" onClick={() =>{
            setIsOpenDelete(false)
      } 
          }>إلغاء</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Players;
