'use client';

import React, { useState, useEffect } from 'react';
import { BrandButton, BrandCard, colors, theme } from '@mahardika/ui';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseConfig } from '../../lib/env';

interface Product {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  price: number;
  compare_price: number | null;
  currency: string;
  is_active: boolean;
  is_featured: boolean;
  category: string | null;
  tags: string[];
  image_url: string | null;
  images: string[];
  agencies: {
    name: string;
    slug: string;
    brand_color_primary: string;
    brand_color_secondary: string;
  }[];
}

interface MarketplacePageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    featured?: string;
  }>;
}

async function getProducts(searchParams: Awaited<MarketplacePageProps['searchParams']>) {
  const cookieStore = cookies();
  const { url, anonKey } = getSupabaseConfig();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });

  // ✅ PERFORMANCE IMPROVEMENT: Added error handling and better query structure
  try {
    let query = supabase
      .from('products')
      .select(
        `
        id,
        name,
        description,
        slug,
        price,
        compare_price,
        currency,
        is_active,
        is_featured,
        category,
        tags,
        image_url,
        images,
        agencies!inner(
          name,
          slug,
          brand_color_primary,
          brand_color_secondary
        )
      `
      )
      .eq('is_active', true);

    // Apply filters
    if (searchParams.category) {
      query = query.eq('category', searchParams.category);
    }

    if (searchParams.search) {
      query = query.or(
        `name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`
      );
    }

    if (searchParams.featured === 'true') {
      query = query.eq('is_featured', true);
    }

    // Apply sorting
    switch (searchParams.sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'name':
        query = query.order('name', { ascending: true });
        break;
      default:
        query = query
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false });
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return products || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

