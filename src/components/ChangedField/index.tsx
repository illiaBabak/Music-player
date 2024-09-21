import { forwardRef, useState } from 'react';

type Props = {
  isReadOnly: boolean;
  data: string | undefined;
  name: string;
  handleBlur: ({ currentTarget: { value, name } }: React.FocusEvent<HTMLInputElement, Element>) => void;
};

export const ChangedField = forwardRef<HTMLInputElement, Props>(({ isReadOnly, data, handleBlur, name }, ref) => {
  const [isEdit, setIsEdit] = useState(false);

  return isEdit ? (
    <input
      key={data}
      className='info-field d-flex flex-grow-1 flex-shrink-1'
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
    <span
      ref={ref}
      className={`changed-text d-flex flex-grow-1 flex-shrink-1 ${isReadOnly ? '' : 'readonly'} ${data ? '' : 'add'}`}
      onClick={() => setIsEdit(true)}
    >
      {data ? data : `Add ${name}`}
    </span>
  );
});
