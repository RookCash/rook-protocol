(function () {
  "use strict";

  function bySocial(id) {
    return ROOK_REGISTER.socials.find((s) => s.id === id);
  }

  function renderCA() {
    const record = ROOK_REGISTER.contractAddress;
    const wrap = document.querySelectorAll("[data-ca-slot]");
    wrap.forEach((slot) => {
      const valueEl = slot.querySelector("[data-ca-value]");
      const btn = slot.querySelector("[data-ca-copy]");
      const statusEl = slot.querySelector("[data-ca-status]");
      slot.setAttribute("data-ca-registry-status", record.status);

      if (record.status !== "stated" || !record.value) {
        valueEl.textContent = "Contract address not yet stated";
        statusEl.textContent = record.status.toUpperCase();
        slot.classList.add("is-inert");
        btn.disabled = true;
        btn.setAttribute("aria-disabled", "true");
        return;
      }

      valueEl.textContent = record.value;
      statusEl.textContent = "LIVE";
      slot.classList.remove("is-inert");
      btn.disabled = false;
      btn.removeAttribute("aria-disabled");
      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(record.value).then(() => {
          const original = btn.textContent;
          btn.textContent = "Copied";
          btn.classList.add("is-copied");
          setTimeout(() => {
            btn.textContent = original;
            btn.classList.remove("is-copied");
          }, 1600);
        });
      });
    });
  }

  function renderSocials() {
    document.querySelectorAll("[data-social]").forEach((el) => {
      const id = el.getAttribute("data-social");
      const record = bySocial(id);
      if (!record) return;
      if (record.status === "stated" && record.url) {
        el.setAttribute("href", record.url);
        el.setAttribute("data-status", "stated");
        el.removeAttribute("aria-disabled");
      } else {
        el.removeAttribute("href");
        el.setAttribute("data-status", record.status);
        el.setAttribute("aria-disabled", "true");
      }
    });
  }

  function renderRegistryPanel() {
    const list = document.querySelector("[data-registry-list]");
    if (!list) return;
    const rows = [
      {
        label: "Chain",
        status: ROOK_REGISTER.chain.status,
        detail: `${ROOK_REGISTER.chain.name} · chain id ${ROOK_REGISTER.chain.chainIdDec} (${ROOK_REGISTER.chain.chainIdHex})`,
        source: ROOK_REGISTER.chain.source,
      },
      {
        label: "Contract address",
        status: ROOK_REGISTER.contractAddress.status,
        detail: ROOK_REGISTER.contractAddress.value || ROOK_REGISTER.contractAddress.note,
        source: null,
      },
      ...ROOK_REGISTER.socials.map((s) => ({
        label: s.label,
        status: s.status,
        detail: s.status === "stated" ? deriveHandle(s.url) : "not stated",
        source: s.verification,
      })),
    ];
    list.innerHTML = "";
    rows.forEach((row) => {
      const li = document.createElement("li");
      li.className = "registry-row";
      li.innerHTML = `
        <span class="registry-badge" data-status="${row.status}">${row.status}</span>
        <span class="registry-label">${row.label}</span>
        <span class="registry-detail">${row.detail}</span>
        ${row.source ? `<span class="registry-source">${row.source}</span>` : ""}
      `;
      list.appendChild(li);
    });
    const countEl = document.querySelector("[data-registry-count]");
    if (countEl) countEl.textContent = String(rows.length);
  }

  function initCaGate() {
    const form = document.querySelector("[data-ca-gate-form]");
    if (!form) return;
    const input = form.querySelector("[data-ca-gate-input]");
    const result = document.querySelector("[data-ca-gate-result]");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const outcome = evaluateCaGate(ROOK_REGISTER.contractAddress, input.value);
      result.setAttribute("data-gate-outcome", outcome);
      const copy = {
        "no-address-stated": "Rook has not stated a contract address. Nothing pasted here can pass.",
        match: "Matches the address in the register.",
        "no-match": "Does not match the address in the register.",
      };
      result.textContent = copy[outcome];
    });
  }

  function initNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav-menu]");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderCA();
    renderSocials();
    renderRegistryPanel();
    initCaGate();
    initNav();
  });
})();
