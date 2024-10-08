import { useParams } from 'react-router-dom';
import { useGetAudienceQuery } from '../app/Api/Cvilizedregion';
import { FaCheck, FaTimes } from 'react-icons/fa'; // Import icons

interface IPlayer {
  _id: string;
  user_name: string;
  role: string;
  present: number;
  absent: number;
}

const Audience = () => {
  const { dayId, monthId } = useParams<{ dayId: string; monthId: string }>();

  const { data, isLoading } = useGetAudienceQuery({ dayId, monthId });
  console.log(data);
  

  const attendees = data?.attendees_data || [];
  const coaches = attendees.filter((person: IPlayer) => person.role === 'coach');
  const players = attendees.filter((person: IPlayer) => person.role === 'player');

  return (
    <div dir="rtl" className="mt-20 p-4">
      {isLoading ? (
        <p>جاري التحميل...</p>
      ) : (
        <>
          {/* Display Coaches */}
          {coaches.length > 0 ? (
            <table className="w-full border-collapse border border-gray-200 mb-6">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">المدرب</th>
                </tr>
              </thead>
              <tbody>
                {coaches.map((coach: IPlayer) => (
                  <tr key={coach._id}>
                    <td className="border border-gray-300 p-2">{coach.user_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>لم يتم تسجيل أي مدرب لهذا اليوم.</p>
          )}

          {/* Display Players */}
          {players.length > 0 ? (
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">اللاعب</th>
                  <th className="border border-gray-300 p-2">الحضور</th> {/* New column for attendance */}
                </tr>
              </thead>
              <tbody>
                {players.map((player: IPlayer) => (
                  <tr key={player._id}>
                    <td className="border border-gray-300 p-2">{player.user_name}</td>
                    <td className="border border-gray-300 p-2">
                      {player.present ? 'تم الحضور' : 'لم يحضر'}
                      {' '}
                      {player.present ? <FaCheck color="green" /> : <FaTimes color="red" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>لم يتم تسجيل أي لاعب لهذا اليوم.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Audience;
