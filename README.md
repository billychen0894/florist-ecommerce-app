<a name="readme-top"></a>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
                <li><a href="#test-accounts">Test Accounts</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#features">Features</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<img width="1054" alt="Screenshot 2023-11-13 at 7 59 53 PM" src="https://github.com/billychen0894/florist-ecommerce-app/assets/96030408/e93f4aaa-cbf5-432d-857e-27267ada6944">

An eCommerce app to get started for small businesses. This application prioritizes simplicity, offering an intuitive user experience through easy navigation, a visually compelling product display, and a streamlined checkout process.
<a href="https://florist-ecommerce-app.vercel.app/">View Demo</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With
[![Next][Next.js]][Next-url]
[![React][React.js]][React-url]
[![TailwindCSS][TailwindCSS]][TailwindCSS-url]
[![TypeScript][TypeScript]][TypeScript-url]
[![Prisma][Prisma]][Prisma-url]
[![ReduxToolkit][ReduxToolkit]][ReduxToolkit-url]
[![Stripe][Stripe]][Stripe-url]
[![Next-Auth.js][Next-Auth.js]][Next-Auth-url]
[![Cloudinary][Cloudinary]][Cloudinary-url]
[![Docker][Docker]][Docker-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Test Accounts

Feel free to use the following test accounts to explore the features of the [Demo](https://florist-ecommerce-app.vercel.app/):

### Customer Accounts:

1. **Username email:** test1@test.com
   - **Password:** TestTest1

2. **Username email:** test2@test.com
   - **Password:** TestTest2

### Admin Account (please do not delete this account in the demo):

- **Username email:** admin1@admin.com
  - **Password:** AdminAdmin1

Please note that these are test accounts created specifically for the demo. For security reasons, avoid using personal passwords or sensitive information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started
### Prerequisites
- **Node.js 18 or higher:** [Download Node.js](https://nodejs.org/)
- **Docker:** [Download Docker](https://www.docker.com/)

### Installation
* Clone the repo
```sh
git clone https://github.com/billychen0894/florist-ecommerce-app.git
```
* Install NPM packages, dependencies
```sh
npm install
```
* Set environment variables based on [.env.example](https://github.com/billychen0894/florist-ecommerce-app/blob/main/.env.example)
* Start the project with
```
npm run dev
```
* Seed database with Prisma
```
npx prisma seed
```
* Run database with docker
```
docker-compose up
```
* View database
```
npx prisma studio
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEATURES -->
## Features

- **Responsive Web Design:**
  Ensure an optimal user experience across various devices, including desktops, tablets, and smartphones, through responsive web design.

- **Product Catalog:**
  Create a comprehensive catalog with:
  - Sorting and filtering options
  - Pagination for easy navigation

- **Product Search:**
  Implement a robust product search functionality, allowing users to quickly find products based on keywords.

- **Product Details:**
  Provide detailed product pages with:
  - Images
  - Descriptions
  - Product specifications
  - Delivery information

- **Checkout Process:**
  Facilitate a streamlined and user-friendly checkout process

- **Recommended Products:**
  Implement a simple recommendation engine that suggests related or complementary products based on product populority.

- **User SignIn and SignUp:**
  Enable secure account creation, sign-in, and account management, including a seamless SignUp process with email verification.

- **Authentication and Authorization:**
  Implement robust authentication mechanisms and set up authorization levels for roles.

- **User Account Management:**
  Allow users to efficiently manage their:
  - Orders
  - Profiles
  - Wishlists

- **Password Reset:**
  Provide a secure and straightforward process for users to reset their passwords.

- **Admin Dashboard:**
  Develop a comprehensive admin dashboard with CRUD operations for:
  - Categories
  - Products
  - Orders
  - Customer information

- **Business Dashboard:**
  Create a simplified dashboard tailored for business insights.


<p align="right">(<a href="#readme-top">back to top</a>)</p>









<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TailwindCSS]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[TypeScript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[ReduxToolkit]: https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white
[ReduxToolkit-url]: [https://laravel.com](https://redux-toolkit.js.org/)
[Stripe]: https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white
[Stripe-url]: https://stripe.com/en-ca
[Next-Auth.js]: https://img.shields.io/badge/NextAuth-7B00FF?style=for-the-badge&logoColor=white
[Next-Auth-url]: https://next-auth.js.org/
[Cloudinary]: https://img.shields.io/badge/Cloudinary-2962FF?style=for-the-badge
[Cloudinary-url]: https://cloudinary.com/
[Docker]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
