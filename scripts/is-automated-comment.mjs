// Decide whether a PR comment is automated bot output that must NOT start an agent run.
// CLI:  node scripts/is-automated-comment.mjs --body "<text>" [--author <login>]
//       echo '{"body":"...","author":"..."}' | node scripts/is-automated-comment.mjs
// Exit code 0 = automated (ignore the comment), 1 = human (dispatch), 2 = bad input.
// Module: import { isAutomatedComment } from "./is-automated-comment.mjs"
// Extra bot logins: env AUTOMATED_COMMENT_AUTHORS="bot-a,bot-b".
import { pathToFileURL } from "node:url";

const PREFIXES = ["### Screenshots ·"];
const AUTHORS = ["minions-preview", "minions-preview[bot]"];

export function isAutomatedComment(
  { body = "", author = "" } = {},
  extraAuthors = [],
) {
  const authors = [...AUTHORS, ...extraAuthors].map((a) => a.toLowerCase());
  if (author && authors.includes(author.toLowerCase())) return true;
  const text = body.replace(/^﻿/, "").trimStart();
  return PREFIXES.some((p) => text.startsWith(p));
}

async function main() {
  const argv = process.argv.slice(2);
  const arg = (n) => {
    const i = argv.indexOf(n);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  let input = { body: arg("--body"), author: arg("--author") };
  if (input.body === undefined && !process.stdin.isTTY) {
    let raw = "";
    for await (const c of process.stdin) raw += c;
    try {
      input = JSON.parse(raw);
    } catch {
      console.error("stdin must be JSON {body, author}");
      process.exit(2);
    }
  }
  if (input.body === undefined) {
    console.error("usage: --body <text> [--author <login>]");
    process.exit(2);
  }
  const extra = (process.env.AUTOMATED_COMMENT_AUTHORS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const automated = isAutomatedComment(input, extra);
  console.log(automated ? "automated" : "human");
  process.exit(automated ? 0 : 1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
