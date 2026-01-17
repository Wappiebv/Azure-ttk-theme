import { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  FileText,
  CheckCircle,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  useCustomerStore,
  useQuoteStore,
  useDealStore,
  useActivityStore,
} from '../stores';
import { formatCurrency, formatDateTime } from '../lib/utils';

export default function Dashboard() {
  const customers = useCustomerStore((state) => state.customers);
  const quotes = useQuoteStore((state) => state.quotes);
  const deals = useDealStore((state) => state.deals);
  const activities = useActivityStore((state) => state.activities);

  // Calculate metrics
  const metrics = useMemo(() => {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    // Revenue from accepted quotes
    const acceptedQuotes = quotes.filter((q) => q.status === 'Accepted');
    const monthlyRevenue = acceptedQuotes
      .filter((q) => {
        const date = new Date(q.dateUpdated);
        return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
      })
      .reduce((sum, q) => sum + q.total, 0);

    // Won deals this month
    const wonDeals = deals.filter(
      (d) =>
        d.stage === 'Won' &&
        new Date(d.lastActivity).getMonth() === thisMonth &&
        new Date(d.lastActivity).getFullYear() === thisYear
    );

    // Pending quotes
    const pendingQuotes = quotes.filter(
      (q) => q.status === 'Sent' || q.status === 'Viewed'
    ).length;

    // Active customers
    const activeCustomers = customers.filter(
      (c) => c.status === 'Active' || c.status === 'VIP'
    ).length;

    return {
      monthlyRevenue,
      monthlyRevenueChange: 12.5,
      conversions: wonDeals.length,
      conversionsChange: 8.2,
      pendingQuotes,
      pendingQuotesChange: -5.1,
      activeCustomers,
    };
  }, [customers, quotes, deals]);

  // Sales data for chart (last 6 months)
  const salesData = useMemo(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    return months.map((month) => ({
      month,
      revenue: Math.floor(Math.random() * 50000) + 30000,
      deals: Math.floor(Math.random() * 15) + 5,
    }));
  }, []);

  // Category performance
  const categoryData = useMemo(() => {
    return [
      { name: 'Home Theatre', value: 145000, color: '#1e3a8a' },
      { name: 'Speakers', value: 98000, color: '#3b82f6' },
      { name: 'Amplifiers', value: 67000, color: '#fbbf24' },
      { name: 'Source', value: 45000, color: '#f59e0b' },
      { name: 'Cables', value: 23000, color: '#d97706' },
    ];
  }, []);

  // Recent activities
  const recentActivities = useMemo(() => {
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
  }, [activities]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your business.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.monthlyRevenue)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {metrics.monthlyRevenueChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span
                className={
                  metrics.monthlyRevenueChange >= 0 ? 'text-green-500' : 'text-destructive'
                }
              >
                {Math.abs(metrics.monthlyRevenueChange)}%
              </span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.conversions}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {metrics.conversionsChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span
                className={
                  metrics.conversionsChange >= 0 ? 'text-green-500' : 'text-destructive'
                }
              >
                {Math.abs(metrics.conversionsChange)}%
              </span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingQuotes}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              {metrics.pendingQuotesChange >= 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span
                className={
                  metrics.pendingQuotesChange >= 0 ? 'text-green-500' : 'text-destructive'
                }
              >
                {Math.abs(metrics.pendingQuotesChange)}%
              </span>
              <span>from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {customers.filter((c) => c.status === 'VIP').length} VIP customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the last 7 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Revenue by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest customer interactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{activity.title}</p>
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
