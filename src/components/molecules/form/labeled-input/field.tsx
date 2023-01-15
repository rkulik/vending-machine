import { LabeledInput, LabeledInputProps } from '@vending-machine/components/molecules/form/labeled-input';
import { FieldProps, getIn } from 'formik';

type LabeledInputFieldProps = FieldProps & LabeledInputProps;

export const LabeledInputField = (props: LabeledInputFieldProps) => {
  const { field, form, status, ...restOfProps } = props;
  const hasError = (!!getIn(form.errors, field.name) && !!getIn(form.touched, field.name)) || status === 'error';

  return <LabeledInput {...field} {...restOfProps} status={hasError ? 'error' : status} />;
};
