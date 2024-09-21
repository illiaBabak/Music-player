import { useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GlobalContext } from 'src/root';

type Props = {
  chips: string[];
};

export const Chips = ({ chips }: Props): JSX.Element => {
  const { isMobile } = useContext(GlobalContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSection = searchParams.get('section');

  const handleChipClick = (chip: string) =>
    setSearchParams((prev) => {
      prev.set('section', chip);
      return prev;
    });

  return (
    <div className={`d-flex flex-wrap ${isMobile ? 'p-3' : 'p-2'} chips-container`}>
      {chips.map((chip, index) => (
        <div
          key={`chip-key-${chip}-${index}`}
          className={`chip ${isMobile ? 'p-1 m-1' : 'p-2 m-2'} d-flex border-0 justify-content-center align-items-center text-white ${selectedSection === chip ? 'selected' : ''}`}
          onClick={() => handleChipClick(chip)}
        >
          {chip}
        </div>
      ))}
    </div>
  );
};
