import express, { Response } from "express";
import { db } from "../../server";

//TODO: use try-catch
const getUser = async (session: { id: number }) => {
  return await db
    .selectFrom("users")
    .selectAll()
    .where("session_id", "=", session.id)
    .executeTakeFirst();
};

async function userSession(
  req: express.Request,
  res: Response<any, { user: Awaited<ReturnType<typeof getUser>> }>,
  next: express.NextFunction
) {
  const csrfToken = req.get("X-CSRF-Token");

  if (csrfToken === undefined || !("sessionCode" in req.cookies)) {
    res.status(400).json("authentication failed");
    return;
  }

  const sessionCode = req.cookies.sessionCode;

  const session = await db
    .selectFrom("sessions")
    .selectAll()
    .where("csrf_token", "=", csrfToken)
    .executeTakeFirst();

  if (
    session === undefined ||
    session.session_code !== sessionCode ||
    session.csrf_token !== csrfToken
  ) {
    res.status(400).json("session mismatch");
    return;
  }

  const user = await getUser(session);

  if (!user) {
    res.status(400).json("user not found");
    return;
  }

  res.locals.user = user;

  next();
}

export { userSession };
