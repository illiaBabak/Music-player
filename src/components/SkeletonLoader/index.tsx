type Props = {
  width?: string;
  height?: string;
  className?: string;
};

export const SkeletonLoader = ({ width, height, className = '' }: Props): JSX.Element => (
  <div className={`skeleton-loader d-flex ${className}`} style={{ width, height }} />
);
