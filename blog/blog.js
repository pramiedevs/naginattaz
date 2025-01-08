document.addEventListener("DOMContentLoaded", () => {
    const map = document.getElementById("map");
    const fullArticle = document.getElementById("full-article");
    const fullArticleContent = document.getElementById("full-article-content");
    const closeArticle = document.getElementById("close-article");


    let isMobile = window.matchMedia("(max-width: 960px)").matches;

    let x = isMobile ? 50 : 13; // Center horizontally on mobile (50%)
    let y = isMobile ? 20 : 10; // Adjust padding from the top
    let direction = isMobile ? 0 : 1; // Use column layout on mobile
    
    fetch("/articles.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(articles => {
            articles.forEach((article, index) => {
                // Create article card
                const card = document.createElement("div");
                card.className = "article-card";
                card.style.left = isMobile ? "50%" : `${x}%`;
                card.style.transform = isMobile ? "translateX(-50%)" : "none"; // Center horizontally on mobile
                card.style.top = `${y}%`;
                card.innerHTML = `
                    <img src="${article.img}" alt="${article.title}">
                    <h3>${article.title}</h3>
                    <small>${article.createdAt}</small>
                `;
                
                if (isMobile) {
                    // For mobile, stack articles vertically with 20% spacing
                    y += 70;
                } else {
                    // For desktop, alternate between left and right
                    if (direction === 1) {
                        x += 45; // Move right
                    } else {
                        x -= 45; // Move left
                    }
                    y += 45; // Move down for the next row
                    direction *= -1; // Switch direction for next article
    
                    // Ensure articles stay within bounds
                    if (x < 10) x = 10;
                    if (x > 90) x = 90;
                }
                card.addEventListener("click", () => {
                    const isAdminMode = localStorage.getItem("isAdminMode") === "true";
                
                    fullArticleContent.innerHTML = `
                        <small>Created on: ${article.createdAt}</small>
                        <h2>${article.title}</h2>
                        <img src="${article.img}" alt="${article.title}" class="article-image" style="max-width: 100%;">
                        <p>${article.text}</p>
                        ${
                            isAdminMode
                                ? `<div class="article-controls">
                                     <button class="upload-button">Change Picture URL</button>
                                     <button class="edit-button">Edit</button>
                                     <button class="delete-button">Delete</button>
                                   </div>`
                                : ""
                        }
                    `;
                
                    // Make the fullArticle visible
                    fullArticle.style.display = "flex"; // Ensure fullArticle is set to visible
                
                    // Attach event listeners to the buttons if admin mode is active
                    if (isAdminMode) {
                        setupArticleActions(article, fullArticleContent);
                    }
                });
                map.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching articles:", error);
        });
    


    // Close full article
    closeArticle.addEventListener("click", () => {
        fullArticle.style.display = "none";
    });

    // Dragging functionality
    let isDragging = false;
    let startX, startY;

    map.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        map.style.cursor = "grabbing";
    });

    map.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        map.scrollLeft -= dx;
        map.scrollTop -= dy;

        startX = e.clientX;
        startY = e.clientY;
    });

    map.addEventListener("mouseup", () => {
        isDragging = false;
        map.style.cursor = "grab";
    });

    map.addEventListener("mouseleave", () => {
        isDragging = false;
        map.style.cursor = "grab";
    });

    function setupArticleActions(article, articleElement) {
        const uploadButton = articleElement.querySelector(".upload-button");
        const editButton = articleElement.querySelector(".edit-button");
        const deleteButton = articleElement.querySelector(".delete-button");
    
        if (uploadButton) {
            uploadButton.addEventListener("click", () => {
                // Handle Change Picture URL
                const imageElement = articleElement.querySelector(".article-image");
            uploadButton.remove();
    
            const inputField = document.createElement("input");
            inputField.type = "text";
            inputField.className = "url-input";
            inputField.placeholder = "Enter new image URL";
    
            const saveButton = document.createElement("button");
            saveButton.className = "save-url";
            saveButton.textContent = "Save";
    
            imageElement.insertAdjacentElement("afterend", inputField);
            inputField.insertAdjacentElement("afterend", saveButton);
    
            saveButton.addEventListener("click", () => {
                const newUrl = inputField.value.trim();
                if (newUrl) {
                    article.img = newUrl; // Update local object
                    updateImageUrl(article.id, newUrl, articleElement); // Update server
    
                    inputField.remove();
                    saveButton.remove();
    
                    uploadButton.textContent = "Change Picture URL";
                    articleElement.querySelector(".article-controls").appendChild(uploadButton);
                    setupArticleActions(article, articleElement);
                } else {
                    alert("Please enter a valid URL.");
                }
            });
            });
        }
        
        if (editButton) {
            editButton.addEventListener("click", () => {
                const titleElement = articleElement.querySelector("h2");
            const textElement = articleElement.querySelector("p");
        
            if (titleElement.isContentEditable) {
                // Save changes
                const newTitle = titleElement.textContent.trim();
                const newText = textElement.innerHTML.trim(); // Use innerHTML to preserve formatting
        
                titleElement.contentEditable = "false";
                textElement.contentEditable = "false";
                editButton.textContent = "Edit";
        
                // Save the updated content to the server
                fetch("/update-article", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: article.id, title: newTitle, text: newText }),
                })
                    .then(response => {
                        if (!response.ok) throw new Error("Failed to update article.");
                        article.title = newTitle;
                        article.text = newText;
                        console.log("Article updated successfully.");
                        location.reload();
                    })
                    .catch(error => console.error("Error updating article:", error));
            } else {
                // Enable editing
                titleElement.contentEditable = "true";
                textElement.contentEditable = "true";
                editButton.textContent = "Save";
            }
            });
        }
        
        if (deleteButton) {
            deleteButton.addEventListener("click", () => {
                if (confirm("Are you sure you want to delete this article?")) {
                    fetch("/delete-article", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ id: article.id }),
                    })
                        .then(response => {
                            if (!response.ok) throw new Error("Failed to delete article.");
                            fullArticle.style.display = "none";
                            document.querySelector(`.article-card[data-id="${article.id}"]`).remove();
                            console.log("Article deleted successfully.");
                            location.reload();
    
                        })
                        .catch(error => console.error("Error deleting article:", error));
                }
            });
        }
        
    }

    // Update image URL on the server
    function updateImageUrl(id, newUrl, articleElement) {
        fetch(`/update-image-url`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id, img: newUrl }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to update image URL.");
                }
                return response.json();
            })
            .then(data => {
                console.log("Image URL updated successfully:", data);
                const imageElement = articleElement.querySelector(".article-image");
                imageElement.src = newUrl;
            })
            .catch(error => {
                console.error("Error updating image URL:", error);
                alert("Failed to update image URL. Please try again.");
            });
    }

    function toggleAdminControls(isAdmin) {
        const controls = document.querySelectorAll(".upload-button, .edit-button, .delete-button");
        controls.forEach(control => {
            control.style.display = isAdmin ? "inline-block" : "none"; // Show only if admin mode is active
        });
    }
});
