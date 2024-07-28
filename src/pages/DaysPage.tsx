import { NavLink, useParams } from "react-router-dom";
import Input from "../components/ui/Input";
import { useState } from "react";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import {
  useCreateDayesMutation,
  useDeleteDayeMutation,
  useGetManthesQuery,
} from "../app/Api/Cvilizedregion";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { successmsg } from "../toastifiy";
import { BsTrash } from "react-icons/bs";

interface IOption {
  value: string;
  label: string;
}
interface IFormInput {
  day: IOption | null;
  date: string;
}
interface Idayes {
  _id:string
  day: string | null;
  date: string;

}
const dayOptions: IOption[] = [
  { value: "sunday", label: "سبت" },
  { value: "monday", label: "أحد" },
  { value: "tuesday", label: "الاثنين" },
  { value: "wednesday", label: "الثلاثاء" },
  { value: "thursday", label: "الاربعاء" },
  { value: "friday", label: "الخميس" },
  { value: "saturday", label: "الجمعه" },
];
interface IMonth {
  _id: string;
  month: string | null;
  start: string;
  end: string;
  note: string;
}

const DaysPage = () => {
  const { monthId } = useParams();
  console.log(monthId);
  const [createDaye , {isLoading}] = useCreateDayesMutation({});
  const { data , refetch , isLoading : isLoadingGet } = useGetManthesQuery({});
  const [deleteDaye , {isLoading : isDeleting}] = useDeleteDayeMutation({})
  console.log(data?.days);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete ] = useState(false);
  const [idDay , setIdDay] = useState("")

  const { register, handleSubmit, control, reset } = useForm<IFormInput>();
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    const formattedData = {
      day: data?.day?.label,
      date: data?.date,
    };
  
   
  
    createDaye({ id: monthId, data: formattedData })
      .unwrap()
      .then((response) => {
        setIsOpen(false);
        console.log('Response:', response);
        reset();
        refetch()
        successmsg({ msg: "تم اضافه اليوم بنجاح !" });
      })
      .catch((error) => {
        console.error("Failed to create day:", error);
      });
  };
  
  const monthData = data?.find((month: IMonth) => month._id === monthId);

  const handleDelete = () => {

    deleteDaye({dayId:idDay , monthId:monthId})
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
    <div className="mt-20 p-4" dir="rtl">
      <div className="mb-4">
        <div className="flex justify-between items-center">

      <h2 className="text-2xl font-bold mb-4">أيام الشهر</h2>
        <Button onClick={() => setIsOpen(true)}>اضافه يوم جديد</Button>
        </div>
        <Modal
          title="اضافه يوم جديد"
          isopen={isOpen}
          closeModal={() => setIsOpen(false)}
        >
          <form onSubmit={handleSubmit(onSubmit)} dir="rtl">
            <div className="mb-2 space-y-1 text-right">
              <label htmlFor="month">اليوم</label>
              <Controller
                name="day"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={dayOptions}
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
              <label htmlFor="dayDate">التاريخ</label>
              <Input
                {...register("date")}
                id="dayDate"
                placeholder="التاريخ"
                type="date"
              />
            </div>

            <div className="flex justify-end gap-1">
              <Button isloading={isLoading} type="submit">حفظ</Button>
              <Button type="button" variant="danger" onClick={() => setIsOpen(false)}>
                اغلاق
              </Button>
            </div>
          </form>
        </Modal>
      </div>
      {isLoadingGet ? (
        <p>Loading...</p>
      ) : data?.length === 0 ? (
        <p>لا توجد بيانات لعرضها.</p>
      ) : (
        <div>
          {monthData ? (
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">اليوم</th>
                  <th className="border border-gray-300 p-2">التاريخ</th>
                  <th className="border border-gray-300 p-2">الكشوفات</th>
                </tr>
              </thead>
              <tbody>
                {monthData.days.length > 0 ? (
                  monthData.days.map((day:Idayes ) => (
                    <tr key={day._id}>
                      <td className="border border-gray-300 p-2">{day.day}</td>
                      <td className="border border-gray-300 p-2">{day.date}</td>
                      <td className="border border-gray-300 p-2">
                        <div className="flex justify-center gap-3">
                        <NavLink to={`/dayes/${day._id}/${monthId}`} >
                        <Button >تسجيل حضور اللاعبين</Button>
                        </NavLink>

                        <NavLink to={`/attendance/${day._id}/${monthId}`}>
                        <Button >تسجيل حضور المدربين</Button>
                        </NavLink>

                        <NavLink to={`/Reports/${day._id}/${monthId}`}>
                        <Button >الكشوفات</Button>
                        </NavLink>

                        <Button
                      onClick={() => {
                        setIsOpenDelete(true);
                        setIdDay(day._id);}}
                      size="sm"
                      variant="danger"
                    >
                      <BsTrash size={17} />
                    </Button>



                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="border border-gray-300 p-2 text-center">
                      لا توجد أيام لعرضها.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <p>لم يتم العثور على بيانات الشهر.</p>
          )}
        </div>
      )}
      
      <Modal title="تأكيد الحذف" isopen={isOpenDelete} closeModal={() => setIsOpenDelete(false)}>
        <p className="text-right">حذف هذا اليوم ؟</p>
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

export default DaysPage;
