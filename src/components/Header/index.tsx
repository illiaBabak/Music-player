import { Form, Navbar } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

export const Header = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchedText = searchParams.get("query") ?? "";

  return (
    <Navbar
      className="bg-body-tertiary justify-content-between p-4"
      bg="dark"
      data-bs-theme="dark"
    >
      <Navbar.Brand>Music player</Navbar.Brand>

      <Form>
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
        />
      </Form>
    </Navbar>
  );
};
