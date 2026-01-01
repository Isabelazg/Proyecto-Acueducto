import { useNavigate } from 'react-router-dom';

export function usePeriodNav() {
  const navigate = useNavigate();

  const handlePeriodChange = (e) => {
    navigate(`/periodo/${e.target.value}`);
  };

  return {
    handlePeriodChange,
  };
}