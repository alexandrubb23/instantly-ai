import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const aiService = {
  async draftEmail(reply, prompt, recipientBusiness) {
    // 1) Route (sales | followup)
    const routeRes = await streamText({
      model: openai("gpt-4o-mini"),
      system:
        'You are a router. Classes: "sales", "followup". Output exactly one word: sales or followup.',
      prompt,
    });
    const isSales = (await routeRes.text)
      .trim()
      .toLowerCase()
      .includes("sales");

    // 2) Assistant system prompt
    const system = isSales
      ? `You are Sales Assistant.
- Tailor to: ${recipientBusiness ?? "unknown"}.
- Keep under 40 words total. Max 7–10 words/sentence.
- OUTPUT FORMAT (exactly):
[[SUBJECT]]
<subject text, may be multiple short sentences>
[[BODY]]
<body text, may be multiple short sentences>`
      : `You are Follow-up Assistant.
- Polite follow-up (“just checking in”).
- Keep under 40 words total. Max 7–10 words/sentence.
- OUTPUT FORMAT (exactly):
[[SUBJECT]]
<subject text, may be multiple short sentences>
[[BODY]]
<body text, may be multiple short sentences>`;

    // 3) Start generation
    const gen = await streamText({
      model: openai("gpt-4o-mini"),
      system,
      prompt,
    });

    reply.raw.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
    reply.raw.setHeader("Cache-Control", "no-cache, no-transform");
    reply.raw.setHeader("X-Accel-Buffering", "no");

    const write = (obj) => reply.raw.write(JSON.stringify(obj) + "\n");

    let buf = "";
    let haveSubject = false;
    let inBody = false;

    const SUBJECT_TAG = "[[SUBJECT]]";
    const BODY_TAG = "[[BODY]]";

    for await (const chunk of gen.textStream) {
      buf += chunk;

      // Ensure we start only after [[SUBJECT]]
      let subjIdx = buf.indexOf(SUBJECT_TAG);
      if (!haveSubject && subjIdx >= 0) {
        // Keep only text after [[SUBJECT]]
        buf = buf.slice(subjIdx + SUBJECT_TAG.length);
        haveSubject = true;
      }

      if (haveSubject && !inBody) {
        // Look for [[BODY]] marker
        const bodyIdx = buf.indexOf(BODY_TAG);
        if (bodyIdx >= 0) {
          const subjectText = buf.slice(0, bodyIdx).trim();
          if (subjectText) write({ field: "subject", delta: subjectText });
          buf = buf.slice(bodyIdx + BODY_TAG.length);
          inBody = true;

          // Immediately flush any accumulated body text
          const bodyInit = buf.trim();
          if (bodyInit) write({ field: "body", delta: bodyInit });
          buf = "";
          continue;
        }
        // No [[BODY]] yet — keep waiting (don’t emit partial subject)
        continue;
      }

      if (inBody && buf) {
        // Stream body continuously
        const delta = buf.trim();
        if (delta) write({ field: "body", delta });
        buf = "";
      }
    }

    // Stream finished: flush leftovers
    if (haveSubject && !inBody) {
      const leftoverSubject = buf.trim();
      if (leftoverSubject) write({ field: "subject", delta: leftoverSubject });
    }
    if (inBody && buf.trim()) {
      write({ field: "body", delta: buf.trim() });
    }

    write({ event: "done" });
    reply.raw.end();
  },
};
