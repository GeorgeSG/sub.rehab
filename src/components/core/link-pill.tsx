import { Anchor, AnchorProps, createStyles } from "@mantine/core";
import { PolymorphicComponentProps } from "@mantine/utils";

const useStyles = createStyles(({ colorScheme, spacing, radius, colors, fn, other }) => {
  const isDark = colorScheme === "dark";
  return {
    linkPill: {
      display: "flex",
      alignItems: "center",
      gap: spacing.md,
      borderRadius: radius.md,
      padding: `${spacing.xs} ${spacing.md}`,
      color: isDark ? colors.orange[1] : colors.gray[7],
      lineHeight: "32px",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : colors.orange[0],
      transition: `background-color ${other.transitionTime} ease`,
      border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.15)" : colors.orange[2]}`,

      "&:hover": {
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : colors.orange[1],
        textDecoration: "none",
      },

      [fn.smallerThan("xs")]: {
        gap: spacing.xs,
        padding: spacing.xs,
      },
    },
  };
});

export function LinkPill<C = "a">({
  className,
  children,
  ...props
}: PolymorphicComponentProps<C, AnchorProps>) {
  const { classes } = useStyles();
  return (
    <Anchor {...props} className={`${classes.linkPill} ${className}`}>
      {children}
    </Anchor>
  );
}
