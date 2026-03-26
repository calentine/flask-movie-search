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

/**
 * Shared function to render a movie grid from localStorage for both watchlist and watched pages
 */
function renderStoredMovieGrid(storageKey, gridId, emptyId, clearBtnId, templateHtml) {
    const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const grid = document.getElementById(gridId);
    const empty = document.getElementById(emptyId);
    const clearBtn = document.getElementById(clearBtnId);

    if (data.length === 0) {
        if (empty) empty.classList.remove("hidden");
        if (clearBtn) clearBtn.classList.add("hidden");
        return;
    }

    if (clearBtn) clearBtn.classList.remove("hidden");
    
    let htmlContent = "";
    data.forEach(movie => {
        htmlContent += templateHtml
            .replace(/ID_VAL/g, movie.id)
            .replace(/TITLE_VAL/g, movie.title)
            .replace(/POSTER_VAL/g, movie.poster ? `https://image.tmdb.org/t/p/w500${movie.poster}` : '')
            .replace(/VOTE_VAL/g, movie.rating || '0')
            .replace(/DATE_VAL/g, movie.release_date || 'N/A');
    });
    
    grid.innerHTML = htmlContent;
}

/**
 * Shared clear function
 */
function clearStorageList(storageKey) {
    if(confirm(`Delete everything in this list?`)) {
        localStorage.removeItem(storageKey);
        location.reload();
    }
}
