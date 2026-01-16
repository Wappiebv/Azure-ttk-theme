# Quick Start Guide - CRM System

## Launch the Application

### Linux/Mac:
```bash
./start_crm.sh
```

### Windows:
```
start_crm.bat
```

### Manual:
```bash
python3 crm_app.py
```

## Login

**Default Accounts:**
- Admin: `admin` / `admin123`
- Sales: `sales` / `sales123`

## Main Features

### 📊 Dashboard
- View real-time metrics
- See recent quotes
- Monitor revenue and customer count

### 👥 Customer Management
1. Click "👥 Customers"
2. Click "+ Add Customer"
3. Fill in details (Name & Email required)
4. Click "Save"

### 💼 Sales
1. Click "💼 Sales"
2. Click "+ Add Sale"
3. Enter customer, product, and amount
4. Click "Save"

### 📝 Quotes
1. Click "📝 Quotes"
2. Click "+ Add Quote"
3. Fill in customer, amount, and select status:
   - **Pending** - Just created
   - **Waiting Response** - Sent to customer
   - **Approved** - Customer accepted
   - **Rejected** - Customer declined
4. Click "Save"

### Update Quote Status
- Double-click any quote in the table
- Select new status
- Click "Update"

## Theme

Toggle between Light/Dark mode using the switch in the sidebar.

## Sample Data

Want to try the CRM with pre-loaded data?
1. Copy `sample_crm_data.json` to `crm_data.json`
2. Launch the application

Or use the launcher scripts which will ask if you want to load sample data!

## Tips

- All data is automatically saved to `crm_data.json`
- The application creates this file automatically
- You can backup your data by copying `crm_data.json`
- Double-click quotes to update their status quickly

## Need Help?

See the full documentation in `CRM_README.md`

---

**Happy CRM-ing!** 🎯
