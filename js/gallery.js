

async function loadGrid(category){

  const res = await fetch("/projects.json");
  const data = await res.json();

  const grid = document.getElementById("grid");
  if(!grid) return;

  console.log(data.projects);
  console.log("category:", category);
  
  data.projects
  .filter(p => p.category === category)
  .forEach(p => {

    const a = document.createElement("a");
    a.className = "project";

    a.href =
      `/collaborations/viewer.html?project=${p.folder}&label=${encodeURIComponent(p.label)}`;

    a.innerHTML = `
      <div class="project-img-wrap">
        <img src="${p.thumbnail}" alt="${p.label}">
      </div>
      <p class="project-label">${p.label}</p>
    `;

    grid.appendChild(a);

  });

}