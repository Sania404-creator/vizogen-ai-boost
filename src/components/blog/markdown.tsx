import type { ReactNode } from "react";

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    if (match[1]) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-foreground">
          {match[1]}
        </strong>,
      );
    } else if (match[2]) {
      nodes.push(
        <em key={`${keyPrefix}-i-${i}`} className="italic">
          {match[2]}
        </em>,
      );
    }
    last = match.index + match[0].length;
    i += 1;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const CALLOUT_PREFIXES = ["**Action step:**", "**Fix:**", "**Your advantage:**", "**Tip:**"];

type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string; callout: boolean }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: { num: number; text: string }[] };

function parse(markdown: string): Block[] {
  const blocks: Block[] = [];
  const lines = markdown.split("\n");
  let paragraph: string[] = [];
  let list: string[] = [];
  let olList: { num: number; text: string }[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(" ").trim();
    paragraph = [];
    blocks.push({
      type: "p",
      text,
      callout: CALLOUT_PREFIXES.some((p) => text.startsWith(p)),
    });
  };
  const flushList = () => {
    if (listType === "ol" && olList.length) blocks.push({ type: "ol", items: olList });
    if (listType === "ul" && list.length) blocks.push({ type: "ul", items: list });
    list = [];
    olList = [];
    listType = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      flushList();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("# ")) continue;
    const ol = line.match(/^(\d+)\.\s+(.*)$/);
    if (ol) {
      flushParagraph();
      if (listType !== "ol") flushList();
      listType = "ol";
      olList.push({ num: Number(ol[1]), text: ol[2] });
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      if (listType !== "ul") flushList();
      listType = "ul";
      list.push(line.slice(2).trim());
      continue;
    }
    flushList();
    paragraph.push(line);
  }
  flushParagraph();
  flushList();
  return blocks;
}

export function Markdown({ content }: { content: string }) {
  const blocks = parse(content);
  return (
    <div className="text-[1.0625rem] leading-[1.8] text-muted-foreground">
      {blocks.map((block, index) => {
        const key = `b-${index}`;
        if (block.type === "h2") {
          return (
            <h2
              key={key}
              className="mt-12 mb-4 text-2xl font-bold tracking-tight text-foreground font-display sm:text-[1.75rem]"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "p") {
          if (block.callout) {
            return (
              <p
                key={key}
                className="my-6 rounded-2xl border border-primary/15 bg-primary/[0.06] px-5 py-4 text-base leading-relaxed"
              >
                {renderInline(block.text, key)}
              </p>
            );
          }
          return (
            <p key={key} className="my-5">
              {renderInline(block.text, key)}
            </p>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={key} className="my-6 space-y-3 pl-1">
              {block.items.map((item, i) => (
                <li key={`${key}-${i}`} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[0.6rem] size-2 shrink-0 rounded-full gradient-brand"
                  />
                  <span>{renderInline(item, `${key}-${i}`)}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <ol key={key} className="my-6 space-y-3">
            {block.items.map((item, i) => (
              <li key={`${key}-${i}`} className="flex gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg gradient-brand text-xs font-semibold text-white font-mono">
                  {item.num}
                </span>
                <span>{renderInline(item.text, `${key}-${i}`)}</span>
              </li>
            ))}
          </ol>
        );
      })}
    </div>
  );
}
