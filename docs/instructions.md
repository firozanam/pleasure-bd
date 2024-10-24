# Product Requirements Document: Pleasure BD E-commerce Site

## 1. Project Overview
Develop a basic e-commerce website for Pleasure BD using Next.js with App Router, MongoDB, Tailwind CSS, and ShadCN UI. The site will focus on essential features without implementing a payment gateway.

## 2. Key Features

### 2.1 Product Upload
- Admin interface for adding, editing, and deleting products
- Fields: name, description, price, images, category, stock quantity

### 2.2 Cart
- Add products to cart
- View cart contents
- Update product quantities
- Remove products from cart

### 2.3 Checkout
- Review cart items
- Enter shipping information
- Choose delivery method (Cash on Delivery only)

### 2.4 User Authentication
- Optional user registration and login
- Guest checkout option

### 2.5 Order Management
- View order history (for registered users)
- Admin interface for managing orders

### 2.6 Cash on Delivery
- Implement Cash on Delivery as the sole payment method

### 2.7 SMTP Setup
- Configure SMTP for sending order confirmation and status update emails

### 2.8 Basic Search and Filter
- Search products by name or description
- Filter products by category

## 3. Technical Stack
- Framework: Next.js with App Router
- Database: MongoDB
- Styling: Tailwind CSS
- UI Components: ShadCN UI
- Language: JavaScript (without TypeScript)

## 4. File Folder Structure

