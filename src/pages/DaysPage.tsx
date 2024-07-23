import { NavLink, useParams } from "react-router-dom";
import Input from "../components/ui/Input";
import { useState } from "react";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import {
  useCreateDayesMutation,
  useGetManthesQuery,
} from "../app/Api/Cvilizedregion";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { successmsg } from "../toastifiy";

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
  console.log(data?.days);
  const [isOpen, setIsOpen] = useState(false);
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
  console.log(monthData);
  

  return (
    <div className="mt-20 container p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">أيام الشهر</h1>
      <div className="mb-4">
        <Button onClick={() => setIsOpen(true)}>اضافه يوم جديد</Button>
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
          <h2 className="text-xl font-bold mb-4">الأيام</h2>
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
                        <div className="flex gap-1">
                        <NavLink to={`/dayes/${day._id}/${monthId}`} >
                        <Button >تسجيل حضور اللاعبين</Button>
                        </NavLink>

                        <NavLink to={`/attendance/${day._id}/${monthId}`}>
                        <Button >تسجيل حضور المدربين</Button>
                        </NavLink>

                        <NavLink to={`/Reports/${day._id}/${monthId}`}>
                        <Button >الكشوفات</Button>
                        </NavLink>


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
    </div>
  );
};

export default DaysPage;
