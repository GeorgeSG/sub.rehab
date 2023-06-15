import { MantineThemeOverride } from "@mantine/core";

export const theme: MantineThemeOverride = {
  primaryColor: "orange",
  cursorType: "pointer",
  fontFamily: "var(--font-default)",
  lineHeight: 1.5,
  fontSizes: {
    xs: "clamp(0.65rem, calc(0.64rem + 0.08vw), 0.69rem)",
    sm: "clamp(0.78rem, calc(0.76rem + 0.09vw), 0.83rem)",
    md: "clamp(0.94rem, calc(0.91rem + 0.11vw), 1rem)",
    lg: "clamp(2.33rem, calc(2.28rem + 0.28vw), 2.49rem)",
    xl: "clamp(3.36rem, calc(3.28rem + 0.41vw), 3.58rem)",
  },
  headings: {
    sizes: {
      h1: {
        fontSize: "clamp(3.36rem, calc(3.28rem + 0.41vw), 3.58rem)",
        lineHeight: 1,
      },
      h2: {
        fontSize: "clamp(1.62rem, calc(1.58rem + 0.2vw), 1.73rem)",
        lineHeight: 1,
      },
      h3: {
        fontSize: "clamp(1.35rem, calc(1.32rem + 0.16vw), 1.44rem)",
        lineHeight: 1,
      },
    },
  },
  spacing: {
    xxs: "0.5rem",
    xxl: "2rem",
  },

  other: {
    transitionTime: "200ms",
  },

  globalStyles: ({ spacing, colorScheme }) => {
    const gradient =
      colorScheme === "dark"
        ? "linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.8) 40%, rgba(0, 0, 0, 1))"
        : "linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.3) 40%, rgba(255, 255, 255, 0.5) 75%, rgba(255, 255, 255, 0.8) 85%, rgba(255, 255, 255, 1))";

    return {
      body: {
        minHeight: "100vh",
        maxWidth: "100vw",
      },

      ".background": {
        position: "fixed",
        width: "100vw",
        height: "100vh",
        backgroundImage: `${gradient}, url('/images/background.webp')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      },

      ".wrapper": {
        position: "relative",
        width: "min(1200px, 90vw)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: "0 auto",
        padding: `${spacing.xxl} 0`,
      },
    };
  },
};
