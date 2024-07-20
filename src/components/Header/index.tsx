import { Form, Navbar } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { ThemeBtn } from '../ThemeBtn';

export const Header = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';

  return (
    <Navbar className='p-3 header' data-bs-theme='dark'>
      <Form className='header-form d-flex flex-row justify-content-between w-100'>
        <Form.Control
          type='search'
          placeholder='Search'
          onBlur={({ currentTarget: { value } }) => {
            const trimmedVal = value.trim();

            setSearchParams((prev) => {
              trimmedVal ? prev.set('query', trimmedVal) : prev.delete('query');
              return prev;
            });

            if (!trimmedVal)
              setSearchParams((prev) => {
                prev.set('section', 'All');
                return prev;
              });
          }}
          onKeyDown={({ key, currentTarget }) => {
            if (key === 'Enter') currentTarget.blur();
          }}
          defaultValue={searchedText}
          className='search-input'
        />
        <ThemeBtn />
      </Form>
    </Navbar>
  );
};
