import { Head, Html, Main, NextScript } from 'next/document';

const Document = () => (
  <Html lang="en">
    <Head />
    <body>
      <Main />
      <NextScript />
      <div id="snackbar-root" />
    </body>
  </Html>
);

// eslint-disable-next-line import/no-default-export
export default Document;
