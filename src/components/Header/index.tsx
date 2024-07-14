import { Form, Navbar } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { ThemeBtn } from "../ThemeBtn";
import { useContext } from "react";
import { GlobalContext } from "src/root";

export const Header = (): JSX.Element => {
  const { isLightTheme } = useContext(GlobalContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchedText = searchParams.get("query") ?? "";

  return (
    <Navbar
      className={`p-3 header ${isLightTheme ? "light" : "dark"}`}
      data-bs-theme="dark"
    >
      <Form className="header-form d-flex flex-row justify-content-between">
        <Form.Control
          type="search"
          placeholder="Search"
          onBlur={({ currentTarget: { value } }) => {
            const trimmedVal = value.trim();

            setSearchParams((prev) => {
              trimmedVal ? prev.set("query", trimmedVal) : prev.delete("query");
              return prev;
            });
          }}
          onKeyDown={({ key, currentTarget }) => {
            if (key === "Enter") currentTarget.blur();
          }}
          defaultValue={searchedText}
          className="search-input"
        />
        <ThemeBtn />
      </Form>
    </Navbar>
  );
};
