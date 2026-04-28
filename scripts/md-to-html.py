"""Render an email .md (with YAML frontmatter) to HTML for `outlook --html`.

Supports the small subset of markdown used in emails/*.md:
  - **bold**, *italic*, `code`
  - "- " bullet lists
  - bare http(s) URLs and email addresses (auto-linked)
  - paragraphs separated by blank lines

Usage:
    python scripts/md-to-html.py emails/headcount-paid.md > out.html
"""

import re
import sys
from html import escape


def strip_frontmatter(text: str) -> str:
    if not text.startswith("---\n"):
        return text
    end = text.find("\n---\n", 4)
    if end == -1:
        return text
    return text[end + 5 :].lstrip("\n")


URL_RE = re.compile(r"(https?://[^\s<>)\"]+)")
EMAIL_RE = re.compile(r"([\w.+-]+@[\w-]+\.[\w.-]+)")
BOLD_RE = re.compile(r"\*\*(.+?)\*\*")
ITALIC_RE = re.compile(r"(?<!\*)\*([^*\n]+?)\*(?!\*)")
CODE_RE = re.compile(r"`([^`\n]+?)`")


def render_inline(text: str) -> str:
    # Escape first, then apply tag substitutions on the escaped text.
    out = escape(text, quote=False)
    out = CODE_RE.sub(lambda m: f"<code>{m.group(1)}</code>", out)
    out = BOLD_RE.sub(lambda m: f"<strong>{m.group(1)}</strong>", out)
    out = ITALIC_RE.sub(lambda m: f"<em>{m.group(1)}</em>", out)
    out = URL_RE.sub(lambda m: f'<a href="{m.group(1)}">{m.group(1)}</a>', out)
    out = EMAIL_RE.sub(
        lambda m: f'<a href="mailto:{m.group(1)}">{m.group(1)}</a>'
        if not m.group(0).startswith(('"', "'"))
        else m.group(0),
        out,
    )
    return out


def render(md: str) -> str:
    body = strip_frontmatter(md).strip("\n")
    lines = body.split("\n")
    blocks: list[str] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if not line.strip():
            i += 1
            continue
        if line.lstrip().startswith("- "):
            items = []
            while i < len(lines) and lines[i].lstrip().startswith("- "):
                items.append(render_inline(lines[i].lstrip()[2:]))
                i += 1
            li = "\n".join(f"  <li>{it}</li>" for it in items)
            blocks.append(f"<ul>\n{li}\n</ul>")
            continue
        para_lines = []
        while i < len(lines) and lines[i].strip() and not lines[i].lstrip().startswith("- "):
            para_lines.append(lines[i])
            i += 1
        rendered = "<br>\n".join(render_inline(pl) for pl in para_lines)
        blocks.append(f"<p>{rendered}</p>")

    body_html = "\n".join(blocks)
    return (
        '<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;'
        'font-size:14px;line-height:1.5;color:#1f2328;">\n'
        f"{body_html}\n"
        "</div>\n"
    )


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: md-to-html.py <path.md>", file=sys.stderr)
        sys.exit(2)
    with open(sys.argv[1], "r", encoding="utf-8") as f:
        md = f.read()
    sys.stdout.write(render(md))
