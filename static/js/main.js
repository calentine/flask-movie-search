// Function to check localStorage and update icons accordingly
const updateIconIfDataExists = (localStorageKey, elementId, activeIconName) => {
  const data = JSON.parse(localStorage.getItem(localStorageKey) || "[]");
  const iconElement = document.getElementById(elementId);

  if (data.length > 0 && iconElement) {
    iconElement.setAttribute("name", activeIconName);
  }
};

// Execute for both badges
updateIconIfDataExists("codeje_watchlist", "watchlistBadge", "bookmark");
updateIconIfDataExists("codeje_watched", "watchedBadge", "checkmark-circle");

// Toggle for the mobile menu found in _search_bar.html
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu"); // Found in _nav.html

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("hidden");
    // Swap icon between menu and close
    const icon = menuToggle.querySelector("ion-icon");
    icon.name = icon.name === "menu-outline" ? "close-outline" : "menu-outline";
  });
}
