import h from "@macrostrat/hyper";

function Citation({ doi, children }) {
  return h("a.citation", { href: `https://dx.doi.org/${doi}` }, children);
}

function Credits() {
  return h("div.credits", [
    h("h1", "Neogene marginal modification of western North America"),
    h("p", [
      "The ",
      h(Citation, { doi: "10.1029/2003TC001621" }, "Wilson et al., 2005"),
      " plate reconstruction model animated using the ",
      h("a", { href: "https://github.com/UW-Macrostrat/corelle" }, "Corelle"),
      " plate-rotation engine.",
    ]),
    h("p", [h("a.author", { href: "https://davenquinn.com" }, "Daven Quinn")]),
    h("p", [
      h("span.version", "v1.0.0"),
      ", ",
      h("span.date", "September 2020"),
    ]),
    h("p", [
      h(
        "a",
        { href: "https://github.com/davenquinn/corelle-demo-wilson2005" },
        "Code on GitHub"
      ),
    ]),
  ]);
}

export { Credits };
