import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { toggleAttendance, clearAttendance } from '../app/TrainerAttendance';
import { useTrainerAttendanceMutation } from '../app/Api/Cvilizedregion';
import Button from '../components/ui/Button';
import { errormsg, successmsg } from '../toastifiy';
import { useGetTrainersQuery } from '../app/Api/TrainerApiSlice';

interface ITrainer {
    _id: string;
    name: string;
}

const TrainerAttendance: React.FC = () => {
    const { dayId, monthId } = useParams<{ dayId: string; monthId: string }>();
    const { data, isLoading } = useGetTrainersQuery({});
    const dispatch = useDispatch();
    const { trainerAttendance, trainerIds } = useSelector((state: RootState) => state.trainerAttendance);

    const [trainerAttendanceMutation, { isLoading: isSubmitting }] = useTrainerAttendanceMutation();

    const handleAttendanceChange = (trainerId: string) => {
        dispatch(toggleAttendance({ trainerId }));
    };

    const handleSubmit = () => {
        trainerAttendanceMutation({
            dayId: dayId || '',
            monthId: monthId || '',
            coach_ids: [...trainerIds],
        })
        .unwrap()
        .then((response) => {
            successmsg({ msg: `${response.message}` });
            console.log(response);
            dispatch(clearAttendance()); 
        })
        .catch((error) => {
            console.error("Failed to create day:", error);
            errormsg({ msg: `${error?.data?.message}`  });
            dispatch(clearAttendance()); 

        });
    };

    return (
        <div dir="rtl" className="mt-20   p-4 container">
            {isLoading ? (
                <p>جاري التحميل...</p>
            ) : data?.length === 0 ? (
                <p>لا توجد بيانات لعرضها.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">المدرب</th>
                            <th className="border border-gray-300 p-2">تسجيل الحضور</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((trainer: ITrainer) => (
                            <tr key={trainer._id}>
                                <td className="border border-gray-300 p-2">{trainer.name}</td>
                                <td className="border border-gray-300 p-2">
                                    <input
                                        type="checkbox"
                                        className="h-6 w-6 rounded border-gray-300 focus:ring-0 checked:bg-blue-600 checked:border-transparent"
                                        checked={!!trainerAttendance[trainer._id]}
                                        onChange={() => handleAttendanceChange(trainer._id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <div className='flex justify-end mt-2'>
                <Button type="submit" onClick={handleSubmit} isloading={isSubmitting}>
                    {isSubmitting ? 'جاري التسجيل...' : 'تسجيل الحضور'}
                </Button>
            </div>
        </div>
    );
};

export default TrainerAttendance;
