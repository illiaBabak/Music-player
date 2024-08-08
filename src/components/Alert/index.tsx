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
    className={`custom-alert ${type} ${position} d-flex flex-row align-items-center justify-content-between`}
    onMouseLeave={onMouseLeave}
    onMouseEnter={onMouseEnter}
  >
    <div className='alert-img ms-2' />
    <h4 className='m-0'>{text}</h4>
    <div className='close-alert-btn d-flex align-items-center justify-conten-center mx-2' onClick={onClose}>
      x
    </div>
  </div>
);
