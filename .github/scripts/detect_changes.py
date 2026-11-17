#!/usr/bin/env python3
"""Report which CI surfaces a change touches.

A workflow-level `paths` filter answers one question for the whole workflow:
should any of it run. GitHub offers no per-job equivalent, so the jobs that a
change cannot affect are gated on the outputs this script writes instead.
Skipping a job that way still reports a status for it, which a workflow-level
filter does not, so a required check never sits pending forever.

Filters live next to this script in `filters.json`, one section per profile and
one path-pattern list per job output. Patterns follow the workflow `paths`
syntax: `**` crosses directory boundaries, `*` and `?` do not.

Usage:
    detect_changes.py --profile ci [--filters PATH] [--changed PATH] [--all]

`--changed` reads one path per line instead of asking git, which is how the
script is unit-checked locally. The script fails open: when the changed set
cannot be determined (an unknown diff range, a manual dispatch) every output is
`true` so a job is never skipped by mistake.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

_GIT = shutil.which("git") or "git"

# Events that carry no comparable base revision, so every surface must run.
_FORCE_ALL_EVENTS = {"workflow_dispatch", "schedule", "repository_dispatch"}


def to_regex(pattern: str) -> re.Pattern[str]:
    """Translate a workflow path-filter pattern into a regular expression."""
    out: list[str] = []
    index = 0
    while index < len(pattern):
        if pattern.startswith("**/", index):
            out.append("(?:.*/)?")
            index += 3
        elif pattern.startswith("**", index):
            out.append(".*")
            index += 2
        elif pattern[index] == "*":
            out.append("[^/]*")
            index += 1
        elif pattern[index] == "?":
            out.append("[^/]")
            index += 1
        else:
            out.append(re.escape(pattern[index]))
            index += 1
    return re.compile("^" + "".join(out) + "$")


def _diff(*revisions: str) -> list[str] | None:
    """Return the paths a git diff reports, or None when the range is unknown."""
    result = subprocess.run(  # noqa: S603 - fixed argv, no untrusted input
        [_GIT, "diff", "--name-only", *revisions],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0:
        return None
    return [line.strip() for line in result.stdout.splitlines() if line.strip()]


def _usable(sha: str) -> bool:
    """Reject the sentinel SHAs GitHub uses when there is no previous revision."""
    return bool(sha) and set(sha) != {"0"}


def changed_paths() -> list[str] | None:
    """Return the paths the pull request or push changed, or None if unknown."""
    base = os.environ.get("PR_BASE_SHA") or ""
    head = os.environ.get("PR_HEAD_SHA") or "HEAD"
    before = os.environ.get("PUSH_BEFORE_SHA") or ""

    if not base and _usable(before):
        base = before

    if base:
        # The three-dot form compares against the merge base, which is what a
        # workflow-level `paths` filter does for a pull request.
        for revisions in ((f"{base}...{head}",), (base, head)):
            paths = _diff(*revisions)
            if paths is not None:
                return paths
        return None

    paths = _diff("HEAD~1...HEAD")
    if paths is None:
        paths = _diff("HEAD~1", "HEAD")
    return paths


def main() -> int:
    """Write one output per filter and return the process status."""
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--profile", required=True, help="Filters section to use.")
    parser.add_argument(
        "--filters",
        default=str(Path(__file__).with_name("filters.json")),
        help="Path to the filters file.",
    )
    parser.add_argument("--changed", help="File with one changed path per line.")
    parser.add_argument(
        "--all",
        action="store_true",
        help="Report every surface as changed, ignoring the diff.",
    )
    parser.add_argument(
        "--github-output",
        default=os.environ.get("GITHUB_OUTPUT"),
        help="File that receives the step outputs.",
    )
    args = parser.parse_args()

    try:
        filters = json.loads(Path(args.filters).read_text(encoding="utf-8"))[args.profile]
    except KeyError:
        print(f"::error::No '{args.profile}' section in {args.filters}", file=sys.stderr)
        return 1

    if args.all or os.environ.get("GITHUB_EVENT_NAME") in _FORCE_ALL_EVENTS:
        changed = None
    elif args.changed:
        text = Path(args.changed).read_text(encoding="utf-8")
        changed = [line.strip() for line in text.splitlines() if line.strip()]
    else:
        changed = changed_paths()

    if changed is None:
        print("Changed files: unknown (failing open, every surface runs)")
    else:
        print("Changed files:")
        for path in changed:
            print(f"  {path}")

    results: dict[str, bool] = {}
    for name, patterns in filters.items():
        candidates = [patterns] if isinstance(patterns, str) else list(patterns)
        if changed is None:
            results[name] = True
            continue
        regexes = [to_regex(pattern) for pattern in candidates]
        results[name] = any(regex.match(path) for regex in regexes for path in changed)

    print("Detected:")
    for name, hit in results.items():
        print(f"  {name}={'true' if hit else 'false'}")

    if args.github_output:
        with open(args.github_output, "a", encoding="utf-8") as handle:
            for name, hit in results.items():
                handle.write(f"{name}={'true' if hit else 'false'}\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
