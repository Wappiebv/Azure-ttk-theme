import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Edit,
  Trash2,
  Copy,
  Send,
  Download,
  Plus,
  Calendar,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useQuoteStore } from '../stores';
import { formatCurrency, formatDate } from '../lib/utils';

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quote = useQuoteStore((state) => state.quotes.find((q) => q.id === id));
  const duplicateQuote = useQuoteStore((state) => state.duplicateQuote);

  if (!quote) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Quote not found</h2>
          <p className="text-muted-foreground mb-4">
            The quote you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/quotes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Quotes
          </Button>
        </div>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
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
      default:
        return 'outline';
    }
  };

  const handleDuplicate = () => {
    duplicateQuote(quote.id);
    navigate('/quotes');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/quotes')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{quote.quoteNumber}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusVariant(quote.status) as any}>{quote.status}</Badge>
              <span className="text-sm text-muted-foreground">
                Created {formatDate(quote.dateCreated)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {quote.status === 'Draft' && (
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send Quote
            </Button>
          )}
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleDuplicate}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Quote Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Customer & Date Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Customer</h3>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{quote.customerName}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Expiry Date
                  </h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{formatDate(quote.expiryDate)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Line Items</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 h-3 w-3" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quote.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{item.productName}</h4>
                        {item.isCustom && (
                          <Badge variant="secondary" className="text-xs">
                            Custom
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-muted-foreground">
                          Qty: <span className="font-medium text-foreground">{item.quantity}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Price:{' '}
                          <span className="font-medium text-foreground">
                            {formatCurrency(item.unitPrice)}
                          </span>
                        </span>
                        {item.discount > 0 && (
                          <span className="text-muted-foreground">
                            Discount:{' '}
                            <span className="font-medium text-foreground">
                              {item.discount}%
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{formatCurrency(item.subtotal)}</div>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes & Terms */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {quote.notes || 'No notes added'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {quote.terms || 'No terms specified'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar - Quote Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatCurrency(quote.subtotal)}</span>
                </div>

                {quote.discountPercentage > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Discount ({quote.discountPercentage}%)
                    </span>
                    <span className="font-medium text-destructive">
                      -{formatCurrency(quote.discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax ({quote.taxRate}%)</span>
                  <span className="font-medium">{formatCurrency(quote.taxAmount)}</span>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold">{formatCurrency(quote.total)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(quote.dateCreated)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{formatDate(quote.dateUpdated)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valid Until</span>
                  <span>{formatDate(quote.expiryDate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <User className="mr-2 h-4 w-4" />
                View Customer
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Convert to Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Send className="mr-2 h-4 w-4" />
                Send Reminder
              </Button>
            </CardContent>
          </Card>

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{quote.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(quote.dateUpdated)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
