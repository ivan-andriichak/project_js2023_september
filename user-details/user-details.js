const COMMON_KEY_CLASS = 'data-label';
const COMMON_VALUE_CLASS = 'data-value';

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

const userDetailsContainer = document.getElementById('userDetails');
const userPostsContainer = document.getElementById('userPosts');
const showPostsButton = document.getElementById('showPostsButton');

const fetchUserDetails = async () => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user information:', error);
        throw error;
    }
};

const fetchUserPosts = async () => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

const displayUserDetails = (user) => {
    userDetailsContainer.innerHTML = '';
    displayUserData(user, userDetailsContainer);
};

const displayUserPosts = async (posts) => {
    userPostsContainer.innerHTML = '';

    for (const post of posts) {
        await displayPostWithDelay(post);
    }
};

const displayPostWithDelay = async (post) => {
    return new Promise(resolve => {
        setTimeout(() => {
            const postBlock = createPostBlock(post);
            userPostsContainer.appendChild(postBlock);
            resolve();
        }, 100);
    });
};

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

const displayUserData = (user, parentElement) => {
    for (const key in user) {
        const listItem = document.createElement('div');
        listItem.classList.add('user-data-item');

        const itemText = document.createElement('span');
        itemText.textContent = `${key}: `;
        itemText.classList.add(COMMON_KEY_CLASS);

        if (typeof user[key] === 'object' && user[key] !== null) {
            const nestedList = document.createElement('div');
            nestedList.classList.add('user-nested-list');
            displayNestedData(user[key], nestedList);
            listItem.append(itemText, nestedList);
        } else {
            const valueItem = document.createElement('span');
            valueItem.textContent = user[key];
            valueItem.classList.add(COMMON_VALUE_CLASS);
            listItem.append(itemText, valueItem);
        }

        parentElement.appendChild(listItem);
    }
};

const displayNestedData = (data, parentElement) => {
    for (const key in data) {
        const listItem = document.createElement('div');
        listItem.classList.add('user-nested-item');

        const itemText = document.createElement('span');
        itemText.textContent = `${key}: `;
        itemText.classList.add(COMMON_KEY_CLASS);

        if (typeof data[key] === 'object' && data[key] !== null) {
            const nestedList = document.createElement('div');
            nestedList.classList.add('user-nested-list');
            displayNestedData(data[key], nestedList);
            listItem.append(itemText, nestedList);
        } else {
            const valueItem = document.createElement('span');
            valueItem.textContent = data[key];
            valueItem.classList.add(COMMON_VALUE_CLASS);
            listItem.append(itemText, valueItem);
        }

        parentElement.appendChild(listItem);
    }
};

let isUserPostsVisible = false;
let hasDisplayedPosts = false;

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

showPostsButton.addEventListener('click', toggleUserPostsVisibility);

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
