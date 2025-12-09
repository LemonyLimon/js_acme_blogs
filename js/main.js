//Course: INF-651 Final Project - Acme Blogs
//Programmer: Melanie Caines
//Program Due Date: December 8th, 2025
//Program Description: Main JavaScript file for completion of Acme Blogs website

//Function 1: Create an element with text and optional class name
function createElemWithText(elementName = "p", text = "", className) {
  const createdElement = document.createElement(elementName);
  createdElement.textContent = text;
  if (className) {
    createdElement.className = className;
  }
  return createdElement;
}

//Function 2: Create select options from user objects array
function createSelectOptions(users) {
  if (!users) {
    return undefined;
  }
  const options = [];
  for (const user of users) {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    options.push(option);
  }
  return options;
}

//Function 3: Toggle comment section visibility for a given postId and return the section element
function toggleCommentSection(postId) {
  if (!postId) {
    return undefined;
  }
  const section = document.querySelector(`section[data-post-id="${postId}"]`);
  if (section) {
    section.classList.toggle("hide");
  }
  return section;
}

//Function 4: Toggle button text for a given postId and return the button element
function toggleCommentButton(postId) {
  if (!postId) {
    return undefined;
  }
  const button = document.querySelector(`button[data-post-id="${postId}"]`);
  if (button) {
    button.textContent === "Show Comments"
      ? (button.textContent = "Hide Comments")
      : (button.textContent = "Show Comments");
  }
  return button;
}

//Function 5: Delete all child elements of a given parent element and return the parent element
function deleteChildElements(parentElement) {
  if (!parentElement || !parentElement.nodeType) {
    return undefined;
  }
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}

//Function 6: Add event listeners to all comment toggle buttons
function addButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  if (buttons) {
    for (const button of buttons) {
      const postId = button.dataset.postId;
      if (postId) {
        button.addEventListener("click", function (event) {
          toggleComments(event, button.dataset.postId);
        });
      }
    }
  }
  return buttons;
}

//Function 7: Removing event listeners from all comment toggle buttons
function removeButtonListeners() {
  const buttons = document.querySelectorAll("main button");
  if (buttons) {
    for (const button of buttons) {
      const postId = button.dataset.postId;
      if (postId) {
        button.removeEventListener("click", function (event) {
          toggleComments(event, postId);
        });
      }
    }
  }
  return buttons;
}

//Function 8: Creating comment elements from comments array
function createComments(comments) {
  if (!comments) {
    return undefined;
  }
  const fragment = document.createDocumentFragment();
  for (const comment of comments) {
    const article = document.createElement("article");
    const h3 = createElemWithText("h3", comment.name);
    const pBody = createElemWithText("p", comment.body);
    const pEmail = createElemWithText("p", `From: ${comment.email}`);

    article.append(h3, pBody, pEmail);
    fragment.append(article);
  }
  return fragment;
}

//Function 9: Populate select menu with user options
function populateSelectMenu(users) {
  if (!users) {
    return undefined;
  }
  const selectMenu = document.querySelector("#selectMenu");
  const options = createSelectOptions(users);

  if (options) {
    for (const option of options) {
      selectMenu.append(option);
    }
  }
  return selectMenu;
}

//Function 10: Fetching users from API
async function getUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) throw new Error("Status code not 200");
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

//Function 11: Fetching posts for a specific user from API
async function getUserPosts(userId) {
  if (!userId) {
    return undefined;
  }
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}/posts`
    );
    if (!response.ok) throw new Error("Status code not 200");
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

//Function 12: Fetching a specific user from API
async function getUser(userId) {
  if (!userId) {
    return undefined;
  }
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    if (!response.ok) throw new Error("Status code not 200");
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

//Function 13: Fetching comments for a specific post from API
async function getPostComments(postId) {
  if (!postId) {
    return undefined; // Fixed typo here
  }
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );
    if (!response.ok) throw new Error("Status code not 200");
    return await response.json();
  } catch (err) {
    console.error(err);
  }
}

//Function 14: Display comments for a user post
async function displayComments(postId) {
  if (!postId) {
    return undefined;
  }
  const section = document.createElement("section");
  section.dataset.postId = postId;
  section.classList.add("comments", "hide");

  const comments = await getPostComments(postId);
  const fragment = createComments(comments);

  section.append(fragment);
  return section;
}

//Function 15: Creating post elements from posts array
async function createPosts(posts) {
  if (!posts) {
    return undefined;
  }

  const fragment = document.createDocumentFragment();

  for (const post of posts) {
    const article = document.createElement("article");

    const h2 = createElemWithText("h2", post.title);
    const pBody = createElemWithText("p", post.body);
    const pId = createElemWithText("p", `Post ID: ${post.id}`);

    const author = await getUser(post.userId);

    const pAuthor = createElemWithText(
      "p",
      `Author: ${author.name} with ${author.company.name}`
    );
    const pCatchPhrase = createElemWithText("p", author.company.catchPhrase);

    const button = createElemWithText("button", "Show Comments");
    button.dataset.postId = post.id;

    article.append(h2, pBody, pId, pAuthor, pCatchPhrase, button);

    const section = await displayComments(post.id);
    article.append(section);

    fragment.append(article);
  }

  return fragment;
}

//Function 16: Displaying posts in main element of the page
async function displayPosts(posts) {
  const main = document.querySelector("main");
  const element = posts
    ? await createPosts(posts)
    : createElemWithText(
        "p",
        "Select an Employee to display their posts.",
        "default-text"
      );

  main.append(element);
  return element;
}

//Function 17: Toggling comments visibility for a post
function toggleComments(event, postId) {
  if (!event || !postId) {
    return undefined;
  }

  event.target.listener = true;

  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);

  return [section, button];
}

//Function 18: Refreshing posts displayed in the main element
async function refreshPosts(posts) {
  if (!posts) {
    return undefined;
  }

  const removeButtons = removeButtonListeners();

  const main = deleteChildElements(document.querySelector("main"));

  const fragment = await displayPosts(posts);

  const addButtons = addButtonListeners();

  return [removeButtons, main, fragment, addButtons];
}

//Function 19: Handling change event for select menu and updating posts
async function selectMenuChangeEventHandler(event) {
  if (!event) {
    return undefined;
  }
  const selectMenu = document.querySelector("#selectMenu");
  selectMenu.disabled = true;
  let userId = event?.target?.value || 1;
  if (userId === "Employees") {
    userId = 1;
  }
  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);

  selectMenu.disabled = false;
  return [userId, posts, refreshPostsArray];
}

//Function 20: Initializing the page by fetching users and populating the select menu
async function initPage() {
  const users = await getUsers();
  const select = populateSelectMenu(users);

  return [users, select];
}

//Function 21: Initializing the application and setting up event listeners
function initApp() {
  initPage();

  const selectMenu = document.querySelector("#selectMenu");
  selectMenu.addEventListener("change", selectMenuChangeEventHandler);
}

document.addEventListener("DOMContentLoaded", initApp);
