document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('admin-button').addEventListener('click', toggleAdminMode);
});

function toggleAdminMode() {
    const buttonsToToggle = document.querySelectorAll('.hidden-button');

    // Toggle visibility of all hidden buttons
    buttonsToToggle.forEach(button => {
        button.classList.toggle('hidden-button');
    });

    // Ensure "Crear nueva entrada de blog" button exists
    const leftButtonDiv = document.querySelector('.left-button');
    if (leftButtonDiv) {
        console.log('Found left-button container:', leftButtonDiv);

        let createBlogEntryButton = document.getElementById('create-blog-entry');
        if (!createBlogEntryButton) {
            console.log('Creating "Crear nueva entrada de blog" button...');
            
            // Dynamically create the button
            createBlogEntryButton = document.createElement('button');
            createBlogEntryButton.id = 'create-blog-entry';
            createBlogEntryButton.textContent = 'Crear nueva entrada de blog';
            createBlogEntryButton.className = 'hidden-button'; // Start hidden

            // Append the button to the left-button container
            leftButtonDiv.appendChild(createBlogEntryButton);
            console.log('Button created:', createBlogEntryButton);

            // Add functionality to the button
            createBlogEntryButton.addEventListener('click', showCreateBlogForm);
        }

        // Toggle visibility
        createBlogEntryButton.classList.toggle('hidden-button');
    } else {
        console.error('Left button container not found.');
    }
}

function showCreateBlogForm() {
    alert('Mostrar formulario para crear nueva entrada de blog.');
}

function showCreateBlogForm() {
    console.log('Creating form for new blog entry...');

    // Create the form container
    const formContainer = document.createElement('div');
    formContainer.id = 'create-blog-form-container';
    formContainer.innerHTML = `
        <form id="create-blog-form">
            <h3>Crear nueva entrada de blog</h3>
            <label for="title">Título:</label>
            <input type="text" id="title" name="title" required placeholder="Enter the title">
            
            <label for="text">Texto:</label>
            <textarea id="text" name="text" required placeholder="Enter the text"></textarea>

            <label for="img">Imagen URL:</label>
            <input type="text" id="img" name="img" required placeholder="Enter the image URL">

            <button type="submit">Guardar</button>
            <button type="button" id="cancel-button">Cancelar</button>
        </form>
    `;

    // Append the form to the left-button container (or wherever you'd like to display it)
    const leftButtonDiv = document.querySelector('.left-button');
    leftButtonDiv.appendChild(formContainer);

    // Show the form (by default, it will be displayed)
    formContainer.classList.remove('hidden-button');

    // Add event listener for form submission
    document.getElementById('create-blog-form').addEventListener('submit', handleFormSubmit);

    // Add event listener for the cancel button
    document.getElementById('cancel-button').addEventListener('click', () => {
        formContainer.remove();
    });
}

function handleFormSubmit(event) {
    event.preventDefault();  // Prevent default form submission

    const title = document.getElementById('title').value;
    const text = document.getElementById('text').value;
    const img = document.getElementById('img').value;

    // Add new article data to the articlesData array
    const newArticle = {
        id: articlesData.length + 1,
        title: title,
        text: text,
        img: img
    };

    articlesData.push(newArticle);

    // Save the updated articles
    saveArticles();

    // Remove the form after submission
    document.getElementById('create-blog-form-container').remove();
}

function saveArticles() {
    console.log('Saving articles:', JSON.stringify(articlesData, null, 2));
    alert('Artículo guardado con éxito.');
    renderArticles();  // Re-render the articles to show the new one
}


