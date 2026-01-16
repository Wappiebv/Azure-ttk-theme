#!/usr/bin/env python3
"""
Beautiful CRM System
Built with Azure TTK Theme
Features: Login, Dashboard, Customer Management, Sales & Quotes
"""

import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime
import json
import os
from pathlib import Path


class CRMData:
    """Handles data storage and retrieval for the CRM"""

    def __init__(self):
        self.data_file = Path("crm_data.json")
        self.data = self.load_data()

    def load_data(self):
        """Load data from JSON file"""
        if self.data_file.exists():
            with open(self.data_file, 'r') as f:
                return json.load(f)
        return {
            "users": {
                "admin": "admin123",
                "sales": "sales123"
            },
            "customers": [],
            "sales": [],
            "quotes": []
        }

    def save_data(self):
        """Save data to JSON file"""
        with open(self.data_file, 'w') as f:
            json.dump(self.data, f, indent=2)

    def add_customer(self, customer):
        """Add a new customer"""
        customer['id'] = len(self.data['customers']) + 1
        customer['created_date'] = datetime.now().strftime("%Y-%m-%d %H:%M")
        self.data['customers'].append(customer)
        self.save_data()
        return customer['id']

    def add_quote(self, quote):
        """Add a new quote"""
        quote['id'] = len(self.data['quotes']) + 1
        quote['created_date'] = datetime.now().strftime("%Y-%m-%d %H:%M")
        self.data['quotes'].append(quote)
        self.save_data()
        return quote['id']

    def add_sale(self, sale):
        """Add a new sale"""
        sale['id'] = len(self.data['sales']) + 1
        sale['created_date'] = datetime.now().strftime("%Y-%m-%d %H:%M")
        self.data['sales'].append(sale)
        self.save_data()
        return sale['id']

    def get_customers(self):
        """Get all customers"""
        return self.data['customers']

    def get_quotes(self):
        """Get all quotes"""
        return self.data['quotes']

    def get_sales(self):
        """Get all sales"""
        return self.data['sales']

    def update_quote_status(self, quote_id, status):
        """Update quote status"""
        for quote in self.data['quotes']:
            if quote['id'] == quote_id:
                quote['status'] = status
                quote['updated_date'] = datetime.now().strftime("%Y-%m-%d %H:%M")
                self.save_data()
                return True
        return False


class LoginScreen:
    """Login screen for the CRM"""

    def __init__(self, parent, crm_data, on_login_success):
        self.parent = parent
        self.crm_data = crm_data
        self.on_login_success = on_login_success
        self.frame = ttk.Frame(parent)
        self.create_widgets()

    def create_widgets(self):
        """Create login screen widgets"""
        # Center frame
        center_frame = ttk.Frame(self.frame)
        center_frame.place(relx=0.5, rely=0.5, anchor="center")

        # Logo/Title
        title_label = ttk.Label(
            center_frame,
            text="🎯 CRM System",
            font=("Segoe UI", 32, "bold")
        )
        title_label.grid(row=0, column=0, columnspan=2, pady=(0, 10))

        subtitle_label = ttk.Label(
            center_frame,
            text="Customer Relationship Management",
            font=("Segoe UI", 12)
        )
        subtitle_label.grid(row=1, column=0, columnspan=2, pady=(0, 30))

        # Login card
        card_frame = ttk.Frame(center_frame, style='Card.TFrame')
        card_frame.grid(row=2, column=0, columnspan=2, padx=40, pady=20)

        # Username
        ttk.Label(
            card_frame,
            text="Username:",
            font=("Segoe UI", 11)
        ).grid(row=0, column=0, sticky="w", padx=20, pady=(20, 5))

        self.username_entry = ttk.Entry(card_frame, width=30)
        self.username_entry.grid(row=1, column=0, padx=20, pady=(0, 15))
        self.username_entry.focus()

        # Password
        ttk.Label(
            card_frame,
            text="Password:",
            font=("Segoe UI", 11)
        ).grid(row=2, column=0, sticky="w", padx=20, pady=(0, 5))

        self.password_entry = ttk.Entry(card_frame, show="*", width=30)
        self.password_entry.grid(row=3, column=0, padx=20, pady=(0, 20))
        self.password_entry.bind('<Return>', lambda e: self.login())

        # Login button
        login_btn = ttk.Button(
            card_frame,
            text="Login",
            style='Accent.TButton',
            command=self.login,
            width=30
        )
        login_btn.grid(row=4, column=0, padx=20, pady=(0, 20))

        # Hint
        hint_label = ttk.Label(
            center_frame,
            text="Hint: admin/admin123 or sales/sales123",
            font=("Segoe UI", 9),
            foreground="gray"
        )
        hint_label.grid(row=3, column=0, columnspan=2, pady=(10, 0))

    def login(self):
        """Handle login"""
        username = self.username_entry.get()
        password = self.password_entry.get()

        if username in self.crm_data.data['users']:
            if self.crm_data.data['users'][username] == password:
                self.on_login_success(username)
            else:
                messagebox.showerror("Login Failed", "Invalid password!")
                self.password_entry.delete(0, tk.END)
        else:
            messagebox.showerror("Login Failed", "User not found!")
            self.password_entry.delete(0, tk.END)

    def show(self):
        """Show the login screen"""
        self.frame.pack(fill="both", expand=True)

    def hide(self):
        """Hide the login screen"""
        self.frame.pack_forget()