```
pleasure-bd/
├── README.md
├── app
│   ├── account
│   │   └── page.js
│   ├── admin
│   │   ├── home-settings
│   │   │   └── page.js
│   │   ├── layout.js
│   │   ├── orders
│   │   │   └── page.js
│   │   ├── page.js
│   │   ├── products
│   │   │   ├── add
│   │   │   │   └── page.js
│   │   │   ├── edit
│   │   │   │   └── [id]
│   │   │   └── page.js
│   │   └── users
│   │       └── page.js
│   ├── admin-register
│   │   └── page.js
│   ├── api
│   │   ├── admin
│   │   │   ├── orders
│   │   │   │   ├── [id]
│   │   │   │   └── route.js
│   │   │   ├── stats
│   │   │   │   └── route.js
│   │   │   └── users
│   │   │       ├── [id]
│   │   │       └── route.js
│   │   ├── auth
│   │   │   ├── [...nextauth]
│   │   │   │   └── route.js
│   │   │   ├── login
│   │   │   │   └── route.js
│   │   │   ├── register
│   │   │   │   └── route.js
│   │   │   └── register-admin
│   │   │       └── route.js
│   │   ├── categories
│   │   │   └── route.js
│   │   ├── debug
│   │   │   └── orders
│   │   │       └── route.js
│   │   ├── orders
│   │   │   ├── [id]
│   │   │   │   └── route.js
│   │   │   └── route.js
│   │   ├── products
│   │   │   ├── [id]
│   │   │   │   ├── reviews
│   │   │   │   └── route.js
│   │   │   ├── route.js
│   │   │   └── search
│   │   │       └── route.js
│   │   ├── settings
│   │   │   └── home
│   │   │       └── route.js
│   │   ├── update-legacy-images
│   │   │   └── route.js
│   │   └── user
│   │       └── route.js
│   ├── cart
│   │   └── page.js
│   ├── checkout
│   │   └── page.js
│   ├── error.js
│   ├── favicon.ico
│   ├── fonts
│   │   ├── GeistMonoVF.woff
│   │   └── GeistVF.woff
│   ├── globals.css
│   ├── layout.js
│   ├── login
│   │   └── page.js
│   ├── order-confirmation
│   │   └── [id]
│   │       └── page.js
│   ├── orders
│   │   └── page.js
│   ├── page.js
│   ├── products
│   │   ├── [id]
│   │   │   └── page.js
│   │   └── page.js
│   └── register
│       └── page.js
├── components
│   ├── AddToCartButton.js
│   ├── AdminLayout.js
│   ├── AsyncWrapper.js
│   ├── AuthDialog.js
│   ├── Cart.js
│   ├── CartContext.js
│   ├── CartSummary.js
│   ├── ClientLayout.js
│   ├── ClientToastProvider.js
│   ├── ErrorBoundary.js
│   ├── Footer.js
│   ├── FormInput.js
│   ├── Header.js
│   ├── Navbar.js
│   ├── OrderDetailsModal.js
│   ├── ProductCard.js
│   ├── ProductList.js
│   ├── Providers.js
│   ├── ReviewForm.js
│   ├── Reviews.js
│   ├── SearchFilter.js
│   ├── StatusBadge.js
│   └── ui
│       ├── Toaster.js
│       ├── button.js
│       ├── card.js
│       ├── card.jsx
│       ├── checkbox.jsx
│       ├── dialog.jsx
│       ├── input.js
│       ├── label.jsx
│       ├── select.js
│       ├── select.jsx
│       ├── table.jsx
│       ├── textarea.jsx
│       ├── toast-context.js
│       └── toast.js
├── components.json
├── contexts
│   └── CartContext.js
├── create-admin.js
├── docs
│   └── instructions.md
├── hooks
│   └── useForceUpdate.js
├── jsconfig.json
├── lib
│   ├── constants.js
│   ├── mailer.js
│   ├── mongodb.js
│   └── utils.js
├── middleware
│   └── auth.js
├── middleware.js
├── models
│   ├── Order.js
│   ├── Product.js
│   ├── Setting.js
│   ├── Settings.js
│   └── User.js
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── postcss.config.mjs
├── public
│   └── images
│       ├── 10c89f1d-eb3a-4482-8340-40dab6bc2c0c.webp
│       ├── 1729499089111-product1.jpg
│       ├── 1729499179055-product1.jpg
│       ├── 1729499819702-shoes.webp
│       ├── 1729500183944-ring light.webp
│       ├── 1729505903263-2bc2c4028c185f71e8c0b4e520187b29.jpg_720x720q80.jpg_.webp
│       ├── 1729516350561-Sd1d5dbec057a444b8ae6467cd743dcfey.jpg_720x720q80.jpg_.webp
│       ├── 1729590229998-Sd1d5dbec057a444b8ae6467cd743dcfey.jpg_720x720q80.jpg_.webp
│       ├── 1729590292735-Sd1d5dbec057a444b8ae6467cd743dcfey.jpg_720x720q80.jpg_.webp
│       ├── 1729630027851-9fa427c9a9fbf9af41377f0895ff02cf.jpg_720x720q80.jpg_.webp
│       ├── 1729630230151-Sd1d5dbec057a444b8ae6467cd743dcfey.jpg_720x720q80.jpg_.webp
│       ├── 1729630239580-9fa427c9a9fbf9af41377f0895ff02cf.jpg_720x720q80.jpg_.webp
│       ├── 1729631012532-Sd1d5dbec057a444b8ae6467cd743dcfey.jpg_720x720q80.jpg_.webp
│       ├── 1729636600720-1f551943e2ee4eabd92986569c14f577.jpg_720x720q80.jpg_.webp
│       ├── 7f4739ef-d3f5-4d37-9698-cb738d5be790.webp
│       ├── cd5e5bcd-4a7f-4375-bc2a-846a962b05bb.webp
│       ├── hero-bg.jpg
│       ├── p3.jpg
│       ├── placeholder.jpg
│       ├── placeholder.png
│       └── product1.jpg
├── routes
│   └── auth.js
└── tailwind.config.js
```

## 5. Implementation Details

### 5.1 Product Upload
- Create an admin-only interface for product management
- Implement CRUD operations for products using MongoDB

### 5.2 Cart
- Use local storage or MongoDB to store cart data
- Implement cart functionality in Cart.js component

### 5.3 Checkout
- Create a multi-step checkout process
- Implement order creation in the backend

### 5.4 User Authentication
- Use Next.js built-in authentication or a third-party solution
- Allow guest checkout with email-only

### 5.5 Order Management
- Create admin interface for viewing and updating order statuses
- Implement user-facing order history page

### 5.6 Cash on Delivery
- Implement Cash on Delivery as the sole payment option in the checkout process

### 5.7 SMTP Setup
- Configure SMTP settings in .env.local
- Create email templates for order confirmations and updates

### 5.8 Basic Search and Filter
- Implement server-side search functionality
- Create filter options based on product categories

## 6. Future Enhancements
- Integration with payment gateways
- Advanced search and filtering options
- Customer reviews and ratings
- Inventory management system
- Mobile app development

