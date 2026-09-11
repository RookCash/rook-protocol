/*
  Register pattern (standing rule 1): every external fact is one record
  with an explicit status. "absent" and "unconfirmed" records render
  inert and carry the date they were last checked. Nothing here is
  hardcoded into markup — every count and link is derived from this file.
*/
const ROOK_REGISTER = {
  chain: {
    status: "stated",
    name: "Robinhood Chain",
    chainIdHex: "0x1237",
    chainIdDec: 4663,
    rpcUrl: "https://rpc.mainnet.chain.robinhood.com",
    source: "client statement, 2026-09-02, batch-level",
  },
  contractAddress: {
    status: "absent",
    value: null,
    note: "No contract address has been stated yet. This field activates the moment one is.",
  },
  socials: [
    {
      id: "x",
      status: "stated",
      label: "X",
      url: "https://x.com/Rook_Cash",
      verifiedAt: "2026-09-11",
      verification:
        'Loaded logged out: bio reads "Rook routes verified AI inference. Buy compute or put idle GPUs to work.", joined September 2026.',
    },
    {
      id: "github",
      status: "stated",
      label: "GitHub",
      url: "https://github.com/RookCash/rook-protocol",
      verifiedAt: "2026-09-11",
      verification: "curl without -L returned HTTP 200, no redirect.",
    },
  ],
};

// Link rule (standing rule 2): handle is always derived from the stored URL, never typed twice.
function deriveHandle(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/^\/+|\/+$/g, "");
    return path ? `@${path.split("/")[0]}` : u.hostname;
  } catch {
    return null;
  }
}

// Pure decision function for the CA gate (standing rule 3): never blanket-reject
// an 0x-shaped string, only compare it to the stated register value. Kept pure
// and exported so gates.js can prove it fails on throwaway input.
function evaluateCaGate(record, submitted) {
  const value = (submitted || "").trim();
  if (record.status !== "stated" || !record.value) return "no-address-stated";
  return value.toLowerCase() === record.value.toLowerCase() ? "match" : "no-match";
}

if (typeof module !== "undefined") {
  module.exports = { ROOK_REGISTER, deriveHandle, evaluateCaGate };
}
