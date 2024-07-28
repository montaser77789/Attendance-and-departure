import { memo, useState } from "react";
import {
  useDeleteTrainerMutation,
  useGetTrainersQuery,
} from "../app/Api/TrainerApiSlice";
import LazyLoad from "react-lazyload";
import { NavLink } from "react-router-dom";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import { errormsg, successmsg } from "../toastifiy";
import { Player } from "../interfaces";
import { BsTrash } from "react-icons/bs";

const TrainerCard = ({ trainer }: { trainer: Player }) => {
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>("");
  const [deleteTrainer, { isLoading: isDeleting }] = useDeleteTrainerMutation();
  const { refetch } = useGetTrainersQuery({});
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  const handleDelete = () => {
    if (selectedTrainerId) {
      console.log(selectedTrainerId);

      deleteTrainer(selectedTrainerId)
        .unwrap()
        .then((response) => {
          console.log(response);
          successmsg({ msg: `${response}` });
          refetch();
          setIsOpenDelete(false);
          setSelectedTrainerId("");
        })
        .catch((error) => {
          errormsg({ msg: `${error}` });
          console.error("Failed to delete player:", error);
        });
    }
  };
  return (
    <div>
      <div
        key={trainer._id}
        className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
      >
        <LazyLoad height={200} offset={100}>
          <img
            src={
              trainer.picture ? trainer.picture : "/path/to/default-image.jpg"
            }
            alt={trainer.name}
            className="h-72 w-full "
          />
        </LazyLoad>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {trainer.name}
          </h3>
          <p className="text-gray-700 mb-1 text-xl">
          رقم الجوال:{" "}
            <span className="text-gray-500"> {trainer.mobile}</span>
          </p>
        
          <div className="flex justify-between items-center mt-auto">
            <NavLink to={`/trainers/${trainer._id}`}>
              <Button size="sm">تفاصيل</Button>
            </NavLink>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSelectedTrainerId(trainer._id);
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
      <Modal
        title="حذف المدرب"
        isopen={isOpenDelete}
        closeModal={() => setIsOpenDelete(false)}
      >
        <p className="text-right" dir="rtl">
          هل أنت متأكد أنك تريد حذف هذا المدرب؟
        </p>
        <div className="flex justify-start mt-4">
          <Button onClick={() => setIsOpenDelete(false)}>الغاء</Button>
          <Button
            isloading={isDeleting}
            onClick={handleDelete}
            className="ml-2"
            variant="danger"
          >
            حذف
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default memo(TrainerCard) ;
