import { useSearchParams } from 'react-router-dom';
import { ChipType } from 'src/types/types';
import { CHIPS } from 'src/utils/constants';

export const Chips = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSection = searchParams.get('section');

  const handleChipClick = (chip: ChipType) =>
    setSearchParams((prev) => {
      prev.set('section', chip);
      return prev;
    });

  return (
    <div className='d-flex p-2 chips-container'>
      {CHIPS.map((chip) => (
        <div
          key={chip}
          className={`chip m-2 p-2 d-flex justify-content-center ${selectedSection === chip ? 'selected' : ''}`}
          onClick={() => handleChipClick(chip)}
        >
          {chip}
        </div>
      ))}
    </div>
  );
};
