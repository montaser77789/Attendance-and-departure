import { useParams } from 'react-router-dom';

const Reports = () => {
    const { dayId, monthId } = useParams();
    console.log(dayId, monthId);
    
  return (
    <div>
      
    </div>
  )
}

export default Reports