class Dashboard:
    """Main dashboard with metrics and navigation"""

    def __init__(self, parent, crm_data, username):
        self.parent = parent
        self.crm_data = crm_data
        self.username = username
        self.frame = ttk.Frame(parent)
        self.current_view = None
        self.create_widgets()

    def create_widgets(self):
        """Create dashboard widgets"""
        # Main container
        main_container = ttk.Frame(self.frame)
        main_container.pack(fill="both", expand=True)

        # Sidebar
        sidebar = ttk.Frame(main_container, width=220)
        sidebar.pack(side="left", fill="y", padx=(10, 0), pady=10)
        sidebar.pack_propagate(False)

        # Logo in sidebar
        logo_frame = ttk.Frame(sidebar)
        logo_frame.pack(fill="x", pady=(0, 20))

        ttk.Label(
            logo_frame,
            text="🎯 CRM",
            font=("Segoe UI", 18, "bold")
        ).pack()

        ttk.Label(
            logo_frame,
            text=f"Welcome, {self.username}!",
            font=("Segoe UI", 9)
        ).pack()

        # Navigation buttons
        nav_buttons = [
            ("📊 Dashboard", self.show_dashboard_view),
            ("👥 Customers", self.show_customers_view),
            ("💼 Sales", self.show_sales_view),
            ("📝 Quotes", self.show_quotes_view),
        ]

        for text, command in nav_buttons:
            btn = ttk.Button(
                sidebar,
                text=text,
                command=command,
                width=25
            )
            btn.pack(fill="x", pady=5)

        # Separator
        ttk.Separator(sidebar, orient="horizontal").pack(fill="x", pady=20)

        # Theme toggle
        self.theme_var = tk.StringVar(value="dark")
        theme_frame = ttk.Frame(sidebar)
        theme_frame.pack(fill="x", pady=5)

        ttk.Label(theme_frame, text="Theme:").pack(anchor="w")
        theme_switch = ttk.Checkbutton(
            theme_frame,
            text="Dark Mode",
            variable=self.theme_var,
            command=self.toggle_theme,
            style="Switch.TCheckbutton",
            onvalue="dark",
            offvalue="light"
        )
        theme_switch.pack(anchor="w", pady=5)

        # Content area
        self.content_area = ttk.Frame(main_container)
        self.content_area.pack(side="right", fill="both", expand=True, padx=10, pady=10)

        # Show dashboard by default
        self.show_dashboard_view()

    def toggle_theme(self):
        """Toggle between light and dark theme"""
        theme = self.theme_var.get()
        self.parent.tk.call("set_theme", theme)

    def clear_content(self):
        """Clear the content area"""
        for widget in self.content_area.winfo_children():
            widget.destroy()

    def show_dashboard_view(self):
        """Show the dashboard overview"""
        self.clear_content()

        # Header
        header = ttk.Label(
            self.content_area,
            text="Dashboard Overview",
            font=("Segoe UI", 24, "bold")
        )
        header.pack(anchor="w", pady=(0, 20))

        # Metrics cards
        metrics_frame = ttk.Frame(self.content_area)
        metrics_frame.pack(fill="x", pady=(0, 20))

        # Calculate metrics
        total_customers = len(self.crm_data.get_customers())
        total_sales = len(self.crm_data.get_sales())
        total_quotes = len(self.crm_data.get_quotes())

        # Calculate revenue
        total_revenue = sum(float(sale.get('amount', 0)) for sale in self.crm_data.get_sales())

        # Count quotes by status
        pending_quotes = sum(1 for q in self.crm_data.get_quotes() if q.get('status') == 'Pending')
        waiting_quotes = sum(1 for q in self.crm_data.get_quotes() if q.get('status') == 'Waiting Response')

        metrics = [
            ("💰 Revenue", f"${total_revenue:,.2f}", "#4CAF50"),
            ("👥 Customers", str(total_customers), "#2196F3"),
            ("💼 Sales", str(total_sales), "#9C27B0"),
            ("📝 Quotes", str(total_quotes), "#FF9800"),
        ]

        for i, (title, value, color) in enumerate(metrics):
            card = ttk.Frame(metrics_frame, style='Card.TFrame')
            card.grid(row=0, column=i, padx=10, sticky="ew")
            metrics_frame.columnconfigure(i, weight=1)

            ttk.Label(
                card,
                text=title,
                font=("Segoe UI", 11)
            ).pack(anchor="w", padx=20, pady=(15, 5))

            ttk.Label(
                card,
                text=value,
                font=("Segoe UI", 28, "bold")
            ).pack(anchor="w", padx=20, pady=(0, 15))

        # Recent activity section
        activity_label = ttk.Label(
            self.content_area,
            text="Recent Quotes",
            font=("Segoe UI", 16, "bold")
        )
        activity_label.pack(anchor="w", pady=(20, 10))

        # Quotes table
        table_frame = ttk.Frame(self.content_area, style='Card.TFrame')
        table_frame.pack(fill="both", expand=True)

        # Create treeview
        columns = ("ID", "Customer", "Amount", "Status", "Date")
        tree = ttk.Treeview(table_frame, columns=columns, show="headings", height=10)

        # Define headings
        tree.heading("ID", text="ID")
        tree.heading("Customer", text="Customer")
        tree.heading("Amount", text="Amount")
        tree.heading("Status", text="Status")
        tree.heading("Date", text="Date")

        # Define column widths
        tree.column("ID", width=50)
        tree.column("Customer", width=200)
        tree.column("Amount", width=120)
        tree.column("Status", width=150)
        tree.column("Date", width=150)

        # Add scrollbar
        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=scrollbar.set)

        # Pack
        tree.pack(side="left", fill="both", expand=True, padx=10, pady=10)
        scrollbar.pack(side="right", fill="y", pady=10, padx=(0, 10))

        # Populate data
        quotes = self.crm_data.get_quotes()
        for quote in reversed(quotes[-10:]):  # Show last 10
            tree.insert("", "end", values=(
                quote['id'],
                quote['customer_name'],
                f"${float(quote['amount']):,.2f}",
                quote['status'],
                quote['created_date']
            ))

    def show_customers_view(self):
        """Show customers management view"""
        self.clear_content()

        # Header
        header_frame = ttk.Frame(self.content_area)
        header_frame.pack(fill="x", pady=(0, 20))

        ttk.Label(
            header_frame,
            text="Customer Management",
            font=("Segoe UI", 24, "bold")
        ).pack(side="left")

        ttk.Button(
            header_frame,
            text="+ Add Customer",
            style="Accent.TButton",
            command=self.add_customer_dialog
        ).pack(side="right")

        # Customers table
        table_frame = ttk.Frame(self.content_area, style='Card.TFrame')
        table_frame.pack(fill="both", expand=True)

        # Create treeview
        columns = ("ID", "Name", "Email", "Phone", "Company", "Date Added")
        tree = ttk.Treeview(table_frame, columns=columns, show="headings")

        # Define headings
        for col in columns:
            tree.heading(col, text=col)

        # Define column widths
        tree.column("ID", width=50)
        tree.column("Name", width=150)
        tree.column("Email", width=200)
        tree.column("Phone", width=120)
        tree.column("Company", width=150)
        tree.column("Date Added", width=150)

        # Add scrollbar
        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=scrollbar.set)

        # Pack
        tree.pack(side="left", fill="both", expand=True, padx=10, pady=10)
        scrollbar.pack(side="right", fill="y", pady=10, padx=(0, 10))

        # Populate data
        customers = self.crm_data.get_customers()
        for customer in customers:
            tree.insert("", "end", values=(
                customer['id'],
                customer['name'],
                customer['email'],
                customer['phone'],
                customer.get('company', 'N/A'),
                customer['created_date']
            ))

    def show_sales_view(self):
        """Show sales view"""
        self.clear_content()

        # Header
        header_frame = ttk.Frame(self.content_area)
        header_frame.pack(fill="x", pady=(0, 20))

        ttk.Label(
            header_frame,
            text="Sales",
            font=("Segoe UI", 24, "bold")
        ).pack(side="left")

        ttk.Button(
            header_frame,
            text="+ Add Sale",
            style="Accent.TButton",
            command=self.add_sale_dialog
        ).pack(side="right")

        # Sales table
        table_frame = ttk.Frame(self.content_area, style='Card.TFrame')
        table_frame.pack(fill="both", expand=True)

        # Create treeview
        columns = ("ID", "Customer", "Product", "Amount", "Date")
        tree = ttk.Treeview(table_frame, columns=columns, show="headings")

        # Define headings
        for col in columns:
            tree.heading(col, text=col)

        # Define column widths
        tree.column("ID", width=50)
        tree.column("Customer", width=200)
        tree.column("Product", width=250)
        tree.column("Amount", width=120)
        tree.column("Date", width=150)

        # Add scrollbar
        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=scrollbar.set)

        # Pack
        tree.pack(side="left", fill="both", expand=True, padx=10, pady=10)
        scrollbar.pack(side="right", fill="y", pady=10, padx=(0, 10))

        # Populate data
        sales = self.crm_data.get_sales()
        for sale in sales:
            tree.insert("", "end", values=(
                sale['id'],
                sale['customer_name'],
                sale['product'],
                f"${float(sale['amount']):,.2f}",
                sale['created_date']
            ))

    def show_quotes_view(self):
        """Show quotes view"""
        self.clear_content()

        # Header
        header_frame = ttk.Frame(self.content_area)
        header_frame.pack(fill="x", pady=(0, 20))

        ttk.Label(
            header_frame,
            text="Quotes & Proposals",
            font=("Segoe UI", 24, "bold")
        ).pack(side="left")

        ttk.Button(
            header_frame,
            text="+ Add Quote",
            style="Accent.TButton",
            command=self.add_quote_dialog
        ).pack(side="right")

        # Status filter
        filter_frame = ttk.Frame(self.content_area)
        filter_frame.pack(fill="x", pady=(0, 10))

        ttk.Label(filter_frame, text="Filter by status:").pack(side="left", padx=(0, 10))

        # Quotes table
        table_frame = ttk.Frame(self.content_area, style='Card.TFrame')
        table_frame.pack(fill="both", expand=True)

        # Create treeview
        columns = ("ID", "Customer", "Amount", "Status", "Date", "Actions")
        tree = ttk.Treeview(table_frame, columns=columns, show="headings")

        # Define headings
        for col in columns:
            tree.heading(col, text=col)

        # Define column widths
        tree.column("ID", width=50)
        tree.column("Customer", width=200)
        tree.column("Amount", width=120)
        tree.column("Status", width=150)
        tree.column("Date", width=150)
        tree.column("Actions", width=150)

        # Add scrollbar
        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=tree.yview)
        tree.configure(yscrollcommand=scrollbar.set)

        # Pack
        tree.pack(side="left", fill="both", expand=True, padx=10, pady=10)
        scrollbar.pack(side="right", fill="y", pady=10, padx=(0, 10))

        # Populate data
        quotes = self.crm_data.get_quotes()
        for quote in quotes:
            tree.insert("", "end", values=(
                quote['id'],
                quote['customer_name'],
                f"${float(quote['amount']):,.2f}",
                quote['status'],
                quote['created_date'],
                "Update Status"
            ))

        # Bind double-click to update status
        def on_double_click(event):
            item = tree.selection()
            if item:
                values = tree.item(item[0])['values']
                quote_id = values[0]
                self.update_quote_status_dialog(quote_id, tree)

        tree.bind("<Double-1>", on_double_click)

    def add_customer_dialog(self):
        """Show add customer dialog"""
        dialog = tk.Toplevel(self.parent)
        dialog.title("Add New Customer")
        dialog.geometry("400x350")
        dialog.resizable(False, False)

        # Center the dialog
        dialog.transient(self.parent)
        dialog.grab_set()

        # Form frame
        form_frame = ttk.Frame(dialog)
        form_frame.pack(fill="both", expand=True, padx=20, pady=20)

        # Fields
        fields = [
            ("Name:", "name"),
            ("Email:", "email"),
            ("Phone:", "phone"),
            ("Company:", "company"),
        ]

        entries = {}

        for i, (label, key) in enumerate(fields):
            ttk.Label(form_frame, text=label).grid(row=i, column=0, sticky="w", pady=5)
            entry = ttk.Entry(form_frame, width=30)
            entry.grid(row=i, column=1, pady=5, padx=(10, 0))
            entries[key] = entry

        # Buttons
        button_frame = ttk.Frame(form_frame)
        button_frame.grid(row=len(fields), column=0, columnspan=2, pady=20)

        def save_customer():
            customer = {
                'name': entries['name'].get(),
                'email': entries['email'].get(),
                'phone': entries['phone'].get(),
                'company': entries['company'].get()
            }

            if not customer['name'] or not customer['email']:
                messagebox.showerror("Error", "Name and Email are required!")
                return

            self.crm_data.add_customer(customer)
            messagebox.showinfo("Success", "Customer added successfully!")
            dialog.destroy()
            self.show_customers_view()

        ttk.Button(
            button_frame,
            text="Save",
            style="Accent.TButton",
            command=save_customer
        ).pack(side="left", padx=5)

        ttk.Button(
            button_frame,
            text="Cancel",
            command=dialog.destroy
        ).pack(side="left", padx=5)

    def add_sale_dialog(self):
        """Show add sale dialog"""
        dialog = tk.Toplevel(self.parent)
        dialog.title("Add New Sale")
        dialog.geometry("400x300")
        dialog.resizable(False, False)

        dialog.transient(self.parent)
        dialog.grab_set()

        # Form frame
        form_frame = ttk.Frame(dialog)
        form_frame.pack(fill="both", expand=True, padx=20, pady=20)

        # Fields
        ttk.Label(form_frame, text="Customer Name:").grid(row=0, column=0, sticky="w", pady=5)
        customer_entry = ttk.Entry(form_frame, width=30)
        customer_entry.grid(row=0, column=1, pady=5, padx=(10, 0))

        ttk.Label(form_frame, text="Product:").grid(row=1, column=0, sticky="w", pady=5)
        product_entry = ttk.Entry(form_frame, width=30)
        product_entry.grid(row=1, column=1, pady=5, padx=(10, 0))

        ttk.Label(form_frame, text="Amount:").grid(row=2, column=0, sticky="w", pady=5)
        amount_entry = ttk.Entry(form_frame, width=30)
        amount_entry.grid(row=2, column=1, pady=5, padx=(10, 0))

        # Buttons
        button_frame = ttk.Frame(form_frame)
        button_frame.grid(row=3, column=0, columnspan=2, pady=20)

        def save_sale():
            sale = {
                'customer_name': customer_entry.get(),
                'product': product_entry.get(),
                'amount': amount_entry.get()
            }

            if not sale['customer_name'] or not sale['product'] or not sale['amount']:
                messagebox.showerror("Error", "All fields are required!")
                return

            try:
                float(sale['amount'])
            except ValueError:
                messagebox.showerror("Error", "Amount must be a number!")
                return

            self.crm_data.add_sale(sale)
            messagebox.showinfo("Success", "Sale added successfully!")
            dialog.destroy()
            self.show_sales_view()

        ttk.Button(
            button_frame,
            text="Save",
            style="Accent.TButton",
            command=save_sale
        ).pack(side="left", padx=5)

        ttk.Button(
            button_frame,
            text="Cancel",
            command=dialog.destroy
        ).pack(side="left", padx=5)

    def add_quote_dialog(self):
        """Show add quote dialog"""
        dialog = tk.Toplevel(self.parent)
        dialog.title("Add New Quote")
        dialog.geometry("400x350")
        dialog.resizable(False, False)

        dialog.transient(self.parent)
        dialog.grab_set()

        # Form frame
        form_frame = ttk.Frame(dialog)
        form_frame.pack(fill="both", expand=True, padx=20, pady=20)

        # Fields
        ttk.Label(form_frame, text="Customer Name:").grid(row=0, column=0, sticky="w", pady=5)
        customer_entry = ttk.Entry(form_frame, width=30)
        customer_entry.grid(row=0, column=1, pady=5, padx=(10, 0))

        ttk.Label(form_frame, text="Amount:").grid(row=1, column=0, sticky="w", pady=5)
        amount_entry = ttk.Entry(form_frame, width=30)
        amount_entry.grid(row=1, column=1, pady=5, padx=(10, 0))

        ttk.Label(form_frame, text="Description:").grid(row=2, column=0, sticky="w", pady=5)
        description_entry = ttk.Entry(form_frame, width=30)
        description_entry.grid(row=2, column=1, pady=5, padx=(10, 0))

        ttk.Label(form_frame, text="Status:").grid(row=3, column=0, sticky="w", pady=5)
        status_var = tk.StringVar(value="Pending")
        status_combo = ttk.Combobox(
            form_frame,
            textvariable=status_var,
            values=["Pending", "Waiting Response", "Approved", "Rejected"],
            width=27,
            state="readonly"
        )
        status_combo.grid(row=3, column=1, pady=5, padx=(10, 0))

        # Buttons
        button_frame = ttk.Frame(form_frame)
        button_frame.grid(row=4, column=0, columnspan=2, pady=20)

        def save_quote():
            quote = {
                'customer_name': customer_entry.get(),
                'amount': amount_entry.get(),
                'description': description_entry.get(),
                'status': status_var.get()
            }

            if not quote['customer_name'] or not quote['amount']:
                messagebox.showerror("Error", "Customer name and amount are required!")
                return

            try:
                float(quote['amount'])
            except ValueError:
                messagebox.showerror("Error", "Amount must be a number!")
                return

            self.crm_data.add_quote(quote)
            messagebox.showinfo("Success", "Quote added successfully!")
            dialog.destroy()
            self.show_quotes_view()

        ttk.Button(
            button_frame,
            text="Save",
            style="Accent.TButton",
            command=save_quote
        ).pack(side="left", padx=5)

        ttk.Button(
            button_frame,
            text="Cancel",
            command=dialog.destroy
        ).pack(side="left", padx=5)

    def update_quote_status_dialog(self, quote_id, tree):
        """Show update quote status dialog"""
        dialog = tk.Toplevel(self.parent)
        dialog.title("Update Quote Status")
        dialog.geometry("350x200")
        dialog.resizable(False, False)

        dialog.transient(self.parent)
        dialog.grab_set()

        # Form frame
        form_frame = ttk.Frame(dialog)
        form_frame.pack(fill="both", expand=True, padx=20, pady=20)

        ttk.Label(
            form_frame,
            text=f"Update Status for Quote #{quote_id}",
            font=("Segoe UI", 12, "bold")
        ).pack(pady=(0, 20))

        ttk.Label(form_frame, text="New Status:").pack(anchor="w", pady=5)

        status_var = tk.StringVar(value="Pending")
        status_combo = ttk.Combobox(
            form_frame,
            textvariable=status_var,
            values=["Pending", "Waiting Response", "Approved", "Rejected"],
            width=30,
            state="readonly"
        )
        status_combo.pack(pady=5)

        # Buttons
        button_frame = ttk.Frame(form_frame)
        button_frame.pack(pady=20)

        def update_status():
            new_status = status_var.get()
            self.crm_data.update_quote_status(quote_id, new_status)
            messagebox.showinfo("Success", "Quote status updated successfully!")
            dialog.destroy()
            self.show_quotes_view()

        ttk.Button(
            button_frame,
            text="Update",
            style="Accent.TButton",
            command=update_status
        ).pack(side="left", padx=5)

        ttk.Button(
            button_frame,
            text="Cancel",
            command=dialog.destroy
        ).pack(side="left", padx=5)

    def show(self):
        """Show the dashboard"""
        self.frame.pack(fill="both", expand=True)

    def hide(self):
        """Hide the dashboard"""
        self.frame.pack_forget()


class CRMApp:
    """Main CRM Application"""

    def __init__(self):
        self.root = tk.Tk()
        self.root.title("CRM System - Customer Relationship Management")
        self.root.geometry("1200x700")

        # Load Azure theme
        self.root.tk.call("source", "azure.tcl")
        self.root.tk.call("set_theme", "dark")

        # Initialize data
        self.crm_data = CRMData()

        # Create login screen
        self.login_screen = LoginScreen(
            self.root,
            self.crm_data,
            self.on_login_success
        )

        self.dashboard = None

        # Show login screen
        self.login_screen.show()

    def on_login_success(self, username):
        """Handle successful login"""
        self.login_screen.hide()

        # Create and show dashboard
        self.dashboard = Dashboard(self.root, self.crm_data, username)
        self.dashboard.show()

    def run(self):
        """Run the application"""
        self.root.mainloop()


if __name__ == "__main__":
    app = CRMApp()
    app.run()
