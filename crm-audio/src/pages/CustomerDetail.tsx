import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Edit,
  FileText,
  Activity as ActivityIcon,
  StickyNote,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  useCustomerStore,
  useQuoteStore,
  useActivityStore,
} from '../stores';
import { formatCurrency, formatDate, formatDateTime } from '../lib/utils';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = useCustomerStore((state) =>
    state.customers.find((c) => c.id === id)
  );
  const quotes = useQuoteStore((state) =>
    state.quotes.filter((q) => q.customerId === id)
  );
  const getActivitiesByCustomer = useActivityStore(
    (state) => state.getActivitiesByCustomer
  );
  const activities = getActivitiesByCustomer(id || '');

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'activities' | 'notes'>(
    'overview'
  );

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Customer not found</h2>
          <p className="text-muted-foreground mb-4">
            The customer you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/customers')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  const totalQuoteValue = quotes.reduce((sum, q) => sum + q.total, 0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'history', label: 'Purchase History', icon: DollarSign },
    { id: 'activities', label: 'Activities', icon: ActivityIcon },
    { id: 'notes', label: 'Notes', icon: StickyNote },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {customer.firstName} {customer.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge>{customer.status}</Badge>
              <Badge variant="outline">{customer.type}</Badge>
              {customer.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Customer
        </Button>
      </div>

      {/* Contact Info & Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{customer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{customer.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {customer.address}, {customer.city} {customer.state} {customer.postcode}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Added {formatDate(customer.dateAdded)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-2xl font-bold">{formatCurrency(customer.totalSpent)}</div>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{formatCurrency(totalQuoteValue)}</div>
              <p className="text-xs text-muted-foreground">Total Quote Value</p>
            </div>
            <div>
              <div className="text-lg font-semibold">{quotes.length}</div>
              <p className="text-xs text-muted-foreground">Total Quotes</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Favorite Brands</p>
              <div className="flex flex-wrap gap-1">
                {customer.preferences.favoritesBrands.map((brand) => (
                  <Badge key={brand} variant="outline" className="text-xs">
                    {brand}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Budget Range</p>
              <p className="text-sm font-medium">{customer.preferences.budgetRange}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Interests</p>
              <div className="flex flex-wrap gap-1">
                {customer.preferences.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <div className="flex gap-2 border-b border-border -mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Customer Notes</h3>
                <p className="text-sm text-muted-foreground">{customer.notes}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Last Contact</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(customer.lastContact)}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {quotes.length > 0 ? (
                quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => navigate(`/quotes/${quote.id}`)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{quote.quoteNumber}</h4>
                        <Badge>{quote.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {quote.items.length} item{quote.items.length !== 1 ? 's' : ''} •{' '}
                        {formatDate(quote.dateCreated)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(quote.total)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No purchase history
                </p>
              )}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm">{activity.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDateTime(activity.date)} • {activity.userName}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No activities</p>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <p className="text-sm">{customer.notes}</p>
              </div>
              <Button variant="outline" size="sm">
                Add Note
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
