import { ReactNode } from 'react';

type Props = {
  onClose: () => void;
  children: ReactNode;
};

export const ModalWrapper = ({ onClose, children }: Props): JSX.Element => {
  return (
    <div
      className='modal-wrapper d-flex justify-content-center align-items-center p-0 m-0 position-absolute'
      onClick={onClose}
    >
      {children}
    </div>
  );
};
