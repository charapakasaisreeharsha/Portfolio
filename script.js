function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}
document.querySelector('.projects-scroll-container').addEventListener('wheel', (evt) => {
  evt.preventDefault();
  document.querySelector('.projects-scroll-container').scrollLeft += evt.deltaY;
});
