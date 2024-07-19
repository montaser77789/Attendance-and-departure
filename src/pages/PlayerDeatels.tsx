import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";

const PlayerDetails = () => {
  const { playerId } = useParams();

  // Static player data
  const player = {
    image: "https://i.pinimg.com/1200x/a3/11/f5/a311f515ee23f8cca912022cb64d633f.jpg", // Replace with your placeholder image URL
    name: "محمد علي",
    dateOfBirth: "01/01/1990",
    mobileNumber: "+966123456789",
    nationality: "سعودي",
    idNumber: "1234567890",
    category: "الفئة العمرية",
    coach: "المدرب أحمد"
  };

  const handleGenerateReport = () => {
    // Logic for generating the report
    alert(`Report for player ID ${playerId} generated.`);
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/3">
          <img src={player.image} alt="Player" className="rounded-full w-48 h-48 object-cover mx-auto" />
        </div>
        <div className="w-full md:w-2/3 mt-4 md:mt-0 md:ml-6 text-right">
          <h2 className="text-2xl font-bold mb-2">{player.name}</h2>
          <p className="mb-2"><strong>تاريخ الميلاد:</strong> {player.dateOfBirth}</p>
          <p className="mb-2"><strong>رقم الجوال:</strong> {player.mobileNumber}</p>
          <p className="mb-2"><strong>الجنسية:</strong> {player.nationality}</p>
          <p className="mb-2"><strong>رقم الهوية:</strong> {player.idNumber}</p>
          <p className="mb-2"><strong>الفئة:</strong> {player.category}</p>
          <p className="mb-2"><strong>المدرب المسئول:</strong> {player.coach}</p>
          <Button
            onClick={handleGenerateReport}
          >
            عمل تقرير
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;
