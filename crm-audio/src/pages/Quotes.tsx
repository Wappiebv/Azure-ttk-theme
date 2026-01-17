import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileText, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useQuoteStore } from '../stores';
import { formatCurrency, formatDate } from '../lib/utils';
import type { QuoteStatus } from '../types';

export default function Quotes() {
  const navigate = useNavigate();
  const quotes = useQuoteStore((state) => state.quotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'All'>('All');

  // Filter quotes
  const filteredQuotes = useMemo(() => {
    let filtered = quotes;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (quote) =>
          quote.quoteNumber.toLowerCase().includes(query) ||
          quote.customerName.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((quote) => quote.status === statusFilter);
    }

    return filtered.sort(
      (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );
  }, [quotes, searchQuery, statusFilter]);

  const getStatusVariant = (
    status: QuoteStatus
  ): 'default' | 'secondary' | 'success' | 'warning' | 'outline' | 'destructive' => {
    switch (status) {
      case 'Draft':
        return 'outline';
      case 'Sent':
        return 'secondary';
      case 'Viewed':
        return 'warning';
      case 'Accepted':
        return 'success';
      case 'Declined':
        return 'destructive';
      case 'Expired':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalValue = quotes.reduce((sum, q) => sum + q.total, 0);
    const acceptedValue = quotes
      .filter((q) => q.status === 'Accepted')
      .reduce((sum, q) => sum + q.total, 0);
    const pendingCount = quotes.filter(
      (q) => q.status === 'Sent' || q.status === 'Viewed'
    ).length;
    const acceptedCount = quotes.filter((q) => q.status === 'Accepted').length;

    return { totalValue, acceptedValue, pendingCount, acceptedCount };
  }, [quotes]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quotes</h1>
          <p className="text-muted-foreground">Create and manage customer quotes</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Quote
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{quotes.length}</div>
            <p className="text-xs text-muted-foreground">Total Quotes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
            <p className="text-xs text-muted-foreground">Pending Quotes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatCurrency(stats.acceptedValue)}</div>
            <p className="text-xs text-muted-foreground">Accepted Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search quotes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={statusFilter === 'All' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('All')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'Draft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Draft')}
              >
                Draft
              </Button>
              <Button
                variant={statusFilter === 'Sent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Sent')}
              >
                Sent
              </Button>
              <Button
                variant={statusFilter === 'Viewed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Viewed')}
              >
                Viewed
              </Button>
              <Button
                variant={statusFilter === 'Accepted' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Accepted')}
              >
                Accepted
              </Button>
              <Button
                variant={statusFilter === 'Declined' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('Declined')}
              >
                Declined
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredQuotes.length} Quote{filteredQuotes.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredQuotes.map((quote) => (
              <div
                key={quote.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                onClick={() => navigate(`/quotes/${quote.id}`)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{quote.quoteNumber}</h3>
                      <Badge variant={getStatusVariant(quote.status)}>{quote.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {quote.customerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(quote.dateCreated)}
                      </span>
                      <span>{quote.items.length} items</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{formatCurrency(quote.total)}</div>
                  <p className="text-xs text-muted-foreground">
                    Expires {formatDate(quote.expiryDate)}
                  </p>
                </div>
              </div>
            ))}

            {filteredQuotes.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No quotes found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
