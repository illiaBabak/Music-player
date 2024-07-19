import { useContext } from 'react';
import { GlobalContext } from 'src/root';
import { ChipType } from 'src/types/types';
import { CHIPS } from 'src/utils/constants';

export const Chips = (): JSX.Element => {
  const { selectedSection, setSelectedSection } = useContext(GlobalContext);

  const handleChipClick = (chip: ChipType) => setSelectedSection(chip);

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