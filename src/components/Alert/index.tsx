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
    className={`custom-alert ${type} ${position} p-2 d-flex flex-row align-items-center justify-content-center text-center position-fixed`}
    onMouseLeave={onMouseLeave}
    onMouseEnter={onMouseEnter}
  >
    <div className='alert-img m-0 object-fit-cover z-4 position-relative' />
    <p className='m-1 ms-1 mx-3 text-white alert-text'>{text}</p>
    <div
      className='close-alert-btn d-flex align-items-center justify-content-center m-0 position-absolute fw-bolder'
      onClick={onClose}
    >
      x
    </div>
  </div>
);
