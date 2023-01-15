import { Button } from '@vending-machine/components/atoms/button';
import { Message } from '@vending-machine/components/atoms/form/message';
import { Space } from '@vending-machine/components/atoms/space';
import { LabeledInputField } from '@vending-machine/components/molecules/form/labeled-input/field';
import { Product } from '@vending-machine/domains/product/entity';
import { FetchError } from '@vending-machine/errors/fetch-error';
import { useProduct } from '@vending-machine/hooks/use-product';
import { useSnackbar } from '@vending-machine/hooks/use-snackbar';
import { saveProductSchema } from '@vending-machine/schemas';
import { ALLOWED_DEPOSIT_VALUES } from '@vending-machine/utils/deposit';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';

type ProductFormProps = {
  product?: Product;
};

export const ProductForm = (props: ProductFormProps) => {
  const { product } = props;
  const { createProduct, updateProduct } = useProduct();
  const { showSnackbar } = useSnackbar();

  const initialValues = {
    productName: product?.productName ?? '',
    cost: product?.cost ? product.cost.toString() : Math.min(...ALLOWED_DEPOSIT_VALUES).toString(),
    amountAvailable: product?.amountAvailable ? product.amountAvailable.toString() : '0',
  };

  const handleSubmit = async (values: typeof initialValues, helpers: FormikHelpers<typeof initialValues>) => {
    const { resetForm, setSubmitting } = helpers;
    const productValue = {
      productName: values.productName,
      cost: parseInt(values.cost),
      amountAvailable: parseInt(values.amountAvailable),
    };

    try {
      product ? await updateProduct(product, productValue) : await createProduct(productValue);
      resetForm(product ? { values } : undefined);
      setSubmitting(false);
      showSnackbar(`Product ${product ? 'updated' : 'created'}`, { status: 'success' });
    } catch (error) {
      showSnackbar((error as FetchError).info.message, { status: 'error' });
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={saveProductSchema} validateOnBlur onSubmit={handleSubmit}>
      {formikProps => {
        const { dirty, isValid, isSubmitting } = formikProps;

        return (
          <Form>
            <Field name="productName" label="Product name*" component={LabeledInputField} />
            <ErrorMessage name="productName">{message => <Message status="error">{message}</Message>}</ErrorMessage>
            <Space value={24} />
            <Field name="cost" label="Cost in cents*" type="number" component={LabeledInputField} />
            <ErrorMessage name="cost">{message => <Message status="error">{message}</Message>}</ErrorMessage>
            <Space value={24} />
            <Field
              name="amountAvailable"
              label="Amount available*"
              type="number"
              min={0}
              component={LabeledInputField}
            />
            <ErrorMessage name="amountAvailable">{message => <Message status="error">{message}</Message>}</ErrorMessage>
            <Space value={24} />
            <Button type="submit" disabled={!dirty || !isValid || isSubmitting}>
              {product ? 'Update product' : 'Add product'}
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};
