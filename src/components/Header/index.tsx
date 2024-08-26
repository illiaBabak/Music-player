import { Form, Navbar } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { ThemeBtn } from '../ThemeBtn';
import { useEffect, useState } from 'react';

export const Header = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchedText = searchParams.get('query') ?? '';

  const [inputVal, setInputVal] = useState(searchedText);

  useEffect(() => {
    setInputVal(searchedText);
  }, [searchParams, searchedText]);

  return (
    <Navbar className='p-3 header' data-bs-theme='dark'>
      <Form className='header-form d-flex flex-row justify-content-between align-items-center w-100'>
        <div className='input-wrapper d-flex flex-row align-items-center'>
          <Form.Control
            type='search'
            placeholder='Search'
            value={inputVal}
            onChange={({ currentTarget: { value } }) => setInputVal(value)}
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
            className='search-input'
          />
          {inputVal && (
            <div
              className='clear-input-btn text-white'
              onClick={() => {
                setSearchParams((prev) => {
                  prev.delete('query');
                  return prev;
                });

                setInputVal('');
              }}
            >
              x
            </div>
          )}
        </div>
        <ThemeBtn />
      </Form>
    </Navbar>
  );
};
