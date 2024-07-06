import { useContext } from "react";
import { GlobalContext } from "src/root";

export const ThemeBtn = (): JSX.Element => {
  const { isLightTheme, setIsLightTheme } = useContext(GlobalContext);

  return (
    <div className="wrapper">
      <input
        type="checkbox"
        name="checkbox"
        className="switch"
        checked={isLightTheme}
        onChange={() => setIsLightTheme((prev) => !prev)}
      />
    </div>
  );
};
