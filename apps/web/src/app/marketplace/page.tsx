'use client';

import React, { useState, useEffect } from 'react';
import { BrandButton, BrandCard, colors, theme } from '@mahardika/ui';

// Mock data for demonstration
const mockProducts = [
  {
    id: '1',
    name: 'Premium Business Insurance Package',
    description: 'Comprehensive coverage for small to medium businesses with liability, property, and cyber protection.',
    price: 299,
    originalPrice: 399,
    currency: 'USD',
    category: 'Business Insurance',
    featured: true,
    rating: 4.9,
    reviews: 124,
    agency: 'SecureShield Insurance',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    tags: ['Business', 'Liability', 'Cyber'],
    badge: 'Best Seller',
    badgeColor: colors.gold
  },
  {
    id: '2',
    name: 'Family Health & Life Bundle',
    description: 'Complete family protection with health, life, and disability insurance at an affordable rate.',
    price: 189,
    originalPrice: 249,
    currency: 'USD',
    category: 'Health Insurance',
    featured: true,
    rating: 4.8,
    reviews: 98,
    agency: 'FamilyFirst Insurance',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    tags: ['Family', 'Health', 'Life'],
    badge: 'Popular',
    badgeColor: colors.navy
  },
  {
    id: '3',
    name: 'Auto Insurance Plus',
    description: 'Enhanced auto coverage with roadside assistance, rental car, and comprehensive collision protection.',
    price: 129,
    originalPrice: 159,
    currency: 'USD',
    category: 'Auto Insurance',
    featured: false,
    rating: 4.7,
    reviews: 156,
    agency: 'DriveGuard Insurance',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
    tags: ['Auto', 'Comprehensive', 'Roadside'],
    badge: 'Value',
    badgeColor: colors.success
  },
  {
    id: '4',
    name: 'Home & Property Protection',
    description: 'Complete home insurance with natural disaster coverage, personal property, and liability protection.',
    price: 219,
    originalPrice: 279,
    currency: 'USD',
    category: 'Home Insurance',
    featured: true,
    rating: 4.9,
    reviews: 203,
    agency: 'HomeGuard Insurance',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop',
    tags: ['Home', 'Property', 'Natural Disaster'],
    badge: 'Premium',
    badgeColor: colors.primary
  },
  {
    id: '5',
    name: 'Professional Liability Coverage',
    description: 'Specialized protection for professionals and consultants against claims and legal disputes.',
    price: 179,
    originalPrice: 229,
    currency: 'USD',
    category: 'Professional Insurance',
    featured: false,
    rating: 4.6,
    reviews: 87,
    agency: 'ProShield Insurance',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop',
    tags: ['Professional', 'Liability', 'Legal'],
    badge: 'Specialist',
    badgeColor: colors.secondary
  },
  {
    id: '6',
    name: 'Travel Insurance Deluxe',
    description: 'Comprehensive travel protection with medical, trip cancellation, and emergency evacuation coverage.',
    price: 89,
    originalPrice: 119,
    currency: 'USD',
    category: 'Travel Insurance',
    featured: false,
    rating: 4.5,
    reviews: 143,
    agency: 'GlobalTravel Insurance',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop',
    tags: ['Travel', 'Medical', 'Emergency'],
    badge: 'Adventure',
    badgeColor: colors.info
  },
];

