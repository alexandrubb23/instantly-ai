// Put this in a utils file
export function smartAppend(prev: string, incoming: string) {
  // Normalize weird whitespace in the incoming chunk
  let delta = incoming.replace(/\s+/g, " ");

  // Trim trailing spaces in prev to avoid "word ␣." cases
  let base = prev.replace(/[ \t]+$/g, "");
  const last = base.slice(-1);

  const startsContraction = /^['’](re|s|ll|ve|d|m|t)\b/i.test(delta);
  const startsWordChar = /^[A-Za-z0-9]/.test(delta);

  // Decide if we need a space between base and delta
  const needSpace =
    // there is existing text
    base.length > 0 &&
    // next token is a word (not punctuation, quote, or contraction)
    startsWordChar &&
    !startsContraction &&
    // previous char isn't whitespace or an opening bracket/paren/quote/hyphen
    !/\s|[(\[{“"'-]$/.test(last || "");

  let out = base + (needSpace ? " " : "") + delta;

  // Cleanup common spacing issues:
  out = out
    // no space before closing punctuation
    .replace(/\s+([.,!?;:])/g, "$1")
    // no space before close quotes/apostrophes
    .replace(/\s+([’'"])/g, "$1")
    // no space after opening paren/quote/bracket
    .replace(/([(\[{“"])\s+/g, "$1")
    // no space before closing paren/bracket
    .replace(/\s+([)\]}])/g, "$1")
    // collapse doubles
    .replace(/\s{2,}/g, " ");

  return out;
}
