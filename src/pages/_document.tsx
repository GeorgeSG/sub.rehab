import { createGetInitialProps } from "@mantine/next";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          async
          src="https://analytics.umami.is/script.js"
          data-website-id="8aaffa09-d1cd-4324-b132-cacdf975df7b"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.getInitialProps = createGetInitialProps();
