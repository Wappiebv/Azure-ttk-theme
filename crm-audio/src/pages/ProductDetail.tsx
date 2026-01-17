import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Edit, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useProductStore } from '../stores';
import { formatCurrency, formatDate } from '../lib/utils';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useProductStore((state) =>
    state.products.find((p) => p.id === id)
  );

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const isLowStock = product.stockLevel <= product.lowStockThreshold;
  const inventoryValue = product.retailPrice * product.stockLevel;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/products')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge>{product.category}</Badge>
              <Badge variant="secondary">{product.subcategory}</Badge>
              {isLowStock && (
                <Badge variant="warning" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Low Stock
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Product
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Product Image & Gallery */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                {product.images[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Package className="h-24 w-24 text-muted-foreground" />
                )}
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-muted rounded-lg overflow-hidden"
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{product.description}</p>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm font-medium">{key}</span>
                    <span className="text-sm text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Brand</p>
                <p className="font-semibold">{product.brand}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Model</p>
                <p className="font-semibold">{product.model}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SKU</p>
                <p className="font-mono text-sm">{product.sku}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Supplier</p>
                <p className="text-sm">{product.supplier}</p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Retail Price</p>
                <p className="text-2xl font-bold">{formatCurrency(product.retailPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cost Price</p>
                <p className="text-lg font-semibold">{formatCurrency(product.costPrice)}</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">Margin</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="font-semibold text-green-500">
                    {product.margin.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Profit per Unit</p>
                <span className="font-semibold">
                  {formatCurrency(product.retailPrice - product.costPrice)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Stock Level</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{product.stockLevel}</p>
                  {isLowStock && <AlertTriangle className="h-5 w-5 text-warning" />}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Low Stock Threshold</p>
                <p className="font-semibold">{product.lowStockThreshold}</p>
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">Inventory Value</p>
                <p className="text-lg font-bold">{formatCurrency(inventoryValue)}</p>
              </div>
              {isLowStock && (
                <div className="rounded-lg bg-warning/10 border border-warning p-3">
                  <p className="text-xs font-medium text-warning">
                    Stock is running low. Consider reordering soon.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date Added</span>
                <span>{formatDate(product.dateAdded)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{formatDate(product.lastUpdated)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
