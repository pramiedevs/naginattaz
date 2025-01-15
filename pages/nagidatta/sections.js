document.addEventListener("DOMContentLoaded", () => {
    // Data for the sections and their video content
    const contentData = {
        music: {
            title: "Music",
            videos: [
                "https://www.youtube.com/embed/0dsjuPZsNwQ",
                "https://www.youtube.com/embed/EwDLdur0WDA",
                "https://www.youtube.com/embed/xBYiWbfv_Dw",
                "https://www.youtube.com/embed/JCAEEdZdRiI",
                "https://www.youtube.com/embed/bWzzkD78ETA",
                "https://www.youtube.com/embed/77pzXjonzkg",
                "https://www.youtube.com/embed/-HZOdRaeXmA",
                "https://www.youtube.com/embed/YfWSMMPnTiI",
                "https://www.youtube.com/embed/xXWGEH74w20",
                "https://www.youtube.com/embed/2jhxIY3WNw0",
                "https://www.youtube.com/embed/yCxVzCe2N1Y",
                "https://www.youtube.com/embed/XL3ENrZwjmw",
                "https://www.youtube.com/embed/eKHu1m0Fh30",
                "https://www.youtube.com/embed/JyRwsjnBibU",
                "https://www.youtube.com/embed/K5YioamtSqA",
                "https://www.youtube.com/embed/tp8K_vwI9u4",
                "https://www.youtube.com/embed/6NCbopZmA4A"
            ]
        },
        culture: {
            title: "Culture",
            videos: [
                "https://www.youtube.com/embed/jcOUYOg-dAM",
                "https://www.youtube.com/embed/Sm3fMuUN9FM",
                "https://www.youtube.com/embed/7DXD1HBaLX0",
                "https://www.youtube.com/embed/RxoWyGFSGuk",
                "https://www.youtube.com/embed/qQ9mSjBb8sA",
                "https://www.youtube.com/embed/aCbcbKZjjdA",
                "https://www.youtube.com/embed/4R5h8P9Uecw"
            ]
        },
        dance: {
            title: "Dance",
            videos: [
                "https://www.youtube.com/embed/OKbwCxXNhaU",
                "https://www.youtube.com/embed/zs_gP_bbC8g",
                "https://www.youtube.com/embed/CPjDG5iK24k",
                "https://www.youtube.com/embed/9wXkcJDnJWE"
            ]
        }
    };

    // Select elements from the DOM
    const mainSections = document.getElementById("main-sections");
    const activeContainer = document.getElementById("active-container");
    const activeContent = document.getElementById("active-content");
    const closeButton = document.getElementById("close-button");

    // Handle clicks on main sections
    mainSections.addEventListener("click", (e) => {
        const section = e.target.closest(".section");
        if (!section) return;

        // Check if the section has a data-url attribute for redirection
        const url = section.dataset.url;
        if (url) {
            window.location.href = url; // Redirect to the specified URL
            return;
        }

        // Handle active sections for other content keys
        const contentKey = section.dataset.activeSection;
        if (contentKey && contentData[contentKey]) {
            const { title, videos } = contentData[contentKey];

            // Generate the grid of videos (only 4 initially)
            const videoGrid = videos.slice(0, 4).map(video => `
                <iframe 
                    width="100%" 
                    height="200" 
                    src="${video}" 
                    frameborder="0" 
                    allowfullscreen>
                </iframe>
            `).join("");

            // Create the "scroll down" arrow if there are more than 4 videos
            const scrollDownArrow = videos.length > 4 ? `
                <div class="scroll-down-arrow" id="scroll-arrow">↓</div>
            ` : "";

            // Populate the active section with title, video grid, and scroll arrow if applicable
            activeContent.innerHTML = `
                <h2>${title}</h2>
                <div class="video-grid-container" id="video-grid-container">
                    <div class="video-grid" id="video-grid">
                        ${videoGrid}
                    </div>
                    ${scrollDownArrow}
                </div>
            `;

            // Show the main section
            mainSections.style.display = "none";
            activeContainer.style.display = "flex";

            // Show the close button
            closeButton.style.display = "block";

            // Scroll functionality
            if (videos.length > 4) {
                const videoGridContainer = document.getElementById("video-grid-container");
                const videoGridElement = document.getElementById("video-grid");
                const scrollArrow = document.getElementById("scroll-arrow");

                let scrollIndex = 4;

                // Show scroll-down arrow if there are more than 4 videos
                videoGridContainer.classList.add("show-arrow");

                // Handle scrolling on the arrow click
                scrollArrow.addEventListener("click", () => {
                    if (scrollIndex < videos.length) {
                        videoGridElement.style.transform = `translateY(-${scrollIndex * 220}px)`;
                        scrollIndex += 4;

                        // If we've reached the end, hide the arrow
                        if (scrollIndex >= videos.length) {
                            scrollArrow.style.display = "none";
                        }
                    }
                });
            }
        }
    });

    // Handle clicks on the close button
    closeButton.addEventListener("click", () => {
        // Hide the active container and show the main sections
        activeContainer.style.display = "none";
        mainSections.style.display = "flex";

        // Hide the close button again
        closeButton.style.display = "none";
    });
});
