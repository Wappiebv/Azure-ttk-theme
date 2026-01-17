import { useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Download,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
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
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import {
  useCustomerStore,
  useQuoteStore,
  useDealStore,
  useProductStore,
} from '../stores';
import { formatCurrency } from '../lib/utils';

export default function Reports() {
  const customers = useCustomerStore((state) => state.customers);
  const quotes = useQuoteStore((state) => state.quotes);
  const deals = useDealStore((state) => state.deals);
  const products = useProductStore((state) => state.products);

  // Sales by month data
  const salesByMonth = useMemo(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    return months.map((month) => ({
      month,
      revenue: Math.floor(Math.random() * 80000) + 40000,
      deals: Math.floor(Math.random() * 20) + 5,
      quotes: Math.floor(Math.random() * 30) + 10,
    }));
  }, []);

  // Product category performance
  const categoryPerformance = useMemo(() => {
    const categories = [
      { name: 'Home Theatre', value: 145000, color: '#1e3a8a', units: 45 },
      { name: 'Speakers', value: 98000, color: '#3b82f6', units: 78 },
      { name: 'Amplifiers', value: 67000, color: '#fbbf24', units: 34 },
      { name: 'Source Components', value: 45000, color: '#f59e0b', units: 56 },
      { name: 'Cables & Accessories', value: 23000, color: '#d97706', units: 124 },
    ];
    return categories;
  }, []);

  // Customer acquisition
  const customerAcquisition = useMemo(() => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    return months.map((month) => ({
      month,
      new: Math.floor(Math.random() * 15) + 5,
      active: Math.floor(Math.random() * 30) + 20,
      vip: Math.floor(Math.random() * 8) + 2,
    }));
  }, []);

  // Sales performance metrics
  const performanceMetrics = useMemo(() => {
    const totalRevenue = quotes
      .filter((q) => q.status === 'Accepted')
      .reduce((sum, q) => sum + q.total, 0);

    const wonDeals = deals.filter((d) => d.stage === 'Won');
    const totalDeals = deals.filter((d) => d.stage !== 'Lost');
    const conversionRate = totalDeals.length > 0
      ? (wonDeals.length / totalDeals.length) * 100
      : 0;

    const avgDealSize =
      wonDeals.length > 0
        ? wonDeals.reduce((sum, d) => sum + d.value, 0) / wonDeals.length
        : 0;

    const totalCustomers = customers.length;
    const vipCustomers = customers.filter((c) => c.status === 'VIP').length;

    return {
      totalRevenue,
      conversionRate,
      avgDealSize,
      totalCustomers,
      vipCustomers,
    };
  }, [quotes, deals, customers]);

  // Top products
  const topProducts = useMemo(() => {
    return products
      .map((p) => ({
        name: p.name,
        brand: p.brand,
        revenue: p.retailPrice * (Math.floor(Math.random() * 20) + 5),
        unitsSold: Math.floor(Math.random() * 20) + 5,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [products]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your business performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Last 6 Months
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(performanceMetrics.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {quotes.filter((q) => q.status === 'Accepted').length} closed quotes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceMetrics.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {deals.filter((d) => d.stage === 'Won').length} won deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(performanceMetrics.avgDealSize)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all won deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceMetrics.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {performanceMetrics.vipCustomers} VIP customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue and deal performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByMonth}>
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Revenue distribution by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryPerformance}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Customer Acquisition */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Acquisition</CardTitle>
            <CardDescription>New and active customers by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerAcquisition}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="new" fill="hsl(var(--primary))" name="New Customers" />
                <Bar dataKey="active" fill="hsl(var(--secondary))" name="Active" />
                <Bar dataKey="vip" fill="#10b981" name="VIP" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between pb-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.unitsSold} units
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Details</CardTitle>
          <CardDescription>Detailed breakdown by product category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Category</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Revenue</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Units Sold</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">Avg Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {categoryPerformance.map((category) => {
                  const totalRevenue = categoryPerformance.reduce(
                    (sum, c) => sum + c.value,
                    0
                  );
                  const percentage = (category.value / totalRevenue) * 100;
                  return (
                    <tr key={category.name} className="border-b border-border last:border-0">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-semibold">
                        {formatCurrency(category.value)}
                      </td>
                      <td className="text-right py-3 px-4">{category.units}</td>
                      <td className="text-right py-3 px-4">
                        {formatCurrency(category.value / category.units)}
                      </td>
                      <td className="text-right py-3 px-4">{percentage.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
