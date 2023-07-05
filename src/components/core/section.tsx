import { CardProps, Card as MantineCard, createStyles } from "@mantine/core";

const useStyles = createStyles(({ colorScheme, radius, shadows, fn }) => ({
  card: {
    background: colorScheme === "dark" ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(10px)",
    boxShadow: shadows.sm,
    borderRadius: radius.md,
    // TODO: Figure out a less hacky way to override the padding.
    padding: "3rem !important",

    [fn.smallerThan("md")]: {
      padding: "2rem !important",
    },

    [fn.smallerThan("xs")]: {
      padding: "1.2rem 0.8rem !important",
    },

    [fn.smallerThan(360)]: {
      padding: "1rem 0.6rem !important",
    },
  },
}));

export function Section({ className, ...props }: CardProps) {
  const { classes } = useStyles();
  return <MantineCard {...props} className={`${classes.card} ${className}`} />;
}