const categories = [
  'All Categories',
  'Business Insurance',
  'Health Insurance', 
  'Auto Insurance',
  'Home Insurance',
  'Professional Insurance',
  'Travel Insurance'
];

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('featured');
  const [animatedCards, setAnimatedCards] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimatedCards(true), 500);
  }, []);

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.agency.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div>
      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .hero-animate {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .card-animate {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .card-animate-delay-1 { animation-delay: 0.1s; }
        .card-animate-delay-2 { animation-delay: 0.2s; }
        .card-animate-delay-3 { animation-delay: 0.3s; }
        .card-animate-delay-4 { animation-delay: 0.4s; }
        .card-animate-delay-5 { animation-delay: 0.5s; }
        .card-animate-delay-6 { animation-delay: 0.6s; }
        
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        
        .product-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .product-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(244,180,0,0.1), transparent);
          transition: left 0.6s;
        }
        
        .product-card:hover::before {
          left: 100%;
        }
        
        .product-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        
        .filter-btn {
          transition: all 0.3s ease;
        }
        
        .filter-btn.active {
          background: linear-gradient(135deg, ${colors.navy}, ${colors.gold});
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(13,27,42,0.3);
        }
      `}</style>

      <div style={{ backgroundColor: colors.gray[50], minHeight: '100vh', position: 'relative' }}>
        {/* Floating Background Elements */}
        <div style={{ position: 'absolute', top: '15%', right: '10%', opacity: 0.6, zIndex: 1 }}>
          <div className="floating-element" style={{ 
            width: '100px', 
            height: '100px', 
            background: `linear-gradient(135deg, ${colors.navy}15, ${colors.gold}15)`,
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />
        </div>

        {/* Enhanced Hero Section */}
        <div
          className="hero-animate"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, ${colors.navy} 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, ${colors.gold}20 0%, transparent 50%),
              linear-gradient(135deg, ${colors.navy} 0%, #1e3a8a 100%)
            `,
            color: 'white',
            padding: '80px 0 100px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div className="container position-relative" style={{ zIndex: 2 }}>
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div className="mb-4">
                  <span style={{
                    background: `linear-gradient(135deg, ${colors.gold}, #FFD700)`,
                    color: colors.navy,
                    padding: '8px 20px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(244,180,0,0.3)'
                  }}>
                    🛍️ Premium Insurance Marketplace
                  </span>
                </div>

                <h1 
                  className="display-3 fw-bold mb-4"
                  style={{
                    background: 'linear-gradient(135deg, white 0%, #f0f9ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Browse Premium Insurance Products
                </h1>
                <p className="lead mb-5" style={{ 
                  fontSize: '1.3rem',
                  opacity: 0.9,
                  maxWidth: '600px',
                  margin: '0 auto 2rem'
                }}>
                  Discover curated insurance solutions from trusted providers. 
                  Compare features, prices, and reviews to find your perfect coverage.
                </p>

                {/* Enhanced Search & Filter Section */}
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <div 
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      padding: '12px',
                      borderRadius: '20px',
                      marginBottom: '24px',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                      backdropFilter: 'blur(20px)'
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{ 
                          position: 'absolute', 
                          left: '20px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          color: colors.gray[400],
                          fontSize: '20px'
                        }}>🔍</span>
                        <input
                          type="text"
                          placeholder="Search insurance products, agencies, or categories..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{
                            border: 'none',
                            outline: 'none',
                            fontSize: '16px',
                            padding: '16px 20px 16px 55px',
                            borderRadius: '16px',
                            width: '100%',
                            backgroundColor: 'transparent',
                            color: colors.navy
                          }}
                        />
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{
                          border: 'none',
                          outline: 'none',
                          fontSize: '16px',
                          padding: '16px 20px',
                          borderRadius: '16px',
                          backgroundColor: 'transparent',
                          color: colors.navy,
                          minWidth: '180px'
                        }}
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container py-5">
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h2 style={{ color: colors.navy, fontWeight: 'bold' }}>
                  {filteredProducts.length} Products Found
                </h2>
                <div className="d-flex align-items-center gap-3">
                  <span style={{ color: colors.gray[600], fontSize: '14px' }}>Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      border: `2px solid ${colors.gray[200]}`,
                      borderRadius: '12px',
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      color: colors.navy,
                      fontWeight: 'medium'
                    }}
                  >
                    <option value="featured">Featured First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="row g-4">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className={`col-lg-6 col-xl-4 ${animatedCards ? `card-animate card-animate-delay-${(index % 6) + 1}` : ''}`}>
                <div className="product-card h-100">
                  <BrandCard
                    variant={product.featured ? "gold-outline" : "navy-outline"}
                    size="lg"
                    style={{
                      height: '100%',
                      border: `2px solid ${colors.gray[200]}`,
                      borderRadius: '20px',
                      position: 'relative',
                      background: 'white'
                    }}
                  >
                    {/* Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: product.badgeColor,
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        zIndex: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    >
                      {product.badge}
                    </div>

                    {/* Product Image */}
                    <div
                      style={{
                        height: '200px',
                        backgroundImage: `url(${product.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '16px',
                        marginBottom: '20px',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)'
                        }}
                      />
                    </div>

                    {/* Agency Info */}
                    <div className="mb-3">
                      <span style={{ 
                        fontSize: '12px', 
                        color: colors.gray[600],
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        by {product.agency}
                      </span>
                    </div>

                    {/* Product Title */}
                    <h3
                      style={{
                        fontSize: theme.typography.fontSize.xl,
                        fontWeight: theme.typography.fontWeight.bold,
                        color: theme.colors.text.primary,
                        marginBottom: theme.spacing[3],
                        lineHeight: theme.typography.lineHeight.tight,
                        minHeight: '60px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p style={{ 
                      color: colors.gray[700], 
                      lineHeight: '1.6',
                      marginBottom: '20px',
                      fontSize: '15px',
                      minHeight: '66px'
                    }}>
                      {product.description}
                    </p>

                    {/* Tags */}
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: `${colors.navy}10`,
                            color: colors.navy,
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 'medium'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="d-flex align-items-center mb-4">
                      <div className="d-flex align-items-center gap-1 me-2">
                        {[1,2,3,4,5].map(star => (
                          <span
                            key={star}
                            style={{
                              color: star <= Math.floor(product.rating) ? colors.gold : colors.gray[300],
                              fontSize: '14px'
                            }}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: colors.navy }}>
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    {/* Footer */}
                    <div style={{ 
                      marginTop: 'auto', 
                      paddingTop: '20px', 
                      borderTop: `1px solid ${colors.gray[200]}` 
                    }}>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <div style={{ fontSize: '14px', color: colors.gray[600], textDecoration: 'line-through' }}>
                            {formatPrice(product.originalPrice)}
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.navy }}>
                            {formatPrice(product.price)}
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <BrandButton variant="outline-navy" size="sm">
                            View Details
                          </BrandButton>
                          <BrandButton variant="gold" size="sm">
                            Add to Cart
                          </BrandButton>
                        </div>
                      </div>
                    </div>
                  </BrandCard>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div 
          style={{ 
            background: `linear-gradient(135deg, ${colors.navy} 0%, #1e3a8a 100%)`,
            color: 'white',
            padding: '80px 0',
            position: 'relative'
          }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🛡️</div>
                <h2 className="h3 fw-bold mb-3">
                  Need Help Choosing?
                </h2>
                <p className="mb-4" style={{ fontSize: '18px', opacity: 0.9 }}>
                  Our insurance experts can help you compare products and find the perfect coverage for your needs.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                  <BrandButton
                    variant="gold"
                    size="lg"
                    style={{ minWidth: '200px' }}
                  >
                    💬 Get Expert Advice
                  </BrandButton>
                  <BrandButton
                    variant="outline-navy"
                    size="lg"
                    style={{
                      minWidth: '200px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'white',
                      color: 'white'
                    }}
                  >
                    📞 Call Us Now
                  </BrandButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
