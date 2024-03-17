import express from "express";
import { userSession } from "./middlewares/session";
import { db } from "../server";
import { set, z } from "zod";
import { sql } from "kysely";

export const postRouter = express.Router();

type Graph = {
  title: string;
  background: string;
  data: { name: string; color: string; votes: number }[];
  font_size: number;
  font: string;
  title_size: number;
  voted: boolean;
  authorName?: string;
  poll_id: number;
};

postRouter.get("/", userSession, async (_, res) => {
  //get polls
  const posts = await db.selectFrom("polls").selectAll().execute();

  //get choices
  const poll_ids = posts.map((poll) => poll.id);

  console.log(poll_ids);

  const choices = await db
    .selectFrom("choices")
    .selectAll()
    .where("poll_id", "in", poll_ids)
    .execute();

  //get associated user information
  const user_ids = posts.map((poll) => poll.user_id);

  const users = await db
    .selectFrom("users")
    .select(["name", "id"])
    .where("id", "in", user_ids)
    .execute();

  //format them together
  const polls: Graph[] = [];

  console.log(choices);

  posts.forEach((post) => {
    const data: Graph["data"] = [];

    for (let i = choices.length - 1; i >= 0; i--) {
      const choice = choices[i];

      console.log(choice);

      if (choice.poll_id == post.id) {
        data.push(choices.splice(i, 1)[0]);
      }
    }

    const user = users.find((user) => user.id == post.user_id);

    const graphData: Graph = { ...post, data, authorName: user && user.name, poll_id: post.id, voted: res.locals.user?.voted_polls.some((id) => id === post.id) ?? false };

    polls.push(graphData);
  });

  res.status(200).json(polls);
});

const ChoiceSchema = z.object({
  votes: z.number(),
  color: z.string(),
  name: z.string(),
});

const PollSchema = z.object({
  background: z.string(),
  titleSize: z.number(),
  title: z.string(),
  fontSize: z.number(),
  font: z.string(),
  choices: z.array(ChoiceSchema),
});

postRouter.post("/add", userSession, async (req, res) => {
  const poll = PollSchema.safeParse(req.body);

  if (!poll.success) {
    res.status(400).json("invalid format");
    return;
  }

  const user = res.locals.user;

  if (user === undefined) return res.status(500).json("internal server error");

  const returningPoll = await db
    .insertInto("polls")
    .values({
      background: poll.data.background,
      created: new Date(),
      font: poll.data.font,
      font_size: poll.data.fontSize,
      title: poll.data.title,
      title_size: poll.data.titleSize,
      user_id: user.id,
    })
    .returning("id")
    .executeTakeFirst();

  if (!returningPoll) return res.status(500).json("internal server error");

  const insertData = poll.data.choices.map((choice) => ({
    color: choice.color,
    name: choice.name,
    votes: 0,
    poll_id: returningPoll.id,
  }));

  await db.insertInto("choices").values(insertData).execute();
  res.status(200).json("success");
});

postRouter.post("/vote", userSession, async (req, res) => {
  //setup
  console.log(req.body)

  const poll_id = z.number().safeParse(req.body.id);
  const choice_name = z.string().safeParse(req.body.name)

  if (!poll_id.success || !choice_name.success) {
    return res.status(400).json("invalid format");
  }

  const user = res.locals.user;

  if (!user) {
    return res.status(500).json("internal server error");
  }

  //add to list of voted
  await db.updateTable("users")
    .where("id", "=", user.id)
    .set({
      voted_polls: sql`array_append(voted_polls, ${poll_id.data})`,
    }).execute();
  
  //update poll
  await db.updateTable("choices").where("poll_id", "=", poll_id.data).where("choices.name", "=", choice_name.data).set({
    votes: sql`votes + 1`
  }).execute();

  return res.status(200).json("success")
});

postRouter.post("/delete", userSession, (req, res) => {
  const data = z.object({ id: z.string() }).safeParse(req.body);

  if (!data.success) {
    res.status(400).json("invalid format");
  }
});
