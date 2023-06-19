import { PageHeader } from "@/components/core/page-header";
import { Section } from "@/components/core/section";
import { useSubredditData } from "@/data";
import { Anchor, Box, Button, Group, List, Select, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function SubmitLink() {
  const { uniqueServiceList, allLinks } = useSubredditData();

  // TODO: type values
  const handleSubmit = (values: any) => {
    console.log("values: ", values);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(values).toString(),
    })
      .then(() => console.log("Form successfully submitted"))
      .catch((error) => alert(error));
  };

  const form = useForm({
    initialValues: {
      subreddit: "",
      service: "",
      link: "",
      "form-name": "linkSuggestions",
    },

    validate: {
      subreddit: (value) => {
        if (!value) {
          return "Subreddit name is required";
        }

        return value?.startsWith("r/") || value?.startsWith("/r/")
          ? null
          : "Subreddit name must start with r/";
      },
      service: (value) => (uniqueServiceList.includes(value) ? null : "Service is required"),
      link: (value) => {
        if (!value) {
          return "Link is required";
        }

        if (allLinks.find(({ url }) => url === value)) {
          return "Link is already listed";
        }

        return null;
      },
    },
  });

  return (
    <>
      <PageHeader withBackground />
      <Section>
        <Title order={2} sx={{ fontFamily: "var(--font-accent)" }}>
          Link approval criteria
        </Title>
        <List mt="xxl" maw={800}>
          <List.Item>
            No links to communities who break their service&apos;s ToS or share any illegal content
            (this should be self-explanatory).
          </List.Item>
          <List.Item>
            Link must be an alternative to an existing subreddit. I don&apos;t see sub.rehab as a
            general fediverse directory (for now).
          </List.Item>
          <List.Item>
            Community must have a minimal amount of activity. I am thinking - at least 3 posts that
            are not submitted by the community&apos;s moderator team. This does not apply for
            communities that are verified and proven as official replacements of the original
            subreddit
          </List.Item>
        </List>
        <Text>
          For more info and suggestions, see the&nbsp;
          <Anchor href="https://github.com/GeorgeSG/sub.rehab/discussions/2">
            discussion thread
          </Anchor>
          &nbsp; on Link criteria
        </Text>
        <Title order={2} mt="xxl" sx={{ fontFamily: "var(--font-accent)" }}>
          Suggest a link
        </Title>
        <Box maw={300} mt="xxl">
          <form
            onSubmit={form.onSubmit((values) => handleSubmit(values))}
            data-netlify="true"
            name="linkSuggestions"
            data-netlify-recaptcha="true"
          >
            <TextInput type="hidden" name="form-name" {...form.getInputProps("form-name")} />
            <TextInput
              withAsterisk
              label="Original subreddit:"
              placeholder="r/..."
              {...form.getInputProps("subreddit")}
            />

            <Select
              label="Service:"
              placeholder=""
              data={uniqueServiceList}
              {...form.getInputProps("service")}
            />

            <TextInput
              withAsterisk
              label="Alternative Link:"
              placeholder="https://..."
              {...form.getInputProps("link")}
            />

            <Group position="right" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Section>
    </>
  );
}
