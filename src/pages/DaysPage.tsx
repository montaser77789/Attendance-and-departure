import { useParams } from "react-router-dom";
import Input from "../components/ui/Input";
import Select from "react-select";
import { useState } from "react";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

// Define options for days of the week
const dayOptions = [
  { value: "sunday", label: "سبت" },
  { value: "monday", label: "أحد" },
  { value: "tuesday", label: "الاثنين" },
  { value: "wednesday", label: "الثلاثاء" },
  { value: "thursday", label: "الاربعاء" },
  { value: "friday", label: "الخميس" },
  { value: "saturday", label: "الجمعه" },
];

const DaysPage = () => {
  const { monthId } = useParams();
  console.log(monthId); 
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay] = useState(null);

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
          <form dir="rtl">
            <div className="mb-2 space-y-1 text-right">
              <label htmlFor="day">اليوم</label>
              <div className="relative">
                <Select
                  id="day"
                  value={selectedDay}
                  options={dayOptions}
                  placeholder="اختر اليوم"
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
                />
              </div>
            </div>

            <div className="mb-2 space-y-1 text-right">
              <label htmlFor="dayDate">التاريخ</label>
              <Input
                id="dayDate"
                placeholder="التاريخ"
                type="date"
              />
            </div>

            <div className="flex justify-end gap-1">
              <Button type="submit">حفظ</Button>
              <Button variant="danger" onClick={() => setIsOpen(false)}>اغلاق</Button>
            </div>
          </form>
        </Modal>
      </div>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">اليوم</th>
            <th className="border border-gray-300 p-2">التاريخ</th>
            <th className="border border-gray-300 p-2">الكشوفات</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">السبت</td>
            <td className="border border-gray-300 p-2">12/12/2022</td>
            <td className="border border-gray-300 p-2">
              <Button>كشف اللاعبين</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DaysPage;
