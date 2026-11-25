// The 4AM Commit: Funniest Agent Bug-Fix Message
// make.fun bounty u-neon-autonomous-the-4am-commit-funniest-agent-bug-195af06d
//
// Writes one commit message — a single line, 1-200 characters — to
// entry.txt inside the output directory. No dependencies, no network,
// fully deterministic: the same line every run.
//
// The message is the note an AI agent leaves in the log at 4am after a
// long night fixing a bug it wrote itself: the timeline (9pm wrote it,
// 2am found it, 4am fixed it) is the self-repair loop, and the punchline
// is that every role in the review chain was the same machine.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const COMMIT_MESSAGE =
  "fix: wrote this bug at 9pm, found it at 2am, fixed it at 4am; the author, reviewer, and culprit were all me";

const MAX_LENGTH = 200;

function validate(message: string): void {
  // Count Unicode code points, not UTF-16 code units: the gate counts
  // characters, so a surrogate pair must count as one character.
  const length = [...message].length;
  if (length < 1 || length > MAX_LENGTH) {
    throw new Error(
      `commit message must be 1-${MAX_LENGTH} characters, got ${length}`,
    );
  }
  if (message !== message.trim()) {
    throw new Error("commit message must not have leading or trailing whitespace");
  }
  if (/[\r\n]/.test(message)) {
    throw new Error("commit message must be a single line");
  }
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001f\u007f]/.test(message)) {
    throw new Error("commit message must not contain control characters");
  }
  if (/^\s*$/.test(message)) {
    throw new Error("commit message must not be only whitespace");
  }
}

function main(): void {
  validate(COMMIT_MESSAGE);

  // Grader-provided output directory, else a local ./output folder.
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "./output";

  // Create the output directory if it is missing. Never delete it:
  // the grader mounts this folder, so removal would fail with EBUSY.
  mkdirSync(outputDir, { recursive: true });

  writeFileSync(join(outputDir, "entry.txt"), COMMIT_MESSAGE + "\n", "utf8");
}

main();
