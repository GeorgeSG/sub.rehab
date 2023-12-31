import { PageHeader } from "@/components/core/page-header";
import { Section } from "@/components/core/section";
import { useSubredditData } from "@/data";
import { COLLECTION_LINK_SUBMISSIONS, db } from "@/firebase";
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
import { useEffect, useState } from "react";
import { IoCheckmark, IoCloseCircle } from "react-icons/io5";
import { normalizeLink, normalizeSubreddit } from "../lib/normalizers";

export default function SubmitLink() {
  const { uniqueServiceList, allLinks } = useSubredditData();

  const [confirmRules, setConfirmRules] = useState(false);
  const [serviceDisabled, setServiceDisabled] = useState(false);

  // TODO: type values
  const handleSubmit = async (values: any) => {
    try {
      const ref = collection(db, COLLECTION_LINK_SUBMISSIONS);

      await addDoc(ref, {
        ...values,
        subreddit: normalizeSubreddit(values.subreddit),
        link: normalizeLink(values.link),
        sent_at: Timestamp.now().toDate(),
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
        if (value.includes("@")) {
          return "'@' is not allowed in links. If you are adding a link to a community on a federated instance, use the home instance URL for the community.";
        }

        if (allLinks.find(({ url }) => url === value)) {
          return "Link is already listed";
        }

        return null;
      },

      officialExplanation: (value, values) => {
        if (values.official && !value) {
          return "Official explanation is required";
        }

        return null;
      },
    },
  });

  useEffect(() => {
    if (form.values.link.includes("squabbles.io")) {
      form.setFieldValue("service", "squabbles");
      setServiceDisabled(true);
      return;
    }

    if (form.values.link.includes("kbin.social")) {
      form.setFieldValue("service", "kbin");
      setServiceDisabled(true);
      return;
    }

    if (
      form.values.link.includes("lemmy.ml") ||
      form.values.link.includes("lemmy.world") ||
      form.values.link.includes("sopuli.xyz") ||
      form.values.link.includes("feddit.de")
    ) {
      form.setFieldValue("service", "lemmy");
      setServiceDisabled(true);
      return;
    }

    if (form.values.link.includes("matrix.to")) {
      form.setFieldValue("service", "matrix");
      setServiceDisabled(true);
      return;
    }

    if (form.values.link.includes("raddle.me")) {
      form.setFieldValue("service", "raddle");
      setServiceDisabled(true);
      return;
    }

    setServiceDisabled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.link]);

  useEffect(() => {
    if (form.values.service === "discord") {
      form.setFieldValue("official", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.service]);

  return (
    <>
      <PageHeader withBackground />
      <Section>Suggesting links is currently disabled.</Section>
      {/* <Section>
        <Title order={2} sx={{ fontFamily: "var(--font-accent)" }}>
          Link approval criteria
        </Title>
        <List mt="xxl" maw={800} type="ordered">
          <List.Item>
            No links to communities who break their platform&apos;s ToS or share any illegal
            content.
          </List.Item>
          <List.Item pt="sm">
            No links to communities that are an alternative for a subreddit that has been banned.
          </List.Item>
          <List.Item pt="sm">
            No NSFW communities (yet). We want to figure out how to handle NSFW stuff before we
            allow it.
          </List.Item>
          <List.Item pt="sm">
            Links must be alternatives to an existing subreddit. sub.rehab is not a general
            fediverse directory (for now).
          </List.Item>
          <List.Item pt="sm">
            For &quot;misc&quot; communities, we approve forum-like platforms. We do not currently
            list tumblr, twitter, or mastodon.
          </List.Item>
          <List.Item pt="sm">
            We accept communities from discord and other IRC-style platforms only if they are
            official.
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
        <Box maw={450} mt="xxl">
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
              disabled={serviceDisabled}
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
              disabled={form.values.service === "discord"}
              checked={form.values.official}
              {...form.getInputProps("official")}
            />

            {form.values.official && (
              <TextInput
                mt="xs"
                name="officialExplanation"
                placeholder="Source or proof that this is an official alternative"
                label="Official explanation:"
                {...form.getInputProps("officialExplanation")}
              />
            )}

            <Checkbox
              mt="md"
              label="* I have checked that the community meets the criteria above"
              onChange={(e) => setConfirmRules(e.target.checked)}
              checked={confirmRules}
            />

            <Group position="right" mt="md">
              <Button type="submit" disabled={!confirmRules}>
                Submit
              </Button>
            </Group>
          </form>
        </Box>
      </Section> */}
    </>
  );
}
