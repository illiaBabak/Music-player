import { useSearchParams } from 'react-router-dom';
import { ChipType, InitializeChipType } from 'src/types/types';
import { CHIPS, INITIALIZE_CHIPS } from 'src/utils/constants';

type Props = {
  isInitialize: boolean;
};

export const Chips = ({ isInitialize }: Props): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSection = searchParams.get('section');

  const handleChipClick = (chip: ChipType | InitializeChipType) =>
    setSearchParams((prev) => {
      prev.set('section', chip);
      return prev;
    });

  return (
    <div className='d-flex p-2 chips-container'>
      {(isInitialize ? INITIALIZE_CHIPS : CHIPS).map((chip) => (
        <div
          key={chip}
          className={`chip m-2 p-2 d-flex justify-content-center text-white ${selectedSection === chip ? 'selected' : ''}`}
          onClick={() => handleChipClick(chip)}
        >
          {chip}
        </div>
      ))}
    </div>
  );
};
