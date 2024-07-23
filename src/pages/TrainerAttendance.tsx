import { useParams } from 'react-router-dom';

const TrainerAttendance = () => {
    const { dayId, monthId } = useParams();
    console.log(dayId, monthId);
  return (
    <div>
      
    </div>
  )
}

export default TrainerAttendance
