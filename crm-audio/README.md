# Audio & Home Theatre CRM System

A complete, production-ready CRM (Customer Relationship Management) application built specifically for home theatre and 2-channel audio businesses. This modern, responsive web application helps manage customers, products, quotes, sales pipeline, installations, and analytics.

![CRM Dashboard](./screenshots/dashboard.png)

## 🎯 Features

### Core Features

- **Dashboard**: Real-time sales metrics, revenue trends, category performance charts, and recent activities feed
- **Customer Management**: Complete customer profiles with purchase history, preferences, notes, and activity timeline
- **Product Catalog**: Comprehensive inventory management with categories, specifications, stock tracking, and low-stock alerts
- **Quote Builder**: Professional quote creation with line items, discounts, tax calculations, and PDF export capability
- **Sales Pipeline**: Visual kanban board with drag-and-drop deal management across sales stages
- **Installation Scheduler**: Schedule and track installations with technician assignment and progress checklists
- **Reports & Analytics**: Detailed analytics with charts for revenue, customer metrics, and product performance
- **Activity Hub**: Track all customer interactions, communications, and tasks with follow-up reminders
- **Settings**: User management, notification preferences, security settings, and system configuration

### Automated Product Import

- **Web Scraper**: Automated product scraping from West Coast HiFi (with proper disclaimers)
- **Data Mapping**: Intelligent categorization and specification extraction
- **Rate Limiting**: Respectful scraping with configurable delays
- **Progress Tracking**: Real-time progress feedback during imports
- **Error Handling**: Robust error handling with retry logic

⚠️ **Web Scraping Disclaimer**: This product scraper is provided for demonstration and initial setup purposes only. Before using it, please review West Coast HiFi's terms of service and robots.txt file. Respect rate limits, and use the scraper responsibly. For commercial use, consider contacting the website owner for permission or using an official API if available.

## 🎨 Design

### Color Scheme

The application uses a professional color palette appropriate for the audio/home theatre industry:

