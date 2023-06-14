import { createStyles } from "@mantine/core";
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

  return (
    <h2 className={classes.slogan}>
      Helping you&nbsp;
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
      <span className={classes.dot}>.</span>
    </h2>
  );
}
