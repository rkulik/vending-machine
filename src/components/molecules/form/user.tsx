import { Button } from '@vending-machine/components/atoms/button';
import { Message } from '@vending-machine/components/atoms/form/message';
import { Space } from '@vending-machine/components/atoms/space';
import { LabeledInputField } from '@vending-machine/components/molecules/form/labeled-input/field';
import { User } from '@vending-machine/domains/user/entity';
import { FetchError } from '@vending-machine/errors/fetch-error';
import { useSnackbar } from '@vending-machine/hooks/use-snackbar';
import { useUser } from '@vending-machine/hooks/use-user';
import { saveUserFormSchema } from '@vending-machine/schemas';
import { Role } from '@vending-machine/types/user';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';

type UserFormProps = {
  user?: User;
  onSubmit?: () => void;
};

export const UserForm = (props: UserFormProps) => {
  const { user, onSubmit } = props;
  const { registerUser, updateUser, deleteUser } = useUser(!!user);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const initialValues = {
    username: user?.username ?? '',
    password: '',
    seller: user?.role === Role.SELLER,
  };

  const handleSubmit = async (values: typeof initialValues, helpers: FormikHelpers<typeof initialValues>) => {
    const { resetForm, setSubmitting } = helpers;
    const userValues = {
      username: values.username,
      password: values.password,
      role: values.seller ? Role.SELLER : Role.BUYER,
    };

    try {
      user ? await updateUser(userValues) : await registerUser(userValues);
      resetForm(user ? { values: { ...values, password: '' } } : undefined);
      setSubmitting(false);
      showSnackbar(`${user ? 'Update' : 'Registration'} successful`, { status: 'success' });

      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      showSnackbar((error as FetchError).info.message, { status: 'error' });
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete your user profile?')) {
      return;
    }

    try {
      await deleteUser();
      router.push('/login');
      showSnackbar('Profile deleted', { status: 'success' });
    } catch (error) {
      showSnackbar((error as FetchError).info.message, { status: 'error' });
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={saveUserFormSchema} validateOnBlur onSubmit={handleSubmit}>
      {formikProps => {
        const { dirty, isValid, isSubmitting } = formikProps;

        return (
          <Form>
            <Field name="username" label="Username*" component={LabeledInputField} />
            <ErrorMessage name="username">{message => <Message status="error">{message}</Message>}</ErrorMessage>
            <Space value={24} />
            <Field name="password" label="Password*" type="password" component={LabeledInputField} />
            <ErrorMessage name="password">{message => <Message status="error">{message}</Message>}</ErrorMessage>
            <Space value={24} />
            <Field name="seller" type="checkbox" /> Are you a seller?
            <Space value={24} />
            <Button type="submit" disabled={!dirty || !isValid || isSubmitting}>
              {user ? 'Update' : 'Register'}
            </Button>
            {user && (
              <Button type="button" variant="text" onClick={handleDelete}>
                Delete
              </Button>
            )}
            {!user && (
              <Button type="button" variant="text" onClick={() => router.push('/login')}>
                Login
              </Button>
            )}
          </Form>
        );
      }}
    </Formik>
  );
};