- **Primary**: Deep Navy (#1e3a8a) - Professional and trustworthy
- **Secondary**: Warm Gold (#fbbf24) - Premium accent color
- **Success**: Green (#10b981) - Positive actions
- **Warning**: Amber (#f59e0b) - Alerts and notifications
- **Danger**: Red (#ef4444) - Destructive actions
- **Background**: Light Gray (#f9fafb) - Clean workspace
- **Cards**: White (#ffffff) - Content containers
- **Text**: Dark Gray (#111827) - Primary text
- **Muted**: Gray (#6b7280) - Secondary text

### Dark Mode

Fully supported dark mode with smooth transitions and persistent user preference.

## 🛠️ Technology Stack

### Frontend

- **React 18+** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tooling
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Zustand** - Lightweight state management
- **Framer Motion** - Smooth animations

### UI Components

- **Custom Component Library** - Based on shadcn/ui patterns
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **@dnd-kit** - Drag and drop functionality
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **date-fns** - Date manipulation

### Web Scraping

- **Cheerio** - HTML parsing
- **Axios** - HTTP requests
- **Rate Limiting** - Respectful scraping

### Data Storage

- **LocalStorage** - Client-side persistence
- **Zustand Persist** - State persistence middleware
- **JSON** - Structured data format

*Ready to migrate to MongoDB, PostgreSQL, or Supabase for production use*

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   cd /path/to/Azure-ttk-theme/crm-audio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production-ready build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🔧 Running the Product Scraper

The web scraper is a separate Node.js script that imports products from West Coast HiFi.

### Important: Before Running

1. Review West Coast HiFi's terms of service
2. Check their robots.txt file
3. Use responsibly and only for initial setup
4. Consider contacting them for permission for commercial use

### Run the Scraper

```bash
cd src/scraper
node scrapeProducts.ts
```

Or use the built-in scraper UI in the admin settings section of the CRM.

### Configuration

Edit `src/scraper/scrapeProducts.ts` to adjust:
- Rate limiting (default: 2.5 seconds between requests)
- Categories to scrape
- Retry logic
- Output file location

## 📁 Project Structure

```
crm-audio/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── customers/       # Customer components
│   │   ├── products/        # Product components
│   │   ├── quotes/          # Quote builder components
│   │   ├── pipeline/        # Sales pipeline components
│   │   ├── calendar/        # Installation calendar
│   │   └── layout/          # Layout components (Sidebar, Topbar)
│   ├── pages/               # Page components (routes)
│   ├── lib/                 # Utility functions
│   ├── hooks/               # Custom React hooks
│   ├── stores/              # Zustand state stores
│   ├── types/               # TypeScript type definitions
│   ├── data/                # Sample data and JSON storage
│   ├── scraper/             # Web scraping scripts
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # App entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── README.md                # This file
```

## 🎮 Usage Guide

### Dashboard

The dashboard provides an at-a-glance view of your business:
- Monthly revenue with trend indicators
- Conversion rates and pending quotes
- Active customer count
- Revenue trend charts
- Category performance breakdown
- Recent customer activities

### Customer Management

**List View**:
- Search by name, email, or phone
- Filter by status (Lead, Qualified, Active, VIP, Inactive)
- Sort by various criteria
- Quick view of total spent

**Detail View**:
- Complete contact information
- Purchase history
- Communication timeline
- Notes and preferences
- Related quotes and deals

**Adding a Customer**:
1. Click "Add Customer" button
2. Fill in customer details
3. Set status and type
4. Add tags and preferences
5. Save

### Product Catalog

**Features**:
- Grid or list view toggle
- Filter by category and subcategory
- Search by name, brand, or SKU
- Stock level monitoring
- Low stock alerts
- Pricing and margin calculations

**Product Detail**:
- Image gallery
- Full specifications
- Stock management
- Pricing information
- Sales history

### Quote Builder

**Creating a Quote**:
1. Select customer
2. Add line items from product catalog
3. Add custom line items (installation, delivery, etc.)
4. Apply discounts
5. Review totals (including tax)
6. Add notes and terms
7. Save as draft or send to customer

**Quote Actions**:
- Export to PDF
- Duplicate quote
- Send via email (mockup)
- Convert to sale
- Track status changes

### Sales Pipeline

**Drag-and-Drop Kanban**:
- Move deals between stages
- Track deal value and expected close dates
- Set priority levels
- Filter by product type
- View pipeline metrics

**Stages**:
1. Lead
2. Qualified
3. Proposal Sent
4. Negotiation
5. Won
6. Lost

### Installation Scheduler

**Features**:
- Schedule installations with date/time
- Assign technicians
- Track installation status
- Manage installation checklists
- Upload before/after photos
- Collect customer signatures

**Statuses**:
- Scheduled
- In Progress
- Completed
- Cancelled

### Reports & Analytics

**Available Reports**:
- Revenue trends over time
- Sales by category
- Sales by brand
- Top customers by revenue
- Customer acquisition trends
- Product performance
- Conversion rates
- Average deal size
- Sales cycle length

**Export Options**:
- CSV export
- PDF export
- Date range filtering

## 🌙 Dark Mode

Toggle dark mode from the top navigation bar. Your preference is automatically saved.

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full featured experience (1024px+)
- **Tablet**: Optimized layout (768px - 1024px)
- **Mobile**: Compact, touch-friendly interface (320px - 768px)

## 🔐 Security Considerations

### Current Implementation (Demo/Development)

- Client-side storage using LocalStorage
- No authentication (add before production deployment)
- No API security (implement when adding backend)

### Production Recommendations

1. Implement user authentication (JWT, OAuth, etc.)
2. Add role-based access control
3. Secure API endpoints
4. Use HTTPS
5. Implement CSRF protection
6. Add rate limiting
7. Sanitize user inputs
8. Regular security audits

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy

### Netlify

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

### Other Platforms

The application is a standard Vite React app and can be deployed to any static hosting platform.

## 🔄 Data Migration

The current implementation uses JSON files and LocalStorage. To migrate to a database:

1. Choose your backend (Node.js + Express, Supabase, Firebase, etc.)
2. Create database schema based on TypeScript types in `src/types/`
3. Replace Zustand stores with API calls
4. Implement authentication
5. Add server-side validation

## 📝 Sample Data

The application comes pre-loaded with realistic sample data:

- **8 Customers**: Mix of leads, active, VIP, and inactive customers
- **8 Products**: Selection of speakers, amplifiers, and accessories
- **3 Quotes**: Various statuses and values
- **5 Deals**: Across different pipeline stages
- **3 Installations**: Scheduled, in progress, and completed
- **Multiple Activities**: Notes, calls, emails, and events
- **Tasks**: Pending and completed tasks

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

## 📄 License

This project is provided as-is for demonstration purposes.

## 🆘 Support

For issues or questions:
1. Check the documentation above
2. Review the code comments
3. Check TypeScript types for data structures
4. Inspect browser console for errors

## 🎯 Roadmap

Potential future enhancements:

- [ ] Backend API integration
- [ ] Real authentication system
- [ ] Email integration (SendGrid, Mailgun)
- [ ] SMS notifications
- [ ] Document management (store contracts, invoices)
- [ ] Advanced reporting (custom report builder)
- [ ] Multi-user collaboration
- [ ] Real-time updates (WebSocket)
- [ ] Mobile apps (React Native)
- [ ] Integration with accounting software (Xero, QuickBooks)
- [ ] Automated workflows
- [ ] AI-powered recommendations

## 📸 Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Customer Management
![Customers](./screenshots/customers.png)

### Product Catalog
![Products](./screenshots/products.png)

### Quote Builder
![Quote Builder](./screenshots/quotes.png)

### Sales Pipeline
![Pipeline](./screenshots/pipeline.png)

### Dark Mode
![Dark Mode](./screenshots/dark-mode.png)

---

**Built with ❤️ for the audio and home theatre industry**
