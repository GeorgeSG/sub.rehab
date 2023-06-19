import { Footer } from "@/components/core/footer";
import { theme } from "@/theme";
import { ColorScheme, ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import type { AppProps } from "next/app";
import { Inter, Lobster } from "next/font/google";
import Head from "next/head";
import { Notifications } from "@mantine/notifications";

const fontAccent = Lobster({ weight: "400", subsets: ["latin"], variable: "--font-accent" });
const fontDefault = Inter({ subsets: ["latin"], variable: "--font-default" });

export default function App({ Component, pageProps }: AppProps) {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "sub-rehab-color-theme",
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <>
      <Head>
        <title>sub.rehab · Find your next diving spot</title>
        <meta name="name" content="sub.rehab · Find your next diving spot" />
        <meta
          name="description"
          content="Find your next diving spot. A list of subreddit alternatives on different platforms. "
        />
        <link rel="canonical" href="https://sub.rehab/" />
        <meta
          property="og:description"
          content="Find your next diving spot. A list of subreddit alternatives on different platforms."
        />
        <meta property="og:image" content="https://sub.rehab/images/background.webp" />
        <meta property="og:url" content="https://sub.rehab/" />
        <meta property="og:site_name" content="sub.rehab · Find your next diving spot" />

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="64x64" href="/favicon/favicon-64x64.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="120x120" href="/favicon/favicon-120x120.png" />
        <link rel="icon" type="image/png" sizes="144x144" href="/favicon/favicon-144x144.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon/favicon-192x192.png" />
        <link rel="icon" type="image/png" sizes="310x310" href="/favicon/favicon-310x310.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon.png" />
      </Head>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{ ...theme, colorScheme }}>
          <ModalsProvider>
            <Notifications />
            <div className="background" />
            <main className={`wrapper ${fontAccent.variable} ${fontDefault.variable}`}>
              <Component {...pageProps} />
              <Footer />
            </main>
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}
