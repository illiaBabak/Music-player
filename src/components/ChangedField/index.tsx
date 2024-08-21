import { useState } from 'react';

type Props = {
  isOwnPlaylist: boolean;
  data: string | undefined;
  name: string;
  handleBlur: ({ currentTarget: { value, name } }: React.FocusEvent<HTMLInputElement, Element>) => void;
};

export const ChangedField = ({ isOwnPlaylist, data, handleBlur, name }: Props): JSX.Element => {
  const [isEdit, setIsEdit] = useState(false);

  return isEdit ? (
    <input
      key={data}
      className='info-field m-2 p-1'
      type='text'
      defaultValue={data}
      onBlur={(e) => {
        handleBlur(e);

        setIsEdit(false);
      }}
      onKeyDown={({ key, currentTarget }) => {
        if (key === 'Enter') currentTarget.blur();
      }}
      name={name}
      placeholder={`Add ${name}...`}
      autoFocus
    />
  ) : (
    <span className={`fs-4 m-2 ${isOwnPlaylist ? '' : 'not-own'} ${data ? '' : 'add'}`} onClick={() => setIsEdit(true)}>
      {data ? data : `Add ${name}`}
    </span>
  );
};
