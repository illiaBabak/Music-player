import { AlertProps } from 'src/types/types';

type AlertComponentProps = AlertProps & {
  onClose: () => void;
  onMouseLeave: () => void;
  onMouseEnter: () => void;
};

export const Alert = ({
  text,
  type,
  onClose,
  position,
  onMouseEnter,
  onMouseLeave,
}: AlertComponentProps): JSX.Element => (
  <div
    className={`custom-alert ${type} ${position} p-2 d-flex flex-row align-items-center justify-content-center`}
    onMouseLeave={onMouseLeave}
    onMouseEnter={onMouseEnter}
  >
    <div className='alert-img m-0' />
    <h4 className='m-1 ms-1 mx-3 text-white'>{text}</h4>
    <div className='close-alert-btn d-flex align-items-center justify-content-center m-0' onClick={onClose}>
      x
    </div>
  </div>
);
