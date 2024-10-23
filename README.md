# Pleasure BD E-commerce

This is an e-commerce website for Pleasure BD using Next.js with App Router, MongoDB, Tailwind CSS, and ShadCN UI.

## Features

- Product management (CRUD operations)
- Shopping cart functionality
- User authentication and authorization
- Order management for both users and admins
- Product reviews and ratings
- Pagination for product listings
- Search functionality
- Admin dashboard with basic statistics
- Detailed order tracking

## Prerequisites

- Node.js (v14 or later)
- MongoDB

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/pleasure-bd-ecommerce.git
   cd pleasure-bd-ecommerce
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env.local.example` file to `.env.local`
   - Fill in the required environment variables in `.env.local`

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

To deploy this project, follow these steps:

1. Build the project:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

```
tree -L 5 -I 'node_modules|.next|.git'
```
