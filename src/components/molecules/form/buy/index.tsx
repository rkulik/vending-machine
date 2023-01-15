import { Button } from '@vending-machine/components/atoms/button';
import { LabeledInputField } from '@vending-machine/components/molecules/form/labeled-input/field';
import { Product } from '@vending-machine/domains/product/entity';
import { User } from '@vending-machine/domains/user/entity';
import { FetchError } from '@vending-machine/errors/fetch-error';
import { useSnackbar } from '@vending-machine/hooks/use-snackbar';
import { useUser } from '@vending-machine/hooks/use-user';
import { buySchema } from '@vending-machine/schemas';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import styles from './style.module.scss';

type BuyFormProps = {
  user: User;
  product: Product;
};

export const BuyForm = (props: BuyFormProps) => {
  const { user, product } = props;
  const { buyProduct } = useUser();
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    productId: product.id,
    amount: '1',
  };

  const handleSubmit = async (values: typeof initialValues, helpers: FormikHelpers<typeof initialValues>) => {
    const { resetForm, setSubmitting } = helpers;
    const amount = parseInt(values.amount);

    try {
      await buyProduct({ productId: values.productId, amount });
      resetForm({ values });
      setSubmitting(false);
      showSnackbar(`${amount > 1 ? 'Products' : 'Product'} bought`, { status: 'success' });
    } catch (error) {
      showSnackbar((error as FetchError).info.message, { status: 'error' });
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={buySchema} validateOnBlur onSubmit={handleSubmit}>
      {formikProps => {
        const { isValid, isSubmitting } = formikProps;
        const total = parseInt(formikProps.values.amount) * product.cost;

        return (
          <Form className={styles.form}>
            <Field name="amount" type="number" min={1} component={LabeledInputField} />
            <Button type="submit" disabled={total > user.deposit || !isValid || isSubmitting}>
              Buy
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};
