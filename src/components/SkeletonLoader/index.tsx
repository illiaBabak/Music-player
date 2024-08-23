type Props = {
  width: string;
  height: string;
  borderRadius: string;
  optionalClasses?: string[];
};

export const SkeletonLoader = ({ width, height, borderRadius, optionalClasses = [] }: Props): JSX.Element => (
  <div
    className={`skeleton-loader ${optionalClasses.join(' ')}`}
    style={{ minWidth: width, maxWidth: width, minHeight: height, maxHeight: height, borderRadius }}
  ></div>
);
