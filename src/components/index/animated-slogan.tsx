import { createStyles } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Typewriter from "typewriter-effect";

const useStyles = createStyles(({ colors, fn }) => ({
  slogan: {
    display: "flex",

    [fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  dot: {
    [fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  typewriter: {
    color: colors.orange[7],
    display: "inline-block",
  },
}));

export function AnimatedSlogan() {
  const { classes } = useStyles();
  const isSmallScreen = useMediaQuery("(max-width: 360px)");

  return (
    <h2 className={classes.slogan}>
      Helping you&nbsp;
      {isSmallScreen ? (
        <>
          <span className={classes.typewriter}>find your next diving spot</span>
        </>
      ) : (
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString("find your next diving spot")
              .pauseFor(2500)
              .deleteAll()
              .typeString("rediscover old favorites")
              .pauseFor(2500)
              .deleteAll()
              .typeString("move on from Reddit")
              .pauseFor(2500)
              .deleteAll()
              .start();
          }}
          options={{
            wrapperClassName: classes.typewriter,
            autoStart: true,
            deleteSpeed: 5,
            delay: 20,
            loop: true,
          }}
        />
      )}
      <span className={classes.dot}>.</span>
    </h2>
  );
}
