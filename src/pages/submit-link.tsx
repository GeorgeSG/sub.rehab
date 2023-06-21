import { PageHeader } from "@/components/core/page-header";
import { Section } from "@/components/core/section";
import { useSubredditData } from "@/data";
import { firestore } from "@/firebase";
import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Group,
  List,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Timestamp, addDoc, collection } from "firebase/firestore/lite";
import { IoCheckmark, IoCloseCircle } from "react-icons/io5";

export default function SubmitLink() {
  const { uniqueServiceList, allLinks } = useSubredditData();

  // TODO: type values
  const handleSubmit = async (values: any) => {
    try {
      const ref = collection(firestore, "linkSubmissions");
      await addDoc(ref, {
        ...values,
        sentAt: Timestamp.now().toDate(),
      });
      notifications.show({
        icon: <IoCheckmark />,
        color: "green",
        title: "Success!",
        message: "Your suggestion was received! It will be added after review. Thank you! 🙏",
      });
      form.reset();
    } catch (err) {
      notifications.show({
        icon: <IoCloseCircle />,
        color: "red",
        title: "Error",
        message: (
          <>
            We were unable to process your request. Sorry about that. Let us know in a&nbsp;
            <Anchor href="https://github.com/GeorgeSG/sub.rehab/issues">GitHub issue</Anchor>
            &nbsp;
          </>
        ),
      });
      console.log(err);
    }
  };

  const form = useForm({
    initialValues: {
      subreddit: "",
      service: "",
      link: "",
      official: false,
      officialExplanation: "",
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
          <List.Item pt="sm">
            Link must be an alternative to an existing subreddit. I don&apos;t see sub.rehab as a
            general fediverse directory (for now).
          </List.Item>
          <List.Item pt="sm">
            Community must have a minimal amount of activity - at least 3 posts that are not
            submitted by the community&apos;s moderator team. This does not apply for communities
            that are verified and proven as official replacements of the original subreddit
          </List.Item>
        </List>
        <Text mt="md">
          For more info and suggestions, see the&nbsp;
          <Anchor href="https://github.com/GeorgeSG/sub.rehab/discussions/2">
            discussion thread
          </Anchor>
          &nbsp;on link criteria.
        </Text>
        <Title order={2} mt="xxl" sx={{ fontFamily: "var(--font-accent)" }}>
          Suggest a link
        </Title>
        <Box maw={400} mt="xxl">
          <form
            onSubmit={form.onSubmit((values) => handleSubmit(values))}
            data-netlify="true"
            name="linkSuggestions"
          >
            <TextInput
              withAsterisk
              mt="xs"
              name="subreddit"
              label="Original subreddit:"
              placeholder="r/..."
              {...form.getInputProps("subreddit")}
            />

            <Select
              withAsterisk
              mt="xs"
              label="Service:"
              name="service"
              placeholder=""
              data={uniqueServiceList}
              {...form.getInputProps("service")}
            />

            <TextInput
              withAsterisk
              mt="xs"
              name="link"
              label="Alternative Link:"
              placeholder="https://..."
              {...form.getInputProps("link")}
            />

            <Checkbox
              name="official"
              mt="md"
              label="Is official?"
              {...form.getInputProps("official")}
              checked={form.values.official}
            ></Checkbox>

            <TextInput
              mt="xs"
              name="officialExplanation"
              placeholder="Source or proof that this is an official alternative"
              label="Official explanation:"
              {...form.getInputProps("officialExplanation")}
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
