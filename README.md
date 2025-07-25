
# LinkHub

<img alt="Built with Vue.js and Vite" src="https://img.shields.io/badge/Built with-Vue.js | Vite-4FC08D.svg?style=flat-square&amp;logo=vue.js&amp;logoColor=white">

LinkHub is a web application built with Vue.js and Vite. It provides a platform for managing user authentication, admin dashboards, and public profiles.

## Features

-   **Authentication System**:
    -   Guest-only routes for login and registration.
    -   Protected routes for authenticated users.
-   **Admin Dashboard**:
    -   Accessible only to logged-in users.
-   **Public Profiles**:
    -   Viewable by anyone via a username-based route.
-   **Session Management**:
    -   Backend API integration to check user session status.

## Installation

1.  Clone the repository:
    
    git  clone  https://github.com/harryme17/linkhub.git
    
    cd  linkhub
    
2.  Install dependencies:
    
    npm  install
    
3.  Start the development server:
    
    npm  run  dev
    
4.  Build for production:
    
    npm  run  build
    
5.  Preview the production build:
    
    npm  run  preview
    

## Navigation Guards

The application uses Vue Router's  `beforeEach`  navigation guard to handle route access:

1.  **Requires Authentication**: Redirects unauthenticated users to the login page.
2.  **Guest-Only Routes**: Redirects logged-in users to the admin dashboard.
3.  **Default Behavior**: Allows access to all other routes.

## Backend API

The application integrates with a backend API (`/session.php`) to check the user's session status. 

## Technologies Used

-   **Frontend**: Vue.js, Vue Router, Vite
-   **Backend**: PHP (for session management)

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Contact

For any inquiries, feel free to reach out via the  GitHub repository.
