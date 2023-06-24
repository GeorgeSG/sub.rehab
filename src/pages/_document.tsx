import { createGetInitialProps } from "@mantine/next";
import { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <Script
          async
          src="https://analytics.umami.is/script.js"
          data-website-id="8aaffa09-d1cd-4324-b132-cacdf975df7b"
          strategy="lazyOnload"
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
