import { Select, SelectProps } from '@vending-machine/components/atoms/form/select';
import { FieldProps, getIn } from 'formik';

type SelectFieldProps = FieldProps & SelectProps;

export const SelectField = (props: SelectFieldProps) => {
  const { field, form, status, ...restOfProps } = props;
  const hasError = (!!getIn(form.errors, field.name) && !!getIn(form.touched, field.name)) || status === 'error';

  return <Select {...field} {...restOfProps} status={hasError ? 'error' : status} />;
};
