import { Anchor, Text, Title, Tooltip, createStyles } from "@mantine/core";
import Image from "next/image";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

type CommunityProps = {
  name: string;
  links: {
    service: string;
    url: string;
    official: boolean;
  }[];
};

const SERVICE_ICONS: Record<string, string> = {
  discord: "/images/discord.svg",
  lemmy: "/images/lemmy.svg",
  kbin: "/images/kbin.svg",
};

const useStyles = createStyles(({ colors, colorScheme, spacing, radius, other }) => {
  const isDark = colorScheme === "dark";

  return {
    community: {
      padding: spacing.md,
      border: `1px solid ${isDark ? colors.gray[8] : colors.gray[3]}`,
      backgroundColor: isDark ? colors.dark[6] : "#fff",
      borderRadius: radius.md,
    },

    homeLocation: {
      display: "flex",
      alignItems: "center",
      gap: spacing.md,
      borderRadius: radius.md,
      padding: `${spacing.xs} ${spacing.md}`,
      color: isDark ? colors.orange[1] : colors.gray[7],
      lineHeight: "32px",
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.1)" : colors.orange[0],
      transition: `background-color ${other.transitionTime} ease`,

      "&:hover": {
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.2)" : colors.orange[1],
        textDecoration: "none",
      },

      "& + &": {
        marginTop: spacing.sm,
      },
    },

    communityName: {
      color: isDark ? colors.orange[1] : colors.gray[8],
      marginBottom: spacing.md,
    },

    official: {
      height: "20px",
      marginLeft: "auto",
      color: isDark ? colors.orange[1] : colors.orange[6],
    },
  };
});

export function Community({ name, links }: CommunityProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.community}>
      <Title order={4} className={classes.communityName}>
        {name}
      </Title>
      {links.map((link) => (
        <Anchor
          href={link.url}
          target="_blank"
          title={link.url.split("://")[1]}
          rel="noreferrer"
          className={classes.homeLocation}
          key={`${name}-${link.service}`}
        >
          {SERVICE_ICONS[link.service] && (
            <Image
              alt={`${name} at ${link.service}`}
              title={`${name} at ${link.service}`}
              src={SERVICE_ICONS[link.service]}
              width={32}
              height={32}
            />
          )}
          <Text sx={{ textOverflow: "ellipsis", overflow: "hidden" }}>
            {link.url.split("://")[1]}
          </Text>
          {link.official && (
            <Tooltip
              label={
                <>
                  verified from <strong>{name}</strong>
                </>
              }
              withArrow
            >
              <Text className={classes.official}>
                <IoCheckmarkCircleOutline size={20} />
              </Text>
            </Tooltip>
          )}
        </Anchor>
      ))}
    </div>
  );
}
