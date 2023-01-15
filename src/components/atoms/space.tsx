type SpaceProps = {
  value: number;
};

export const Space = (props: SpaceProps) => <div style={{ height: `${props.value}px` }}></div>;
