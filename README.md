# Luxestore Backend

This is the backend for the Luxestore e-commerce platform. It provides RESTful APIs for product management, user authentication, order processing, and admin operations. Built with Node.js, Express, PostgreSQL, and integrates with Stripe (payments), Cloudinary (images), and imgbb (image uploads).

## Features
- User authentication (JWT, roles: user/admin)
- Product CRUD (admin)
- Order management (user & admin)
- Payment processing (Stripe)
- Image uploads (Cloudinary, imgbb)
- Admin dashboard endpoints

## Setup
1. `npm install`
2. Configure `.env` (see `.env.example`)
3. `npm run dev` (nodemon)

## API Reference
See `../apis.md` for endpoint documentation.
