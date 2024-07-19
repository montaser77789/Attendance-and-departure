// import { BsTrash } from "react-icons/bs";
// import Button from "../components/ui/Button";
// import { CiEdit } from "react-icons/ci";
// import { NavLink } from "react-router-dom";

// const Players = () => {
//     return (
//       <div className="w-full flex flex-col pt-2">
//         <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
//           <thead className="ltr:text-left rtl:text-right">
//             <tr>
//             <th className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 تفاصيل   
//               </th>
//             <th className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 حذف وتعديل 
//               </th>
             
//               <th className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 رقم الجوال
//               </th>
//               <th className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 الجنسيه
//               </th>
//               <th className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 رقم الهويه
//               </th>
//               <th className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 الفئه
//               </th>
//               <th className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 المدرب المسئول
//               </th>
          
//               <th className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 اسم اللاعب
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             <tr className="bg-gray-50">
//             <td className="whitespace-nowrap text-right  px-4 py-2 font-medium text-gray-900">
//                 <NavLink to={"/sss"}>
//                 <Button>تفاصيل</Button>

//                 </NavLink>
//             </td>

//             <td className="whitespace-nowrap text-right  px-4 py-2 font-medium text-gray-900">
//                         <div className="flex space-x-2 justify-end ">
//                           <Button
                           
//                             size={"sm"}
//                             variant={"danger"}
//                           >
//                             <BsTrash size={17} className="mr-1" />
//                           </Button>
//                           <Button
//                             className="mr-1"
//                             size={"sm"}
                          
//                           >
//                             <CiEdit size={17} />
//                           </Button>
//                         </div>
//                       </td>
//               <td className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 01007791095
//               </td>
//               <td className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 مصري
//               </td>
//               <td className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 363623453
//               </td>
//               <td className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 فريق اول
//               </td>
//               <td className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 احمد 
//               </td>
//               <td className="whitespace-nowrap text-right px-4 py-2 font-medium text-gray-900">
//                 علي 
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     );
//   };
  
//   export default Players;

import { useState } from "react";
import { BsTrash } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import Button from "../components/ui/Button";
import { NavLink } from "react-router-dom";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";

const Players = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);


  const players = [
    {
      id: 1,
      name: "علي",
      nationality: "مصري",
      idNumber: "363623453",
      image: "https://i.pinimg.com/1200x/a3/11/f5/a311f515ee23f8cca912022cb64d633f.jpg", // Replace with actual image path
    },
    {
      id: 2,
      name: "أحمد",
      nationality: "سعودي",
      idNumber: "123456789",
      image: "https://i.pinimg.com/1200x/a3/11/f5/a311f515ee23f8cca912022cb64d633f.jpg", // Replace with actual image path
    },
  ];

  const filteredPlayers = players.filter(player =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full p-4 mt-20" dir="rtl">
      <div className="flex justify-between gap-2 flex-wrap w-full mb-4 w">
        <div className="md:w-[40%] w-[100%]">

        <Input
          type="text"
          placeholder="بحث"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        </div>
        <div className="md:w-auto w-[100%]  flex justify-center">

        <Button  className="align-center w-[100%]"  onClick={() => setIsOpen(true)}>اضافه لاعب جديد</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col"
          >
            <img
              src={player.image}
              alt={player.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{player.name}</h3>
              <p className="text-gray-700 mb-1 text-xl">
                الجنسية:<span className="text-gray-500"> {player.nationality}</span>
              </p>
              <p className="text-gray-700 mb-4 text-xl">
                رقم الهوية:<span className="text-gray-500"> {player.idNumber}</span>
              </p>
              <div className="flex justify-between items-center mt-auto">
                <NavLink to={`/players/${player.id}`}>
                  <Button size="sm">تفاصيل</Button>
                </NavLink>
                <div className="flex gap-2">
                  <Button onClick={() => setIsOpenDelete(true)} size="sm" variant="danger">
                    <BsTrash size={17} />
                  </Button>
                  <Button size="sm">
                    <CiEdit size={17} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal    title="اضافه لاعب جديد" isopen={isOpen} closeModal={() => setIsOpen(false)} >
        <form dir="rtl"  >
        <div className="mb-2 space-y-1 text-right">
            <label htmlFor="playername ">اسم اللاعب:</label>
            <Input id="playername" placeholder="اسم اللاعب" type="text"/>
            </div>
            <div className="mb-2 space-y-2 text-right">
            <label htmlFor="player ">صوره اللاعب:</label>
            <Input id="player" placeholder="صوره اللاعب" type="file"/>
            </div>
            <div className="mb-2 space-y-2 text-right">
            <label htmlFor="playerbirthday ">تاريخ الميلاد :</label>
            <Input id="playerbirthday" placeholder="تاريخ الميلاد " type="date"/>
            </div>
            <div className="mb-2 space-y-2 text-right">
            <label htmlFor="number">رقم الجوال:</label>
            <Input id="number" placeholder="رقم الجوال" type="text"/>
            </div>
            <div className="mb-2 space-y-2 text-right">
            <label htmlFor="internationality">الجنسيه:</label>
            <Input id="internationality" placeholder="الجنسيه" type="text"/>
            </div>
            <div className="mb-2 space-y-2 text-right">
            <label htmlFor="nationality">رقم الهويه:</label>
            <Input id="nationality" placeholder="رقم الهويه" type="text"/>
            </div>
            <div className="mb-2 space-y-2 text-right">
            <label htmlFor="nationality"> الفئه:</label>
            <Input id="nationality" placeholder="رقم الهويه" type="text"/>
            </div>
            <div className="mb-2 space-y-2 text-right">
            <label htmlFor=""> المدرب المسئول:</label>
            <Input id="" placeholder="المدرب المسئول" type="text"/>
            </div>
            <div className="flex justify-end items-center gap-2">
            <Button >اضافه</Button>
                <Button variant="danger" type="button" onClick={() => setIsOpen(false)}>الغاء</Button>
            </div>
        </form>
      </Modal>
      <Modal  title="هل انت متاكد من حذف هذا اللاعب؟" isopen={isOpenDelete} closeModal={() => setIsOpenDelete(false)}>
        <div dir="rtl" className="flex justify-end items-center gap-2">
            <Button  variant="danger">حذف</Button>
            <Button onClick={() => setIsOpenDelete(false)}>الغاء</Button>
        </div>

      </Modal>
    </div>
  );
};

export default Players;


  