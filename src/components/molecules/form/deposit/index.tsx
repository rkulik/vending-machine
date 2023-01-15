import { Button } from '@vending-machine/components/atoms/button';
import { SelectField } from '@vending-machine/components/atoms/form/select/field';
import { Space } from '@vending-machine/components/atoms/space';
import { User } from '@vending-machine/domains/user/entity';
import { FetchError } from '@vending-machine/errors/fetch-error';
import { useSnackbar } from '@vending-machine/hooks/use-snackbar';
import { useUser } from '@vending-machine/hooks/use-user';
import { depositSchema } from '@vending-machine/schemas';
import { convertToEuro } from '@vending-machine/utils/currency';
import { ALLOWED_DEPOSIT_VALUES } from '@vending-machine/utils/deposit';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import styles from './style.module.scss';

type DepositFormProps = {
  user: User;
};

export const DepositForm = (props: DepositFormProps) => {
  const { user } = props;
  const { deposit, resetDeposit } = useUser();
  const { showSnackbar, closeSnackbar } = useSnackbar();

  const initialValues = { cents: ALLOWED_DEPOSIT_VALUES[0].toString() };

  const handleSubmit = async (values: typeof initialValues, helpers: FormikHelpers<typeof initialValues>) => {
    const { resetForm, setSubmitting } = helpers;
    closeSnackbar();

    try {
      await deposit({ cents: parseInt(values.cents) });
      resetForm({ values });
      setSubmitting(false);
      showSnackbar('Deposit successful', { status: 'success' });
    } catch (error) {
      showSnackbar((error as FetchError).info.message, { status: 'error' });
      setSubmitting(false);
    }
  };

  const handleReset = async () => {
    closeSnackbar();

    try {
      await resetDeposit();
      showSnackbar('Reset successful', { status: 'success' });
    } catch (error) {
      showSnackbar((error as FetchError).info.message, { status: 'error' });
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={depositSchema} validateOnBlur onSubmit={handleSubmit}>
      {formikProps => {
        const { isValid, isSubmitting } = formikProps;

        return (
          <Form>
            <div className={styles.deposit}>{convertToEuro(user.deposit)}</div>
            <Space value={24} />
            <Field as="select" name="cents" component={SelectField}>
              {ALLOWED_DEPOSIT_VALUES.map(depositValue => (
                <option key={depositValue} value={depositValue}>
                  {convertToEuro(depositValue)}
                </option>
              ))}
            </Field>
            <Space value={24} />
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Deposit
            </Button>
            <Button type="button" variant="text" onClick={handleReset}>
              Reset
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};
