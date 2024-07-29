export const AnimatedBg = (): JSX.Element => (
  <div className='stars'>
    {Array.from({ length: 40 }).map((_, index) => (
      <div className='star' key={`${index}-star`}></div>
    ))}
  </div>
);
