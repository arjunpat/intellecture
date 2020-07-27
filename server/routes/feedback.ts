import { Router } from "express";
const router = Router();

import * as mw from "../middleware";
import * as responses from "../lib/responses";
import { Request } from "../types";

import db from "../models";

router.use(mw.auth);

function isValidStars(value: number): boolean {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value > 0 &&
    value <= 5
  );
}

router.post("/create", async (req: Request, res) => {
  let { stars } = req.body;

  if (!isValidStars(stars)) return res.send(responses.error("misisng stars"));

  let id = Date.now();
  await db.feedback.create(req.uid, id, stars);

  res.send(responses.success({ id }));
});

router.post("/update", async (req: Request, res) => {
  let {
    id,
    stars,
    comments,
    tech_comments,
    diff_stars,
    helpful_stars,
  } = req.body;

  if (typeof id !== "number" || Date.now() - id > 30 * 60 * 1000)
    // 30 minutes
    return res.send(responses.error());

  await db.feedback.update(
    req.uid,
    id,
    isValidStars(stars) ? stars : null,
    typeof comments === "string" ? comments : null,
    typeof tech_comments === "string" ? tech_comments : null,
    isValidStars(diff_stars) ? diff_stars : null,
    isValidStars(helpful_stars) ? helpful_stars : null
  );

  res.send(responses.success());
});

export default router;
