async function buildNav() {
  let data;
  try {
    const res = await fetch("/projects.json");
    data = await res.json();
  } catch (e) {
    console.warn("projects.json failed to load");
    return;
  }

  const sub = document.getElementById("projects-sub");
  if (!sub) return;

  const DROPDOWN_PROJECTS = ["pagitan", "filipinoparade", "filmphotography"];

  data.projects
    .filter(p => DROPDOWN_PROJECTS.includes(p.folder))
    .forEach(p => {
      const a = document.createElement("a");
      a.className = "menu-item";
      a.textContent = p.folder === "filipinoparade" ? "Philippine's Parade, NY 2023" : p.label;
      a.href = `/collaborations/viewer.html?project=${p.folder}&label=${encodeURIComponent(p.label)}`;
      sub.appendChild(a);
    });

  const path = window.location.pathname;

  if (path.includes("/collaborations/index")) {
    document.getElementById("nav-collaborations")?.classList.add("active");
  }

  if (path.includes("/commission/index")) {
    document.getElementById("nav-commission")?.classList.add("active");
  }

  const params = new URLSearchParams(window.location.search);
  const currentProject = params.get("project");

  if (currentProject) {
    if (DROPDOWN_PROJECTS.includes(currentProject)) {
      const links = sub.querySelectorAll("a");
      links.forEach(link => {
        if (link.href.includes(`project=${currentProject}`)) {
          link.classList.add("active");
          sub.classList.add("open");
          const btn = document.querySelector(".menu-parent");
          if (btn) {
            btn.classList.add("open");
            btn.setAttribute("aria-expanded", "true");
          }
        }
      });
    } else {
      document.getElementById("nav-collaborations")?.classList.add("active");
    }
  }

  buildHamburger();
}

function buildHamburger() {
  if (document.querySelector(".hamburger")) return;
  const btn = document.createElement("button");
  btn.className = "hamburger";
  btn.setAttribute("aria-label", "Menu");
  btn.innerHTML = `<span></span><span></span><span></span>`;
  btn.addEventListener("click", () => toggleMobileNav(btn));
  document.body.appendChild(btn);
}

function toggleMobileNav(btn) {
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;
  const open = sidebar.classList.toggle("mobile-open");
  btn.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
}

function toggleProjects(btn) {
  const sub = document.getElementById("projects-sub");
  if (!sub) return;
  const open = sub.classList.toggle("open");
  btn.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", open);
}

// Close mobile nav when a menu link is tapped
document.addEventListener("click", e => {
  if (e.target.closest(".sidebar a")) {
    const sidebar = document.querySelector(".sidebar");
    const btn = document.querySelector(".hamburger");
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (btn) btn.classList.remove("open");
    document.body.style.overflow = "";
  }
});

document.addEventListener("DOMContentLoaded", buildNav);