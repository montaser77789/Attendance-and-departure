import { memo } from "react";
import { NavLink } from "react-router-dom";
import { Player } from "../interfaces";
import { useState } from "react";
import {
  useDeletePlayerMutation,
  useGetPlayersQuery,
} from "../app/Api/PlayerSliceApi";
import { successmsg } from "../toastifiy";
import Modal from "./ui/Modal";
import { BsTrash } from "react-icons/bs";
import Button from "./ui/Button";
import LazyLoad from "react-lazyload";

const Playercard = ({ player }: { player: Player }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const { refetch } = useGetPlayersQuery({});
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [deletePlayer, { isLoading: isDeleting }] = useDeletePlayerMutation();

  const handleDelete = () => {
    if (selectedPlayerId) {
      deletePlayer(selectedPlayerId)
        .unwrap()
        .then(() => {
          refetch();
          setIsOpenDelete(false);
          setSelectedPlayerId(null);
          successmsg({ msg: "تم الحذف بنجاح" });
        })
        .catch((error) => {
          console.error("Failed to delete player:", error);
        });
    }
  };

  return (
    <div>
      <div
        key={player._id}
        className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
      >
        <LazyLoad height={200} offset={100}>
          <img
            src={player.picture}
            alt={player.name}
            className="w-full h-48 object-cover"
          />
        </LazyLoad>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {player.name}
          </h3>
          <p className="text-gray-700 mb-1 text-xl">
            الجنسية: <span className="text-gray-500">{player.nationality}</span>
          </p>
          <p className="text-gray-700 mb-4 text-xl">
            رقم الهوية:{" "}
            <span className="text-gray-500">{player.card_Number}</span>
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
      <Modal
        title="تأكيد الحذف"
        isopen={isOpenDelete}
        closeModal={() => setIsOpenDelete(false)}
      >
        <p className="text-right">هل أنت متأكد من أنك تريد حذف هذا اللاعب؟</p>
        <div className="flex justify-start gap-2 mt-4">
          <Button
            isloading={isDeleting}
            type="button"
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
    </div>
  );
};

export default memo(Playercard);
