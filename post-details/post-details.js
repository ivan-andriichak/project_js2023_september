// Common class names for styling
const commonKeyClass = 'data-label';
const commonValueClass = 'data-value';

// Get DOM elements
const postUserWrapper = document.getElementById('post-user-wrapper');
const postDetailsContainer = document.getElementById('postDetails');
const commentsContainer = document.createElement('div'); // Create a container for comments
commentsContainer.classList.add('comments-container');

// Get the post ID from the URL parameter
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

// Function to display post details
function displayPostDetails() {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            postDetailsContainer.innerHTML = ''; // Clear the container before displaying new data
            displayKeyValuePairs(post, postUserWrapper); // Call a function to display post information

            // After displaying post information, call a function to display comments
            displayPostComments();
        })
        .catch(error => console.error('Error fetching post information:', error));
}

// Function to display comments for the post
function displayPostComments() {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
        .then(response => response.json())
        .then(comments => {
            // Clear the comments container before displaying new comments
            commentsContainer.innerHTML = '';

            comments.forEach(comment => {
                const commentBlock = document.createElement('div');
                commentBlock.classList.add('post-comment');

                // Create and append a label and data element for each comment field
                for (const key in comment) {
                    const label = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize the first letter
                    const labelElement = document.createElement('div');
                    labelElement.textContent = `${label}: `;
                    labelElement.classList.add(commonKeyClass); // Use a common class for labels
                    commentBlock.appendChild(labelElement);

                    const dataElement = document.createElement('div');
                    dataElement.textContent = comment[key];
                    dataElement.classList.add(commonValueClass); // Use a common class for values
                    commentBlock.appendChild(dataElement);
                }

                commentsContainer.appendChild(commentBlock);
            });

            // Append the comments container to the DOM
            postDetailsContainer.appendChild(commentsContainer);
        })
        .catch(error => console.error('Error fetching comments for the post:', error));
}

// Function to display post information as key-value pairs
function displayKeyValuePairs(data, parentElement) {
    const dataContainer = document.createElement('div');
    dataContainer.classList.add('user-data-wrapper');

    for (const key in data) {
        const dataItem = document.createElement('div');
        dataItem.classList.add('user-data-item');

        const labelElement = document.createElement('span');
        labelElement.textContent = `${key}: `;
        labelElement.classList.add(commonKeyClass); // Use a common class for labels
        dataItem.appendChild(labelElement);

        const valueElement = document.createElement('span');
        valueElement.textContent = data[key];
        valueElement.classList.add(commonValueClass); // Use a common class for values
        dataItem.appendChild(valueElement);

        dataContainer.appendChild(dataItem);
    }

    parentElement.appendChild(dataContainer); // Add all user-data-item elements to the container
}

// Call the function to display post details when the page loads
displayPostDetails();