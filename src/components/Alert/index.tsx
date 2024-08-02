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
    className={`alert ${type} ${position} d-flex align-items-center justify-content-between p-2`}
    onMouseLeave={onMouseLeave}
    onMouseEnter={onMouseEnter}
  >
    <div className='alert-img' />
    <h2>{text}</h2>
    <div className='close-alert-btn d-flex align-items-center justify-conten-center' onClick={onClose}>
      x
    </div>
  </div>
);
