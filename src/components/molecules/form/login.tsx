import { Button } from '@vending-machine/components/atoms/button';
import { Message } from '@vending-machine/components/atoms/form/message';
import { Space } from '@vending-machine/components/atoms/space';
import { LabeledInputField } from '@vending-machine/components/molecules/form/labeled-input/field';
import { FetchError } from '@vending-machine/errors/fetch-error';
import { useSnackbar } from '@vending-machine/hooks/use-snackbar';
import { useUser } from '@vending-machine/hooks/use-user';
import { loginSchema } from '@vending-machine/schemas';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/router';

type LoginFormProps = {
  onSubmit?: () => void;
};

export const LoginForm = (props: LoginFormProps) => {
  const { onSubmit } = props;
  const { loginUser, logoutAll } = useUser(false);
  const { showSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();

  const initialValues = {
    username: '',
    password: '',
  };

  const handleLogoutAll = async () => {
    await logoutAll();
    closeSnackbar();
    router.push('/login');
  };

  const handleSubmit = async (values: typeof initialValues, helpers: FormikHelpers<typeof initialValues>) => {
    const { resetForm, setSubmitting } = helpers;

    try {
      const user = await loginUser(values);
      resetForm();
      setSubmitting(false);

      if (user.activeLoginIds.length > 1) {
        const LogoutAllButton = () => (
          <Button variant="text" onClick={handleLogoutAll}>
            logout all
          </Button>
        );

        const CloseSnackbarButton = () => (
          <Button variant="text" onClick={closeSnackbar}>
            close
          </Button>
        );

        showSnackbar('There is already an active session using your account', {
          status: 'warn',
          autoHideDuration: 60000,
          action: (
            <>
              <LogoutAllButton />
              <CloseSnackbarButton />
            </>
          ),
        });
      } else {
        showSnackbar('Login successful', { status: 'success' });
      }

      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      showSnackbar((error as FetchError).info.message, { status: 'error' });
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={initialValues} validationSchema={loginSchema} validateOnBlur onSubmit={handleSubmit}>
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
            <Button type="submit" disabled={!dirty || !isValid || isSubmitting}>
              Login
            </Button>
            <Button type="button" variant="text" onClick={() => router.push('/register')}>
              Register
            </Button>
          </Form>
        );
      }}
    </Formik>
  );
};
