import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useCustomerStore } from '../stores';
import { formatCurrency, formatDate } from '../lib/utils';
import type { CustomerStatus } from '../types';

export default function Customers() {
  const navigate = useNavigate();
  const customers = useCustomerStore((state) => state.customers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'All'>('All');

  // Filter customers
  const filteredCustomers = useMemo(() => {
    let filtered = customers;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(query) ||
          customer.lastName.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone.includes(query) ||
          customer.city.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((customer) => customer.status === statusFilter);
    }

    return filtered;
  }, [customers, searchQuery, statusFilter]);

  const getStatusVariant = (
    status: CustomerStatus
  ): 'default' | 'secondary' | 'success' | 'warning' | 'outline' => {
    switch (status) {
      case 'VIP':
        return 'default';
      case 'Active':
        return 'success';
      case 'Qualified':
        return 'secondary';
      case 'Lead':
        return 'warning';
      case 'Inactive':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships and track interactions
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'All' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('All')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'VIP' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('VIP')}
              >
                VIP
              </Button>
              <Button
                variant={statusFilter === 'Active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Active')}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === 'Qualified' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Qualified')}
              >
                Qualified
              </Button>
              <Button
                variant={statusFilter === 'Lead' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Lead')}
              >
                Lead
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {customers.filter((c) => c.status === 'VIP').length}
            </div>
            <p className="text-xs text-muted-foreground">VIP Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {customers.filter((c) => c.status === 'Active').length}
            </div>
            <p className="text-xs text-muted-foreground">Active Customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {customers.filter((c) => c.status === 'Lead').length}
            </div>
            <p className="text-xs text-muted-foreground">New Leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
            </div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredCustomers.length} Customer{filteredCustomers.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                onClick={() => navigate(`/customers/${customer.id}`)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                      {customer.firstName[0]}
                      {customer.lastName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {customer.firstName} {customer.lastName}
                        </h3>
                        <Badge variant={getStatusVariant(customer.status)}>
                          {customer.status}
                        </Badge>
                        <Badge variant="outline">{customer.type}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {customer.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {customer.city}, {customer.state}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8 text-right">
                  <div>
                    <div className="text-sm font-medium">
                      {formatCurrency(customer.totalSpent)}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Spent</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {formatDate(customer.lastContact)}
                    </div>
                    <p className="text-xs text-muted-foreground">Last Contact</p>
                  </div>
                </div>
              </div>
            ))}

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No customers found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
