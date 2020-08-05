import { Router } from "express";
const router = Router();

import * as responses from "../lib/responses";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../lib/config";

import db from "../models";
import * as mw from "../middleware";
import { validateGoogleAccessToken, genId, addToMailchimp, messageSlack } from "../lib/helpers";

import { Request } from "../types";
import { SERVER_NAME } from '../lib/config';
const { NODE_ENV } = process.env;

const cookieOpts: any = {
  maxAge: 3 * (24 * 60 * 60 * 1000), // 3 days
  sameSite: NODE_ENV === "production" ? "None" : undefined,
  secure: NODE_ENV === "production" ? true : undefined,
};

router.post("/google-signin", async (req, res) => {
  let user = await validateGoogleAccessToken(req.body.google_access_token);
  if (!user) return res.send(responses.error("bad_token"));

  let status = 'returning';
  
  let uid = await db.accounts.getUidByEmail(user.email);
  if (!uid) { // new account
    uid = genId(14);
    status = 'new';
  }

  await db.accounts.createOrUpdate(
    uid,
    user.email,
    user.given_name,
    user.family_name,
    user.picture
  );

  if (status === 'new' && req.body.teacher && SERVER_NAME === 'prod') {
    // not awaiting so we dont block
    addToMailchimp(user.email, user.given_name, user.family_name);
    messageSlack(`${user.given_name} ${user.family_name} (${user.email}) just created an account`);
  }

  let token = jwt.sign(
    {
      iat: Date.now(),
      uid,
    },
    JWT_SECRET
  );

  res.cookie("intell_", token, cookieOpts);
  res.send(responses.success({ status }));
});

router.get("/profile", mw.auth, async (req: Request, res) => {
  let token = jwt.sign(
    {
      iat: Date.now(),
      uid: req.uid,
    },
    JWT_SECRET
  );

  res.cookie("intell_", token, cookieOpts);

  res.send(
    responses.success({
      uid: req.uid,
      ...(await db.accounts.getBasicInfo(req.uid)),
    })
  );
});

router.get("/signout", mw.auth, (req, res) => {
  // remove cookie
  res.cookie("intell_", "old", {
    maxAge: 0,
  });

  res.send(responses.success());
});

export default router;
