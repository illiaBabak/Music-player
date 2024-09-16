import { useSearchParams } from 'react-router-dom';

type Props = {
  chips: string[];
};

export const Chips = ({ chips }: Props): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSection = searchParams.get('section');

  const handleChipClick = (chip: string) =>
    setSearchParams((prev) => {
      prev.set('section', chip);
      return prev;
    });

  return (
    <div className='d-flex p-2 chips-container'>
      {chips.map((chip, index) => (
        <div
          key={`chip-key-${chip}-${index}`}
          className={`chip m-2 p-2 d-flex justify-content-center text-white ${selectedSection === chip ? 'selected' : ''}`}
          onClick={() => handleChipClick(chip)}
        >
          {chip}
        </div>
      ))}
    </div>
  );
};
