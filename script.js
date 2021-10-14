let navBar;
let flapArrow;

document.addEventListener("DOMContentLoaded", (event) => {
  navBar = document.getElementById("navBar");
  flapArrow = document.getElementById("flapArrow");

  navBar.addEventListener("mouseenter", () => {
    navBar.classList.remove("hidden");
    flapArrow.classList.add("turned");
  });

  navBar.addEventListener("mouseleave", () => {
    navBar.classList.add("hidden");
    flapArrow.classList.remove("turned");
  });

  let links = document.getElementById("links").children;
  for (const link of links) {
    if (window.location.href == link.href) {
      let pointer = document.createElement("div");
      pointer.classList.add("pointer");
      link.appendChild(pointer);
    }
  }
});
