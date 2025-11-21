### Prompt:

Build a mobile application for both Android and iOS using **React Native**. The application will serve as a **Library Information System**, allowing users to manage books, authors, and genres based on the functionality defined in the attached `swagger.json`.

**Core Objective:**
The app must act as a mobile client for the API defined in the attached `swagger.json` file. It should provide a clean, modern, mobile-first experience for library management tasks.

**Key Features & Screens:**

1.  **Login Screen:**
    *   This screen should be the entry point of the application.
    *   It must contain input fields for 'Username' and 'Password', and a 'Login' button.
    *   On submission, it should call the `GET /users/login` endpoint using Basic Authentication.
    *   Upon a successful login, the app must securely store the received bearer token and use it in the authorization header for all subsequent authenticated API calls.

2.  **Home / Dashboard Screen:**
    *   After a user logs in, they should be directed to a Home or Dashboard screen.
    *   This screen must present a high-level summary of the library's contents.
    *   Use the `/authors/count`, `/books/count`, and `/genres/count` endpoints to fetch and display the total number of authors, books, and genres.
    *   The screen should also display the current user's permission level (e.g., "Your permissions: Editor"), which can be determined from the data returned by the login endpoint.

3.  **Main Navigation:**
    *   Implement a primary navigation system, such as a bottom tab bar or a side drawer menu.
    *   This navigation should provide access to the main sections of the app: 'Books', 'Authors', and 'Admin'. The 'Admin' option must only be visible to admin users.

4.  **Book Management:**
    *   **Book List View:** Create a screen that displays a list of all books, populated by the `GET /books` endpoint. Each item in the list should show key details like the book's name, author, and genre.
    *   **Search:** Include a search bar on the list screen that allows users to find books by name using the `GET /books/find` endpoint.
    *   **Create/Edit Forms:** Design a form for creating (`POST /books`) and editing (`PUT /books`) books. The form should include input fields for 'Name', a checkbox for 'Out of Print', and a date picker for 'Date Added'.
    *   **Dynamic Pickers:** For the 'Author' and 'Genre' fields on the create/edit form, implement them as dropdowns or selectable pickers. The options for these pickers must be dynamically populated by fetching all data from the `GET /authors` and `GET /genres` endpoints, respectively.
    *   **Delete:** Users with the correct permissions must be able to delete a book (`DELETE /books/{id}`). This action could be a button on the list item or on a book's detail page.

5.  **Author Management:**
    *   Create an 'Authors' section with full CRUD (Create, Read, Update, Delete) functionality. This section should mirror the structure of Book Management, allowing users to list, search, create, edit, and delete authors using the corresponding API endpoints under the `/authors` path.

6.  **Admin Section:**
    *   This section must only be visible and accessible to users with the 'admin' role.
    *   **User Management:** The primary function of this screen is user administration. It must allow an administrator to view a list of all users in the system (`GET /users`) and to create new users via a form that calls the `POST /users` endpoint.

**Role-Based Access Control (RBAC):**
The application must strictly enforce different permissions based on the user's role. Please use the following test accounts to implement and test this logic:

*   **`borrower` / `borrower` (Reader Role):**
    *   Can only **view** lists of books, authors, and genres.
    *   All UI controls for creating, editing, and deleting items must be hidden or disabled.
*   **`librarian` / `librarian` (Editor Role):**
    *   Has all the permissions of a reader.
    *   Can **create, update, and delete** books and authors.
*   **`admin` / `admin` (Admin Role):**
    *   Has all the permissions of an editor.
    *   Can also access the 'Admin' section to **manage users**.

**Technical Specifications:**
*   **Framework:** React Native
*   **Platforms:** Android & iOS
*   **API:** All network requests must strictly adhere to the provided `swagger.json` specification.
*   **State Management:** Use a modern state management library like Redux Toolkit or React Context API for managing application state, including the user's authentication token and role.
*   **UI/UX:** The design should be clean, intuitive, and responsive, ensuring an excellent user experience on mobile devices.