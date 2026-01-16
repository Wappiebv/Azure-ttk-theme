# Beautiful CRM System

A modern, feature-rich Customer Relationship Management (CRM) system built with Python and the Azure TTK theme.

![CRM System](https://img.shields.io/badge/Python-3.6+-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## Features

### 🔐 User Authentication
- Secure login system
- Multiple user accounts support
- Pre-configured demo accounts

### 📊 Dashboard Overview
- Real-time metrics display
- Revenue tracking
- Customer count
- Sales statistics
- Quote management
- Recent activity feed

### 👥 Customer Management
- Add new customers
- View all customers in a clean table
- Store customer information:
  - Name
  - Email
  - Phone
  - Company
  - Registration date

### 💼 Sales Tracking
- Record sales transactions
- Track customer purchases
- Monitor revenue
- View sales history

### 📝 Quotes & Proposals
- Create quotes for customers
- Multiple status options:
  - Pending
  - Waiting Response
  - Approved
  - Rejected
- Update quote status with double-click
- Track quote amounts and dates

### 🎨 Beautiful UI
- Modern Azure theme (Dark & Light modes)
- Responsive layout
- Card-based design
- Clean typography
- Intuitive navigation

## Installation

### Prerequisites
- Python 3.6 or higher
- tkinter (usually comes with Python)

### Setup

1. Clone or download this repository

2. Navigate to the Azure-ttk-theme directory:
```bash
cd Azure-ttk-theme
```

3. Run the CRM application:
```bash
python3 crm_app.py
```

## Usage

### Login

When you first launch the application, you'll see a login screen.

**Demo Accounts:**
- Username: `admin` | Password: `admin123`
- Username: `sales` | Password: `sales123`

### Navigation

The application has a sidebar with the following sections:

1. **📊 Dashboard** - Overview of your CRM data with metrics
2. **👥 Customers** - Manage your customer database
3. **💼 Sales** - Track sales transactions
4. **📝 Quotes** - Manage quotes and proposals

### Adding Data

#### Add a Customer
1. Click on "👥 Customers" in the sidebar
2. Click the "+ Add Customer" button
3. Fill in the customer details:
   - Name (required)
   - Email (required)
   - Phone
   - Company
4. Click "Save"

#### Add a Sale
1. Click on "💼 Sales" in the sidebar
2. Click the "+ Add Sale" button
3. Fill in the sale details:
   - Customer Name
   - Product
   - Amount
4. Click "Save"

#### Add a Quote
1. Click on "📝 Quotes" in the sidebar
2. Click the "+ Add Quote" button
3. Fill in the quote details:
   - Customer Name
   - Amount
   - Description
   - Status (Pending, Waiting Response, Approved, Rejected)
4. Click "Save"

#### Update Quote Status
1. Go to the "📝 Quotes" section
2. Double-click on any quote in the table
3. Select the new status
4. Click "Update"

### Theme Toggle

Switch between Dark and Light modes:
- Look for the "Theme" section in the sidebar
- Toggle the "Dark Mode" switch

## Data Storage

The CRM automatically saves all data to a `crm_data.json` file in the same directory as the application. This file is created automatically when you add your first record.

### Data Structure
```json
{
  "users": {
    "admin": "admin123",
    "sales": "sales123"
  },
  "customers": [],
  "sales": [],
  "quotes": []
}
```

## Features in Detail

### Dashboard Metrics

The dashboard displays four key metrics:

1. **💰 Revenue** - Total revenue from all sales
2. **👥 Customers** - Total number of customers
3. **💼 Sales** - Total number of sales transactions
4. **📝 Quotes** - Total number of quotes

Below the metrics, you'll see a table showing the 10 most recent quotes.

### Status Tracking

Quotes can have the following statuses:

- **Pending** - Quote has been created, awaiting action
- **Waiting Response** - Quote sent to customer, waiting for their response
- **Approved** - Customer approved the quote
- **Rejected** - Customer rejected the quote

This allows you to track the progress of each quote through your sales pipeline.

## Screenshots

### Login Screen
Clean, modern login interface with card-based design.

### Dashboard
Overview of all your CRM data with beautiful metric cards and recent activity.

### Customer Management
Full-featured table to view and manage all customers.

### Sales Tracking
Track all sales with customer details and amounts.

### Quotes Management
Create and manage quotes with status tracking.

## Customization

### Adding More Users

To add more users, you can either:

1. Manually edit the `crm_data.json` file:
```json
{
  "users": {
    "admin": "admin123",
    "sales": "sales123",
    "newuser": "password123"
  }
}
```

2. Or modify the `CRMData` class in `crm_app.py` to add user registration functionality.

### Changing Colors

The CRM uses the Azure TTK theme. You can customize colors by:

1. Modifying `theme/dark.tcl` for dark mode colors
2. Modifying `theme/light.tcl` for light mode colors

## Technical Details

### Built With
- **Python 3** - Main programming language
- **tkinter** - GUI framework
- **ttk** - Themed widgets
- **Azure TTK Theme** - Modern theme
- **JSON** - Data storage

### Architecture
- **CRMData** - Handles data persistence and CRUD operations
- **LoginScreen** - Authentication interface
- **Dashboard** - Main application interface with navigation
- **Dialogs** - Modal windows for adding/editing data

### File Structure
```
Azure-ttk-theme/
├── crm_app.py          # Main CRM application
├── crm_data.json       # Auto-generated data file
├── azure.tcl           # Theme loader
├── theme/              # Theme assets
│   ├── dark.tcl
│   ├── light.tcl
│   ├── dark/          # Dark theme images
│   └── light/         # Light theme images
└── CRM_README.md       # This file
```

## Troubleshooting

### "No module named tkinter"
Install tkinter:
```bash
# Ubuntu/Debian
sudo apt-get install python3-tk

# Fedora
sudo dnf install python3-tkinter

# macOS (with Homebrew)
brew install python-tk
```

### "azure.tcl not found"
Make sure you're running the application from the Azure-ttk-theme directory:
```bash
cd Azure-ttk-theme
python3 crm_app.py
```

### Data not saving
Ensure the application has write permissions in the current directory.

## Future Enhancements

Potential features to add:

- [ ] Export data to CSV/Excel
- [ ] Search and filter functionality
- [ ] Customer notes and activity log
- [ ] Email integration
- [ ] Reports and analytics
- [ ] Multi-user support with roles
- [ ] Data backup and restore
- [ ] Invoice generation
- [ ] Calendar integration
- [ ] Task management

## License

This CRM application uses the Azure TTK Theme which is licensed under the MIT License.

## Credits

- Azure TTK Theme by [rdbende](https://github.com/rdbende/Azure-ttk-theme)
- CRM Application design inspired by modern dashboard interfaces

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the Azure TTK Theme documentation
3. Check Python tkinter documentation

---

**Enjoy your new CRM system!** 🎯
