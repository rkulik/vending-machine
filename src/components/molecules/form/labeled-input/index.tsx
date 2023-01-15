import { Input, InputProps } from '@vending-machine/components/atoms/form/input';
import { Label } from '@vending-machine/components/atoms/form/label';

type BaseLabeledInputProps = {
  name: string;
  label: string;
};

export type LabeledInputProps = BaseLabeledInputProps & Omit<InputProps, 'name'>;

export const LabeledInput = (props: LabeledInputProps) => {
  const { label, id, name, ...restOfProps } = props;

  const inputId = id ?? name;

  return (
    <div>
      <Label htmlFor={inputId}>{label}</Label>
      <Input id={inputId} name={name} {...restOfProps} />
    </div>
  );
};
