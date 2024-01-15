// Constants for CSS classes
const commonKeyClass = 'data-label',
      commonValueClass = 'data-value';
// Fetching user ID from URL parameters
const urlParams = new URLSearchParams(window.location.search),
      userId = urlParams.get('id');

// DOM elements
const userDetailsContainer = document.getElementById('userDetails'),
      userPostsContainer = document.getElementById('userPosts'),
      showPostsButton = document.getElementById('showPostsButton');

// Function to fetch user details from the API
const fetchUserDetails = async () => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user information:', error);
        throw error;
    }
};

// Function to fetch user posts from the API
const fetchUserPosts = async () => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

// Function to display user details in the DOM
const displayUserDetails = (user) => {
    userDetailsContainer.innerHTML = '';
    displayUserData(user, userDetailsContainer);
};

// Function to display user posts in the DOM with a delay
const displayUserPosts = async (posts) => {
    userPostsContainer.innerHTML = '';

    for (const post of posts) {
        await displayPostWithDelay(post);
    }
};

// Function to display a post with a delay
const displayPostWithDelay = async (post) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const postBlock = createPostBlock(post);
            userPostsContainer.appendChild(postBlock);
            resolve();
        }, 100);
    });
};

// Function to create a post block element
const createPostBlock = (post) => {
    const postBlock = document.createElement('div');
    postBlock.classList.add('user-post-block');

    const postTitle = document.createElement('h3');
    postTitle.textContent = post.title;

    const viewPostButton = document.createElement('button');
    viewPostButton.textContent = 'View Post';
    viewPostButton.classList.add('details-button');

    viewPostButton.addEventListener('click', () => {
        window.location.href = `../post-details/post-details.html?id=${post.id}`;
    });

    postBlock.append(postTitle, viewPostButton);
    return postBlock;
};

// Function to display user data in the DOM
const displayUserData = (user, parentElement) => {
    for (const key in user) {
        const listItem = document.createElement('div');
        listItem.classList.add('user-data-item');

        const itemText = document.createElement('span');
        itemText.textContent = `${key}: `;
        itemText.classList.add(commonKeyClass);

        if (typeof user[key] === 'object' && user[key] !== null) {
            const nestedList = document.createElement('div');
            nestedList.classList.add('user-nested-list');
            displayNestedData(user[key], nestedList);
            listItem.append(itemText, nestedList);
        } else {
            const valueItem = document.createElement('span');
            valueItem.textContent = user[key];
            valueItem.classList.add(commonValueClass);
            listItem.append(itemText, valueItem);
        }

        parentElement.appendChild(listItem);
    }
};

// Function to display nested data in the DOM
const displayNestedData = (data, parentElement) => {
    for (const key in data) {
        const listItem = document.createElement('div');
        listItem.classList.add('user-nested-item');

        const itemText = document.createElement('span');
        itemText.textContent = `${key}: `;
        itemText.classList.add(commonKeyClass);

        if (typeof data[key] === 'object' && data[key] !== null) {
            const nestedList = document.createElement('div');
            nestedList.classList.add('user-nested-list');
            displayNestedData(data[key], nestedList);
            listItem.append(itemText, nestedList);
        } else {
            const valueItem = document.createElement('span');
            valueItem.textContent = data[key];
            valueItem.classList.add(commonValueClass);
            listItem.append(itemText, valueItem);
        }

        parentElement.appendChild(listItem);
    }
};

// State variables for post visibility
let isUserPostsVisible = false;
let hasDisplayedPosts = false;

// Function to toggle the visibility of user posts
const toggleUserPostsVisibility = async () => {
    const userPosts = document.querySelector('#userPosts');
    userPosts.style.display = isUserPostsVisible ? 'none' : 'flex';
    isUserPostsVisible = !isUserPostsVisible;

    if (isUserPostsVisible && !hasDisplayedPosts) {
        try {
            const [user, posts] = await Promise.all([fetchUserDetails(), fetchUserPosts()]);
            displayUserDetails(user);
            await displayUserPosts(posts);
            hasDisplayedPosts = true;

        } catch (error) {
            console.error('Error displaying user details or posts:', error);
        }
    }
};

// Event listener for the show posts button
showPostsButton.addEventListener('click', toggleUserPostsVisibility);

// Immediately invoked function to initialize the user details and posts
(async () => {
    try {
        const user = await fetchUserDetails();
        displayUserDetails(user);

        if (isUserPostsVisible && !hasDisplayedPosts) {
            const posts = await fetchUserPosts();
            await displayUserPosts(posts);
            hasDisplayedPosts = true;
        }
    } catch (error) {
        console.error('Error displaying user details:', error);
    }
})();