document.addEventListener('DOMContentLoaded', () => {
    const articlesContainer = document.querySelector('main');
    let articlesData = [];

    // Fetch JSON Data
    function fetchArticles() {
        return fetch('articles.json')
            .then(response => response.json())
            .then(data => {
                articlesData = data;
                renderArticles();
            });
    }

    // Render Articles
    function renderArticles() {
        const articlesContainer = document.getElementById('home'); // Assuming the main container is #home
        articlesContainer.innerHTML = ''; // Clear existing articles
        articlesData.forEach((article, index) => {
            const articleElement = createArticleElement(article, index);
            articlesContainer.appendChild(articleElement);
        });
    }

    // Create Article Element
    function createArticleElement(article, index) {
        const articleEl = document.createElement('article');
        articleEl.className = 'parallax';
        articleEl.dataset.id = article.id;
    
        // Determine the text alignment class based on the article's index
        const textAlignmentClass = index % 2 === 0 ? 'parallax-text-right' : 'parallax-text-left';
    
        // Alternate the order of text and image sections
        const contentHTML =
            index % 2 === 0
                ? `
                    <div class="image" data-rotate="right">
                        <img src="${article.img}" alt="Ejemplo ${article.id}">
                        <button class="hidden-button cambiar-imagen">Cambiar Imagen</button>
                        <input type="file" class="hidden-button upload-image" accept="image/*" style="display: none;">
                        <button class="hidden-button guardar-imagen">Guardar Imagen</button>
                    </div>
                    <div class="text ${textAlignmentClass}">
                        <h2>${article.title}</h2>
                        <p class="glass nunito-p">${article.text}</p>
                    </div>
                `
                : `
                    <div class="text ${textAlignmentClass}">
                        <h2>${article.title}</h2>
                        <p class="glass nunito-p">${article.text}</p>
                    </div>
                    <div class="image" data-rotate="left">
                        <img src="${article.img}" alt="Ejemplo ${article.id}">
                        <button class="hidden-button cambiar-imagen">Cambiar Imagen</button>
                        <input type="file" class="hidden-button upload-image" accept="image/*" style="display: none;">
                        <button class="hidden-button guardar-imagen">Guardar Imagen</button>
                    </div>
                `;
    
        articleEl.innerHTML = `
            ${contentHTML}
            <div class="top-right-buttons">
                <button class="hidden-button editar">Editar</button>
                <button class="hidden-button eliminar">Eliminar</button>
            </div>
        `;
    
        const editButton = articleEl.querySelector('.editar');
        const deleteButton = articleEl.querySelector('.eliminar');
        const changeImageButton = articleEl.querySelector('.cambiar-imagen');
        const uploadInput = articleEl.querySelector('.upload-image');
        const saveImageButton = articleEl.querySelector('.guardar-imagen');
        const imageElement = articleEl.querySelector('img');
    
        // Add Edit Functionality
        editButton.addEventListener('click', () => enableEditing(articleEl, article.id));
    
        // Add Delete Functionality
        deleteButton.addEventListener('click', () => confirmDeletion(article.id));
    
        // Add Image Change Functionality
        changeImageButton.addEventListener('click', () => uploadInput.click());
        uploadInput.addEventListener('change', (event) => previewImage(event, imageElement, saveImageButton));
        saveImageButton.addEventListener('click', () => saveImage(article.id, imageElement.src));
    
        return articleEl;
    }
    
    



    // Enable Editing
    function enableEditing(articleEl, articleId) {
        const titleEl = articleEl.querySelector('h2');
        const textEl = articleEl.querySelector('p');

        titleEl.contentEditable = true;
        textEl.contentEditable = true;
        titleEl.style.border = '1px dashed #007bff';
        textEl.style.border = '1px dashed #007bff';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Guardar Cambios';
        saveButton.className = 'guardar-cambios';
        saveButton.style.marginTop = '10px';
        articleEl.querySelector('.text').appendChild(saveButton);

        saveButton.addEventListener('click', () => {
            titleEl.contentEditable = false;
            textEl.contentEditable = false;
            titleEl.style.border = 'none';
            textEl.style.border = 'none';
            saveButton.remove();

            // Save changes to JSON data
            const updatedArticle = articlesData.find(a => a.id === articleId);
            updatedArticle.title = titleEl.textContent;
            updatedArticle.text = textEl.textContent;
            saveArticles();
        });
    }

    // Confirm and Delete Article
    function confirmDeletion(articleId) {
        const confirmation = confirm('¿Estás seguro de que deseas eliminar este artículo?');
        if (confirmation) {
            articlesData = articlesData.filter(a => a.id !== articleId);
            saveArticles();
        }
    }

    // Preview Image
    function previewImage(event, imageElement, saveButton) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageElement.src = e.target.result;
                saveButton.classList.remove('hidden-button');
            };
            reader.readAsDataURL(file);
        }
    }

    // Save Image
    function saveImage(articleId, imageUrl) {
        const confirmation = confirm('¿Guardar cambios para reemplazar la imagen?');
        if (confirmation) {
            const updatedArticle = articlesData.find(a => a.id === articleId);
            updatedArticle.img = imageUrl;
            saveArticles();
        }
    }

    // Save Articles to JSON (Placeholder for Server-Side Save)
    function saveArticles() {
        console.log('Saving articles:', JSON.stringify(articlesData, null, 2));
        alert('Cambios guardados.');
        renderArticles(); // Re-render with updates
    }


    // Fetch and Render Articles
    fetchArticles();
});
