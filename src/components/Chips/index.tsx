import { useContext } from "react";
import { GlobalContext } from "src/root";

const CHIPS = ["All", "Tracks", "Artists", "Albums"] as const;

export const Chips = (): JSX.Element => {
  const { isLightTheme, selectedChip, setSelectedChip } =
    useContext(GlobalContext);

  const handleChipClick = (chip: string) => setSelectedChip(chip);

  return (
    <div
      className={`d-flex p-2 chips-container ${isLightTheme ? "light" : "dark"}`}
    >
      {CHIPS.map((chip) => (
        <div
          key={chip}
          className={`chip m-2 p-2 d-flex justify-content-center ${
            selectedChip === chip ? "selected" : ""
          }`}
          onClick={() => handleChipClick(chip)}
        >
          {chip}
        </div>
      ))}
    </div>
  );
};
