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
    className={`custom-alert ${type} ${position} d-flex flex-row align-items-center justify-content-space`}
    onMouseLeave={onMouseLeave}
    onMouseEnter={onMouseEnter}
  >
    <div className='alert-img ms-1' />
    <h4 className='m-4 alert-text'>{text}</h4>
    <div className='close-alert-btn d-flex align-items-center justify-conten-center m-0' onClick={onClose}>
      x
    </div>
  </div>
);
