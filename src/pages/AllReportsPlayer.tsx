import { useState } from "react";
import {
  useDeleteMonthReportsMutation,
  useGetOldManthesQuery,
} from "../app/Api/Cvilizedregion"; // Adjust the import as needed
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import { successmsg } from "../toastifiy";

interface Player {
  user_id: string;
  user_name: string;
  present: number;
  absent: number;
}

interface MonthData {
  month: string;
  _id: string;
  players?: Player[];
}

const AllReportsPlayer = () => {
  const { data, error, isLoading, refetch } = useGetOldManthesQuery({});
  const [deleteMonth] = useDeleteMonthReportsMutation();
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [monthIdToDelete, setMonthIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (monthIdToDelete) {
      setIsDeleting(true);
      deleteMonth({ monthId: monthIdToDelete })
        .unwrap()
        .then((response) => {
          setIsOpenDelete(false);
          setIsDeleting(false);
          refetch();
          console.log(response);
          successmsg({msg : `${response}`})

          // Success message handling here
        })
        .catch((error) => {
          console.error("Failed to delete month:", error);
          setIsOpenDelete(false);
          setIsDeleting(false);
          // Error message handling here
        });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    console.error("Error fetching data:", error);
    return <p>Error fetching data.</p>;
  }

  return (
    <div dir="rtl" className="container mx-auto p-4 mt-20">
      {data && data.length > 0 ? (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">الشهر</th>
              <th className="border border-gray-300 p-2">الطلاب</th>
              <th className="border border-gray-300 p-2">حذف</th>
            </tr>
          </thead>
          <tbody>
            {data.map((monthData: MonthData) => (
              <tr key={monthData._id}>
                <td className="border border-gray-300 p-2">
                  {monthData.month}
                </td>
                <td className="border border-gray-300 p-2">
                  {monthData.players && monthData.players.length > 0 ? (
                    <ul className="list-disc pl-6">
                      {monthData.players.map((player) => (
                        <li key={player.user_id} className="mb-2">
                          <span className="font-semibold">
                            {player.user_name}
                          </span>{" "}
                          - <span>حضور: {player.present}</span> -{" "}
                          <span>غياب: {player.absent}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>لا يوجد لاعبين متاحين لهذا الشهر.</p>
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => {
                      setIsOpenDelete(true);
                      setMonthIdToDelete(monthData._id);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>لا يوجد تقارير متاحة.</p>
      )}

      {isOpenDelete && (
        <Modal
          title="تأكيد الحذف"
          isopen={isOpenDelete}
          closeModal={() => setIsOpenDelete(false)}
        >
          <p className="text-right">حذف هذا الشهر ؟</p>
          <div className="flex justify-start gap-2 mt-4">
            <Button
              type="submit"
              isloading={isDeleting}
              onClick={handleDelete}
              variant="danger"
            >
              حذف
            </Button>
            <Button type="button" onClick={() => setIsOpenDelete(false)}>
              إلغاء
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AllReportsPlayer;
