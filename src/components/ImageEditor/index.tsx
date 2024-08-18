import { useRef, useState, ChangeEvent } from 'react';
import { Button } from 'react-bootstrap';
import { useCustomImagePlaylist } from 'src/api/playlists';
import AvatarEditor from 'react-avatar-editor';

type Props = {
  imageToEdit: File;
  playlistId: string;
  onClose: () => void;
};

export const ImageEditor = ({ imageToEdit, playlistId, onClose }: Props): JSX.Element => {
  const editor = useRef<AvatarEditor>(null);
  const [state, setState] = useState({
    image: imageToEdit,
    scale: 1,
    rotate: 0,
  });

  const { mutateAsync: addCustomImagePlaylist } = useCustomImagePlaylist();

  const handleScale = (e: ChangeEvent<HTMLInputElement>) => {
    const scale = parseFloat(e.target.value);

    setState({ ...state, scale });
  };

  const rotateScale = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setState({ ...state, rotate: parseFloat(e.target.value) });
  };

  const handleUploadImage = () => {
    if (!editor.current) return;

    const canvas = editor.current.getImageScaledToCanvas().toDataURL();
    addCustomImagePlaylist({ playlistId, image: canvas });

    onClose();
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className='d-flex flex-column justify-content-center align-items-center p-4 editor-container'
    >
      <AvatarEditor
        ref={editor}
        scale={state.scale}
        width={200}
        height={200}
        rotate={state.rotate}
        image={state.image}
      />
      <div className='field fs-5 mt-4 w-100 d-flex align-items-center justify-content-center text-white'>
        Zoom:
        <input
          className='mx-4 field-input'
          type='range'
          onChange={handleScale}
          min='1'
          max='2'
          step='0.01'
          value={state.scale}
        />
      </div>

      <div className='field fs-5 mt-4 w-100 d-flex align-items-center justify-content-center text-white'>
        Rotation:
        <input
          className='mx-4 field-input'
          type='range'
          onChange={rotateScale}
          min='0'
          max='180'
          step='1'
          value={state.rotate}
        />
      </div>
      <Button className='mt-4 btn w-100' onClick={handleUploadImage}>
        Save
      </Button>
    </div>
  );
};
