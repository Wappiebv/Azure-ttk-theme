import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Grid, List, Package, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useProductStore } from '../stores';
import { formatCurrency } from '../lib/utils';
import type { ProductCategory } from '../types';

export default function Products() {
  const navigate = useNavigate();
  const products = useProductStore((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Categories for filter
  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Speakers',
    'Amplifiers',
    'Source Components',
    'Home Theatre',
    'Cables & Accessories',
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.model.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'All') {
      filtered = filtered.filter((product) => product.category === categoryFilter);
    }

    return filtered;
  }, [products, searchQuery, categoryFilter]);

  // Low stock products
  const lowStockCount = products.filter((p) => p.stockLevel <= p.lowStockThreshold).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog and inventory</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {formatCurrency(
                products.reduce((sum, p) => sum + p.retailPrice * p.stockLevel, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">Inventory Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {products.reduce((sum, p) => sum + p.stockLevel, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{lowStockCount}</div>
              {lowStockCount > 0 && <AlertTriangle className="h-5 w-5 text-warning" />}
            </div>
            <p className="text-xs text-muted-foreground">Low Stock Items</p>
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
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-accent' : ''}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-accent' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategoryFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                      {product.stockLevel <= product.lowStockThreshold && (
                        <Badge variant="warning" className="flex-shrink-0">
                          Low Stock
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold">{formatCurrency(product.retailPrice)}</div>
                        <p className="text-xs text-muted-foreground">
                          Stock: {product.stockLevel}
                        </p>
                      </div>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <h3 className="font-semibold">{product.name}</h3>
                      {product.stockLevel <= product.lowStockThreshold && (
                        <Badge variant="warning">Low Stock</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {product.brand} • {product.model} • SKU: {product.sku}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="outline">{product.category}</Badge>
                      <Badge variant="secondary">{product.subcategory}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{formatCurrency(product.retailPrice)}</div>
                    <p className="text-sm text-muted-foreground">
                      Margin: {product.margin.toFixed(0)}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Stock: {product.stockLevel} units
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
