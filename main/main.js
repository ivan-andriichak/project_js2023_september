// Common class names for styling
const commonValueClass = 'data-value';
const userList = document.getElementById('userList');
const apiUrl = 'https://jsonplaceholder.typicode.com/users';

// Function to create user block
function createUserBlock(user) {
    const userBlock = document.createElement('div');
    userBlock.classList.add('user-block');
    userBlock.appendChild(createUserElement(`№ ${user.id}`));
    userBlock.appendChild(createUserElement(`Name - ${user.name}`));
    userBlock.appendChild(createDetailsButton(user));
    return userBlock;
}

// Function to create "Details" button
function createDetailsButton(user) {
    const detailsButton = document.createElement('button');
    detailsButton.textContent = 'Details';
    detailsButton.classList.add('details-button');
    detailsButton.addEventListener('click', () => redirectToDetailsPage(user.id));
    return detailsButton;
}

// Function to create element with user ID or name
function createUserElement(value) {
    const element = document.createElement('p');
    element.textContent = value;
    element.classList.add(commonValueClass);
    return element;
}

// Function to redirect to user details page
function redirectToDetailsPage(userId) {
    window.location.href = `../user-details/user-details.html?id=${userId}`;
}

// Function to fetch and display the list of users
async function getUsers() {
    try {
        const response = await fetch(apiUrl);
        const users = await response.json();

        users.forEach(user => {
            const userBlock = createUserBlock(user);
            userList.appendChild(userBlock);
        });

    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Call the function to fetch and display the list of users
(async () => {
    await getUsers();
    console.log('Data fetched successfully');
})();
