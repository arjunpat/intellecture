import fetch from "node-fetch";
const badWords = require("../../lib/bad_words.json");
import { MAILCHIMP, SLACK_WEBHOOK } from './config';

export function genId(len: number): string {
  let options = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let id = "";

  for (let i = 0; i < len; i++)
    id += options[Math.floor(Math.random() * options.length)];

  return id;
}

export function genLowerCaseId(length: number): string {
  let options = "abcdefghijklmnopqrstuvwxyz";
  let id = "";

  for (let i = 0; i < length; i++)
    id += options[Math.floor(Math.random() * options.length)];

  return id;
}

function isBadWord(str: string): boolean {
  // binary search, O(log n)

  let low = 0;
  let high = badWords.length - 1;
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let val = badWords[mid];

    if (str === val) {
      return true;
    } else if (str > val) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return false;
}

function containsBadWord(code: string): boolean {
  if (code.length !== 5) throw "Must be of length 5";

  // O(6log n) -> O(log n)
  // assumes that all bad words are of length 3 to 5
  return (
    isBadWord(code) ||
    isBadWord(code.slice(0, 4)) ||
    isBadWord(code.slice(1, 5)) ||
    isBadWord(code.slice(0, 3)) ||
    isBadWord(code.slice(1, 4)) ||
    isBadWord(code.slice(2, 5))
  );
}

export function genLectureJoinCode(): string {
  let code = genLowerCaseId(5);
  while (containsBadWord(code)) code = genLowerCaseId(5);
  return code;
}

export async function validateGoogleAccessToken(token: string) {
  let url = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" + encodeURIComponent(token);
  let res = await fetch(url).then((res) => res.json());

  if (!res.email_verified || res.error) return false;
  return res;
}

export function addToMailchimp(email_address: string, FNAME: string, LNAME: string) {
  return fetch(`${MAILCHIMP.ORIGIN}/3.0/lists/${MAILCHIMP.LIST_ID}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + MAILCHIMP.API_KEY
    },
    body: JSON.stringify({
      email_address,
      status: 'subscribed',
      merge_fields: {
        FNAME,
        LNAME
      },
      tags: ['User']
    })
  }).then(res => res.json());
}

export function messageSlack(text: string) {
  return fetch(SLACK_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text
    })
  }).then(res => res.json());
}