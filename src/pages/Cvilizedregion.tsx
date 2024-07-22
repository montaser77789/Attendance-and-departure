import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Select from "react-select";

const monthOptions = [
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

const monthsData = [
  { id: 1, month: "يناير", startDate: "2024-01-01", endDate: "2024-01-31" },
  { id: 2, month: "فبراير", startDate: "2024-02-01", endDate: "2024-02-29" },
];



const Cvilizedregion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMonth] = useState(null);

  return (
    <div className="mt-20 container p-4" dir="rtl">
      <div>
        <Button onClick={() => setIsOpen(true)}>اضافه شهر جديد</Button>
      </div>

      <Modal
        title="اضافه شهر جديد"
        isopen={isOpen}
        closeModal={() => setIsOpen(false)}
      >
        <form dir="rtl">
          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="month">الشهر</label>
            <Select
              id="month"
              value={selectedMonth}
              options={monthOptions}
              placeholder="اختر الشهر"
              className="basic-single"
              classNamePrefix="select"
            />
          </div>

          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="startDate">بدايه الشهر</label>
            <Input id="startDate" placeholder="بدايه الشهر" type="date" />
          </div>

          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="endDate">نهايه الشهر</label>
            <Input id="endDate" placeholder="نهايه الشهر" type="date" />
          </div>

          <div className="mb-2 space-y-1 text-right">
            <label htmlFor="notes">ملاحظات</label>
            <Input id="notes" placeholder="ملاحظات" type="text" />
          </div>
          <div className="flex justify-end gap-1">
            <Button>حفظ</Button>
            <Button variant="danger" onClick={() => setIsOpen(false)}>اغلاق</Button>
          </div>
        </form>
      </Modal>

      {/* Display months in a table */}
      <table className="mt-6 w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">الشهر</th>
            <th className="border border-gray-300 p-2">بدايه الشهر</th>
            <th className="border border-gray-300 p-2">نهايه الشهر</th>
            <th className="border border-gray-300 p-2">عرض الأيام</th>
          </tr>
        </thead>
        <tbody>
          {monthsData.map((month) => (
            <tr key={month.id}>
              <td className="border border-gray-300 p-2">{month.month}</td>
              <td className="border border-gray-300 p-2">{month.startDate}</td>
              <td className="border border-gray-300 p-2">{month.endDate}</td>
              <td className="border border-gray-300 p-2">
                <Link to={`/days/${month.id}`}>
                  <Button size="sm">عرض الأيام</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cvilizedregion;
