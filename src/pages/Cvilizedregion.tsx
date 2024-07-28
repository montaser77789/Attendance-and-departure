import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Select, { SingleValue } from "react-select";
import {
  useCreateMonthMutation,
  useDeleteMonthMutation,
  useGetManthesQuery,
} from "../app/Api/Cvilizedregion";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { successmsg } from "../toastifiy";
import { BsTrash } from "react-icons/bs";

interface IOption {
  value: string;
  label: string;
}
const monthOptions: IOption[] = [
  { value: "January", label: "يناير" },
  { value: "February", label: "فبراير" },
  { value: "March", label: "مارس" },
  { value: "April", label: "ابريل" },
  { value: "May", label: "مايو" },
  { value: "June", label: "يونيو" },
  { value: "July", label: "يوليو" },
  { value: "August", label: "اغسطس" },
  { value: "September", label: "سبتمبر" },
  { value: "October", label: "اكتوبر" },
  { value: "November", label: "نوفمبر" },
  { value: "December", label: "ديسمبر" },
];

interface IFormInput {
  month: IOption | null;
  start: string;
  end: string;
  note: string;
}
interface IMonth {
  _id: string;
  month: string | null;
  start: string;
  end: string;
  note: string;
}

const Cvilizedregion = () => {
  const [createMonth, { isLoading: isLoadingCreate }] = useCreateMonthMutation(
    {}
  );
  const { data , isLoading:isLoadingGet  , refetch} = useGetManthesQuery({});
  const [deleteMonth , {isLoading:isDeleting}]  = useDeleteMonthMutation({})
  console.log(data);
  const [isOpenDelete, setIsOpenDelete ] = useState(false);
  const [idDay , setIdDay] = useState("")



  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, control, reset } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    if (data.month) {
      const formattedData = {
        month: data.month.label, 
        start: data.start,
        end: data.end,
        note: data.note,
      };

      createMonth(formattedData)
        .unwrap()
        .then((response) => {
          setIsOpen(false);
          console.log(response);
          reset();
          refetch();
          successmsg({ msg: "تم اضافه الشهر بنجاح !" });
        })
        .catch((error) => {
          console.error("Failed to create month:", error);
        });
    }
  };

  const handleDelete = () => {

    deleteMonth({ monthId: idDay })
    .unwrap()
    .then((response) => {
      setIsOpenDelete(false)

      console.log('Response:', response);
      refetch()
      successmsg({ msg:`${response}` });
    })
    .catch((error) => {
      console.error("Failed to create day:", error);
      setIsOpenDelete(false)

    });
 
  };

  return (
    <div className="mt-20  p-4" dir="rtl">
        <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold">الشهور</h2>
        <Button onClick={() => setIsOpen(true)}>اضافه شهر جديد</Button>
      </div>

      <Modal
        title="اضافه شهر جديد"
        isopen={isOpen}
        closeModal={() => setIsOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubmit)} dir="rtl">
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="month">الشهر</label>
            <Controller
              name="month"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={monthOptions}
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
                  onChange={(selectedOption: SingleValue<IOption>) =>
                    field.onChange(selectedOption)
                  }
                />
              )}
            />
          </div>

          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="startDate">بدايه الشهر</label>
            <Input
              {...register("start")}
              id="startDate"
              placeholder="بدايه الشهر"
              type="date"
            />
          </div>

          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="endDate">نهايه الشهر</label>
            <Input
              {...register("end")}
              id="endDate"
              placeholder="نهايه الشهر"
              type="date"
            />
          </div>

          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="notes">ملاحظات</label>
            <Input
              {...register("note")}
              id="notes"
              placeholder="ملاحظات"
              type="text"
            />
          </div>
          <div className="flex justify-end gap-1">
            <Button isloading={isLoadingCreate} type="submit">
              حفظ
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={() => setIsOpen(false)}
            >
              اغلاق
            </Button>
          </div>
        </form>
      </Modal>

      {/* Display months in a table */}
      {isLoadingGet ? (
        <p>جاري التحميل...</p>
      ) : data?.length === 0 ? (
        <p>لا يوجد شهور حتي الان  .</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">الشهر</th>
              <th className="border border-gray-300 p-2">البداية</th>
              <th className="border border-gray-300 p-2">النهاية</th>
              <th className="border border-gray-300 p-2">ملاحظة</th>
              <th className="border border-gray-300 p-2">الأيام</th>
              <th className="border border-gray-300 p-2">حذف الشهر</th>

            </tr>
          </thead>
          <tbody>
            {data?.map((month: IMonth) => (
              <tr key={month._id}>
                <td className="border border-gray-300 p-2 ">{month?.month}</td>
                <td className="border border-gray-300 p-2 ">{month.start}</td>
                <td className="border border-gray-300 p-2 ">{month.end}</td>
                <td className="border border-gray-300 p-2 ">{month.note}</td>
                <td className="border border-gray-300 p-2  flex gap-1">
                  <Link to={`/days/${month._id}`}>
                    <Button size="sm">عرض الأيام</Button>
                  </Link>
                 
                </td>
                <td className="border border-gray-300 p-2 ">
                <Button
                      onClick={() => {
                        setIsOpenDelete(true);
                        setIdDay(month._id);}}
                      size="sm"
                      variant="danger"
                    >
                      <BsTrash size={17} />
                    </Button>
                  </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
         <Modal title="تأكيد الحذف" isopen={isOpenDelete} closeModal={() => setIsOpenDelete(false)}>
        <p className="text-right">حذف هذا الشهر ؟</p>
        <div className="flex justify-start gap-2 mt-4">
          <Button  type="submit" isloading={isDeleting} onClick={handleDelete} variant="danger">حذف</Button>
          <Button type="button" onClick={() =>{
            setIsOpenDelete(false)
      } 
          }>إلغاء</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Cvilizedregion;
