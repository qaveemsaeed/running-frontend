# Recipe Basket - Frontend

A modern React-based food delivery and recipe management application built with Vite, Tailwind CSS, and React Router.

## Features

- 🍽️ **Recipe Browsing**: Browse and search through a collection of delicious recipes
- 🛒 **Shopping Cart**: Add items to cart and manage quantities
- 👤 **User Authentication**: Login and signup functionality
- 📍 **Address Management**: Save and manage delivery addresses
- 💳 **Checkout Process**: Complete order placement with payment
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🎨 **Modern UI**: Beautiful interface with Tailwind CSS

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **Icons**: Lucide React, React Icons
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_AUTH_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/            # React Context providers
├── pages/              # Page components
│   ├── admin/          # Admin panel
│   ├── auth/           # Authentication pages
│   ├── cart/           # Shopping cart
│   ├── checkout/       # Checkout process
│   ├── home/           # Home page
│   ├── profile/        # User profile
│   └── Recipe/         # Recipe pages
├── config/             # Configuration files
├── data/               # Static data
└── assets/             # Images and static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Connect to Vercel**: 
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel will auto-detect Vite configuration
3. **Environment Variables**: Set production API URLs in Vercel dashboard
4. **Deploy**: Click deploy and wait for build completion

### Railway

1. **Sign up** at [railway.app](https://railway.app)
2. **Connect** your GitHub repository
3. **Configure** environment variables
4. **Deploy**

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Main API base URL | `http://localhost:3000/api` |
| `VITE_AUTH_API_BASE_URL` | Auth API base URL | `http://localhost:5000/api` |

## API Integration

The application uses a centralized API configuration (`src/config/api.js`) that automatically handles:
- Environment-based URL switching
- Endpoint management
- Request/response handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the deployment guide
- Review API documentation
- Open an issue on GitHub
