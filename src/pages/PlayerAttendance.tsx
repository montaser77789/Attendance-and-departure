import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetPlayersQuery } from '../app/Api/PlayerSliceApi';
import { RootState } from '../app/store';
import { toggleAttendance } from '../app/playerAttendance';
import { usePlyerAttendanceMutation } from '../app/Api/Cvilizedregion';
import Button from '../components/ui/Button';
import { errormsg, successmsg } from '../toastifiy';

interface IPlayer {
    _id: string;
    name: string;
    coach: string;
}

const PlayerAttendance: React.FC = () => {
    const { dayId, monthId } = useParams<{ dayId: string; monthId: string }>();
    const { data, isLoading } = useGetPlayersQuery({});
    const dispatch = useDispatch();
    const { playerAttendance, playerIds } = useSelector((state: RootState) => state.playerAttendance);

    const [plyerAttendance, { isLoading: isSubmitting }] = usePlyerAttendanceMutation();

    const handleAttendanceChange = (playerId: string) => {
        dispatch(toggleAttendance({ playerId }));
    };

    const handleSubmit = () => {
        plyerAttendance({
            dayId: dayId || '',
            monthId: monthId || '',
            player_ids: [...playerIds],
        })
        .unwrap()
        .then((response) => {
            successmsg({ msg: `${response.message}` });
            console.log(response)
        })
        .catch((error) => {
            console.error("Failed to create day:", error);
            errormsg({ msg: `${response.message}`   });
        });
    };


    return (
        <div dir="rtl" className="mt-20">
            {isLoading ? (
                <p>جاري التحميل...</p>
            ) : data?.length === 0 ? (
                <p>لا توجد بيانات لعرضها.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">اللاعب</th>
                            <th className="border border-gray-300 p-2">المدرب المسئول</th>
                            <th className="border border-gray-300 p-2">تسجيل الحضور</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((player: IPlayer) => (
                            <tr key={player._id}>
                                <td className="border border-gray-300 p-2">{player.name}</td>
                                <td className="border border-gray-300 p-2">{player.coach}</td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="checkbox"
                                        className="h-6 w-6 rounded border-gray-300 focus:ring-0 checked:bg-blue-600 checked:border-transparent"
                                        checked={!!playerAttendance[player._id]}
                                        onChange={() => handleAttendanceChange(player._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div>
                <Button type="submit" onClick={handleSubmit} isloading={isSubmitting}>
                    {isSubmitting ? 'جاري التسجيل...' : 'تسجيل الحضور'}
                </Button>
            </div>
        </div>
    );
};

export default PlayerAttendance;
