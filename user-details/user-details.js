// Common class names for styling
const commonKeyClass = 'data-label';
const commonValueClass = 'data-value';

// Get user ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

// Get DOM elements
const userDetailsContainer = document.getElementById('userDetails');
const userPostsContainer = document.getElementById('userPosts');
const showPostsButton = document.getElementById('showPostsButton');

// Function to display user details
function displayUserDetails() {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            userDetailsContainer.innerHTML = ''; // Clear the container before displaying new data
            displayUserData(user, userDetailsContainer); // Call a function to display all user information
        })
        .catch(error => console.error('Error fetching user information:', error));
}

// Function to display user posts
function displayUserPosts() {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`)
        .then(response => response.json())
        .then(posts => {
            userPostsContainer.innerHTML = ''; // Clear the container before displaying new data
            posts.forEach(post => {
                const postBlock = document.createElement('div');
                postBlock.classList.add('user-post-block');

                const postTitle = document.createElement('h3');
                postTitle.textContent = post.title;

                const viewPostButton = document.createElement('button');
                viewPostButton.textContent = 'View Post';
                viewPostButton.classList.add('details-button'); // Add a class for button styling

                // Add an event listener for the "View Post" button
                viewPostButton.addEventListener('click', () => {
                    // Redirect to the post details page
                    window.location.href = `../post-details/post-details.html?id=${post.id}`;
                });

                postBlock.appendChild(postTitle);
                postBlock.appendChild(viewPostButton);

                userPostsContainer.appendChild(postBlock);
            });
        })
        .catch(error => console.error('Error fetching user posts:', error));
}

// Function to display user data
function displayUserData(user, parentElement) {
    for (const key in user) {
        const listItem = document.createElement('div');
        listItem.classList.add('user-data-item');

        const itemText = document.createElement('span');
        itemText.textContent = `${key}: `;
        itemText.classList.add(commonKeyClass); // Use a common class for labels

        if (typeof user[key] === 'object' && user[key] !== null) {
            const nestedList = document.createElement('div');
            nestedList.classList.add('user-nested-list');
            displayNestedData(user[key], nestedList); // Call a function to handle nested objects
            listItem.append(itemText, nestedList);
        } else {
            const valueItem = document.createElement('span');
            valueItem.textContent = user[key];
            valueItem.classList.add(commonValueClass); // Use a common class for values
            listItem.append(itemText, valueItem);
        }

        parentElement.appendChild(listItem);
    }
}

// Function to display nested data
function displayNestedData(data, parentElement) {
    for (const key in data) {
        const listItem = document.createElement('div');
        listItem.classList.add('user-nested-item');

        const itemText = document.createElement('span');
        itemText.textContent = `${key}: `;
        itemText.classList.add(commonKeyClass); // Use a common class for labels

        if (typeof data[key] === 'object' && data[key] !== null) {
            const nestedList = document.createElement('div');
            nestedList.classList.add('user-nested-list');
            displayNestedData(data[key], nestedList); // Recursively call for nested objects
            listItem.append(itemText, nestedList);
        } else {
            const valueItem = document.createElement('span');
            valueItem.textContent = data[key];
            valueItem.classList.add(commonValueClass); // Use a common class for values
            listItem.append(itemText, valueItem);
        }

        parentElement.appendChild(listItem);
    }
}

let isUserPostsVisible = false; // Initially, the block is not visible

// Add an event listener for the "Post of current user" button
showPostsButton.addEventListener('click', () => {
    const userPosts = document.querySelector('#userPosts'); // Change the selector

    // Check if the block is currently visible
    if (!isUserPostsVisible) {
        userPosts.style.display = 'flex'; // Show the block
    } else {
        userPosts.style.display = 'none'; // Hide the block
    }

    // Toggle the visibility state
    isUserPostsVisible = !isUserPostsVisible;

    // Call the function to display user posts only if the block is visible
    if (isUserPostsVisible) {
        displayUserPosts();
    }
});

// Display user information when the page loads
displayUserDetails();