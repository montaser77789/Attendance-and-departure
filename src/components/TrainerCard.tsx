import { memo, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  useDeleteTrainerMutation,
  useGetTrainersQuery,
} from "../app/Api/TrainerApiSlice";
import LazyLoad from "react-lazyload";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import { errormsg, successmsg } from "../toastifiy";
import { Player } from "../interfaces";
import { BsTrash } from "react-icons/bs";
import AOS from "aos";
import "aos/dist/aos.css";

const TrainerCard = ({ trainer, index }: { trainer: Player, index: number }) => {
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS
  }, []);

  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [deleteTrainer, { isLoading: isDeleting }] = useDeleteTrainerMutation();
  const { refetch } = useGetTrainersQuery({});

  const handleDelete = () => {
    if (selectedTrainerId) {
      deleteTrainer(selectedTrainerId)
        .unwrap()
        .then(() => {
          successmsg({ msg: "تم الحذف بنجاح" });
          refetch();
          setIsOpenDelete(false);
          setSelectedTrainerId(null);
        })
        .catch((error) => {
          errormsg({ msg: `${error}` });
          console.error("Failed to delete trainer:", error);
        });
    }
  };

  // Alternate animations based on index
  const animations = ["fade-up", "zoom-in", "fade-down", "zoom-out"];
  const animation = animations[index % animations.length];

  return (
    <div>
      <div
        data-aos={animation}
        className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
      >
        <LazyLoad height={200} offset={100}>
          <img
            src={trainer.picture || "/path/to/default-image.jpg"}
            alt={trainer.name}
            className="h-72 w-full object-cover"
          />
        </LazyLoad>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {trainer.name}
          </h3>
          <p className="text-gray-700 mb-1 text-xl">
            رقم الجوال:{" "}
            <span className="text-gray-500">{trainer.mobile}</span>
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
        <p className="text-right">هل أنت متأكد أنك تريد حذف هذا المدرب؟</p>
        <div className="flex justify-start mt-4 gap-2">
          <Button onClick={() => setIsOpenDelete(false)}>إلغاء</Button>
          <Button
            isloading={isDeleting}
            onClick={handleDelete}
            variant="danger"
          >
            حذف
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default memo(TrainerCard);