async function getCategories() {
  const cookieStore = cookies();
  const { url, anonKey } = getSupabaseConfig();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });

  try {
    const { data: categories } = await supabase
      .from('products')
      .select('category')
      .eq('is_active', true)
      .not('category', 'is', null);

    if (!categories) return [];

    // Get unique categories
    const categorySet = new Set(categories.map(p => p.category));
    const uniqueCategories = Array.from(categorySet);
    return uniqueCategories.filter(Boolean);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export default async function MarketplacePage({
  searchParams,
}: MarketplacePageProps) {
  const resolvedSearchParams = await searchParams;
  const products = await getProducts(resolvedSearchParams);
  const categories = await getCategories();

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const renderProductCard = (product: Product) => (
    <div key={product.id} className="col-md-6 col-lg-4 col-xl-3 mb-4">
      <BrandCard
        variant={product.is_featured ? 'gold-outline' : 'navy-outline'}
        size="md"
        className="h-100"
      >
        <div className="position-relative mb-3">
          {product.is_featured && (
            <div
              className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded"
              style={{
                backgroundColor: colors.gold,
                color: colors.navy,
                fontSize: '0.75rem',
                fontWeight: 'bold',
                zIndex: 1,
              }}
            >
              Featured
            </div>
          )}

          <div
            className="rounded"
            style={{
              height: '200px',
              backgroundColor: colors.gray[100],
              backgroundImage: product.image_url
                ? `url(${product.image_url})`
                : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
            }}
          >
            {!product.image_url && '🏢'}
          </div>
        </div>

        <div className="mb-2">
          <h5 className="card-title mb-1" style={{ color: colors.navy }}>
            {product.name}
          </h5>
          <small style={{ color: colors.gray[600] }}>
            by {product.agencies[0]?.name}
          </small>
        </div>

        {product.description && (
          <p
            className="card-text mb-3"
            style={{
              color: colors.gray[700],
              fontSize: '0.9rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </p>
        )}

        {product.category && (
          <div className="mb-3">
            <span
              className="badge"
              style={{
                backgroundColor: `${colors.navy}20`,
                color: colors.navy,
                fontSize: '0.7rem',
              }}
            >
              {product.category
                .replace('-', ' ')
                .replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            {product.compare_price && product.compare_price > product.price && (
              <small
                className="text-decoration-line-through me-2"
                style={{ color: colors.gray[500] }}
              >
                {formatPrice(product.compare_price, product.currency)}
              </small>
            )}
            <span
              className="fw-bold"
              style={{
                color: colors.gold,
                fontSize: '1.1rem',
              }}
            >
              {formatPrice(product.price, product.currency)}
            </span>
          </div>
        </div>

        <BrandButton
          variant={product.is_featured ? 'gold' : 'navy'}
          size="sm"
          className="w-100"
          onClick={() =>
            (window.location.href = `/marketplace/${product.slug}`)
          }
        >
          View Details
        </BrandButton>
      </BrandCard>
    </div>
  );

  return (
    <div className="min-vh-100" style={{ backgroundColor: colors.gray[50] }}>
      {/* Header */}
      <section
        className="py-5"
        style={{
          background: `linear-gradient(135deg, ${colors.navy} 0%, rgba(13, 27, 42, 0.9) 100%)`,
          color: 'white',
        }}
      >
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4">Insurance Marketplace</h1>
              <p className="lead mb-4">
                Discover quality insurance products from trusted agencies across
                the platform
              </p>

              {/* Search Form */}
              <form method="GET" className="row g-2 justify-content-center">
                <div className="col-md-6">
                  <input
                    type="text"
                    name="search"
                    className="form-control form-control-lg"
                    placeholder="Search products..."
                    defaultValue={resolvedSearchParams.search || ''}
                    style={{ borderRadius: '0.5rem' }}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    name="category"
                    className="form-select form-select-lg"
                    defaultValue={resolvedSearchParams.category || ''}
                    style={{ borderRadius: '0.5rem' }}
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category
                          ?.replace('-', ' ')
                          .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2">
                  <BrandButton
                    variant="gold"
                    size="lg"
                    className="w-100"
                    type="submit"
                  >
                    Search
                  </BrandButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Sort */}
      <section className="py-4 border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span style={{ color: colors.navy, fontWeight: '600' }}>
                  Filters:
                </span>
                <a
                  href="/marketplace"
                  className={`badge text-decoration-none ${!resolvedSearchParams.featured ? 'bg-primary' : 'bg-secondary'}`}
                  style={{ fontSize: '0.8rem' }}
                >
                  All Products
                </a>
                <a
                  href="/marketplace?featured=true"
                  className={`badge text-decoration-none ${resolvedSearchParams.featured === 'true' ? 'bg-warning text-dark' : 'bg-secondary'}`}
                  style={{ fontSize: '0.8rem' }}
                >
                  Featured Only
                </a>
              </div>
            </div>
            <div className="col-md-6">
              <form method="GET" className="d-flex justify-content-md-end">
                {/* Preserve existing search params */}
                {resolvedSearchParams.category && (
                  <input
                    type="hidden"
                    name="category"
                    value={resolvedSearchParams.category}
                  />
                )}
                {resolvedSearchParams.search && (
                  <input
                    type="hidden"
                    name="search"
                    value={resolvedSearchParams.search}
                  />
                )}
                {resolvedSearchParams.featured && (
                  <input
                    type="hidden"
                    name="featured"
                    value={resolvedSearchParams.featured}
                  />
                )}

                <div className="d-flex align-items-center">
                  <label
                    htmlFor="sort"
                    className="form-label me-2 mb-0"
                    style={{ color: colors.navy, fontWeight: '600' }}
                  >
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    name="sort"
                    className="form-select"
                    defaultValue={resolvedSearchParams.sort || ''}
                    onChange={e => {
                      const form = e.target.closest('form') as HTMLFormElement;
                      form.submit();
                    }}
                    style={{
                      borderRadius: '0.5rem',
                      maxWidth: '200px',
                    }}
                  >
                    <option value="">Newest First</option>
                    <option value="name">Name A-Z</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 mb-0" style={{ color: colors.navy }}>
              {resolvedSearchParams.search
                ? `Search Results for "${resolvedSearchParams.search}"`
                : 'Available Products'}
            </h2>
            <span style={{ color: colors.gray[600] }}>
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem', color: colors.gray[400] }}>
                📦
              </div>
              <h3 className="h4 mt-3" style={{ color: colors.navy }}>
                No products found
              </h3>
              <p style={{ color: colors.gray[600] }}>
                {resolvedSearchParams.search || resolvedSearchParams.category
                  ? 'Try adjusting your search criteria or browse all products.'
                  : 'No products are currently available in the marketplace.'}
              </p>
              <BrandButton
                variant="navy"
                size="md"
                onClick={() => (window.location.href = '/marketplace')}
              >
                View All Products
              </BrandButton>
            </div>
          ) : (
            <div className="row">{products.map(renderProductCard)}</div>
          )}

          {/* Load More / Pagination could be added here */}
        </div>
      </section>

      {/* Call to Action */}
      <section
        className="py-5 text-center"
        style={{
          background: `linear-gradient(135deg, ${colors.gold} 0%, rgba(244, 180, 0, 0.9) 100%)`,
          color: colors.navy,
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold mb-3">Are you an agency?</h2>
              <p className="lead mb-4">
                List your insurance products on our marketplace and reach more
                customers
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                <BrandButton
                  variant="navy"
                  size="lg"
                  className="px-5"
                  onClick={() => (window.location.href = '/auth')}
                >
                  Join as Agency
                </BrandButton>
                <BrandButton
                  variant="navy-outline"
                  size="lg"
                  className="px-5"
                  onClick={() => (window.location.href = '/dashboard')}
                >
                  Agency Dashboard
                </BrandButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
