import { Button, ButtonProps } from "@mantine/core";
import { PolymorphicComponentProps } from "@mantine/utils";

export function GradientButton<C = "button">(
  props: Omit<PolymorphicComponentProps<C, ButtonProps>, "variant" | "gradient">
) {
  return (
    <Button
      variant="gradient"
      gradient={{ from: "orange.4", to: "orange.8", deg: 55 }}
      {...props}
    />
  );
}
