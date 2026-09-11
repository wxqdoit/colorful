const data = JSON.parse(document.getElementById("artwork").textContent);
const grid = document.querySelector(".grid"),
  search = document.querySelector("#search"),
  category = document.querySelector("#category"),
  scope = document.querySelector("#scope");
scope.value = new URLSearchParams(location.search).get("scope") || "";
let page = 0,
  filtered = data;
const escape = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
for (const name of [...new Set(data.map((d) => d.category))]) {
  const option = document.createElement("option");
  option.value = option.textContent = name;
  category.append(option);
}
function render() {
  const pages = Math.max(1, Math.ceil(filtered.length / 36));
  page = Math.min(page, pages - 1);
  grid.innerHTML =
    filtered
      .slice(page * 36, page * 36 + 36)
      .map(
        (d) =>
          `<article class="card"><header><h2>${escape(d.label)}</h2><span>${escape(d.category)}</span></header><div class="comparison"><div class="old">${d.old}<small>${escape(d.oldLabel)}</small></div><div class="new">${d.art}<small>Colorful</small></div></div><footer><code>${escape(d.name)}</code><button data-download="${escape(d.name)}">SVG ↓</button></footer></article>`,
      )
      .join("") || '<p class="empty">没有找到匹配的图标</p>';
  document.querySelector("#count").textContent =
    `${filtered.length.toLocaleString()} 枚`;
  document.querySelector("#page").textContent = `${page + 1} / ${pages}`;
  document.querySelector("#prev").disabled = page === 0;
  document.querySelector("#next").disabled = page === pages - 1;
}
function filter() {
  const q = search.value.trim().toLowerCase();
  filtered = data.filter(
    (d) =>
      (!category.value || d.category === category.value) &&
      (!scope.value || d.cohort === scope.value) &&
      [d.name, d.label, ...d.tags].join(" ").toLowerCase().includes(q),
  );
  page = 0;
  render();
}
search.oninput = filter;
category.onchange = filter;
scope.onchange = filter;
for (const dir of ["prev", "next"])
  document.querySelector("#" + dir).onclick = () => {
    page += dir === "prev" ? -1 : 1;
    render();
    document.querySelector(".toolbar").scrollIntoView({ block: "start" });
  };
for (const kind of ["size", "theme", "view"])
  for (const button of document.querySelectorAll(`button[data-${kind}]`))
    button.onclick = () => {
      const value = button.dataset[kind];
      if (kind === "size")
        document.documentElement.style.setProperty("--size", value + "px");
      if (kind === "theme")
        document.documentElement.classList.toggle("dark", value === "dark");
      if (kind === "view") grid.dataset.view = value;
      for (const item of document.querySelectorAll(`button[data-${kind}]`))
        item.setAttribute("aria-pressed", String(item === button));
    };
grid.addEventListener("click", (e) => {
  const name = e.target.closest("[data-download]")?.dataset.download;
  if (!name) return;
  let svg = data.find((d) => d.name === name).art;
  const theme = getComputedStyle(document.documentElement);
  svg = svg.replace(/var\((--project-art-[a-z]+),\s*[^)]+\)/g, (_, token) =>
    theme.getPropertyValue(token).trim(),
  );
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name + ".svg";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
filter();
