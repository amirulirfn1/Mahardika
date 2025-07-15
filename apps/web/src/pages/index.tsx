import React, { useState, useEffect } from 'react';
import { BrandButton, BrandCard, colors, theme } from '@mah/ui';
import { HomeSkeleton } from '@/components/LoadingSkeleton';
import Image from 'next/image';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [heroAnimated, setHeroAnimated] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Trigger hero animation
      setTimeout(() => setHeroAnimated(true), 200);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <HomeSkeleton />;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-1/4 right-1/12 z-0">
        <div
          className="w-32 h-32 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${colors.gold}, transparent)`,
            animation: 'float 4s ease-in-out infinite',
          }}
        />
      </div>
      <div className="absolute bottom-1/4 left-1/12 z-0">
        <div
          className="w-20 h-20 rounded-full blur-2xl opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${colors.navy}, transparent)`,
            animation: 'float 4s ease-in-out infinite 2s',
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-gray-50 to-white min-h-screen flex items-center py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            <div
              className={`${heroAnimated ? 'animate-fade-in' : 'opacity-0'}`}
            >
              {/* Success Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-accent to-accent/80 text-primary text-sm font-semibold mb-8 shadow-lg">
                🚀 #1 Marketplace Platform
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-primary leading-tight mb-6">
                Find the perfect{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  freelance services
                </span>{' '}
                for your business
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-lg">
                Work with talented professionals from around the world. Join
                millions who trust Mahardika to bring their ideas to life.
              </p>

              {/* Enhanced Search Bar */}
              <form onSubmit={handleSearch} className="mb-8">
                <div
                  className={`bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-xl border transition-all duration-300 flex items-center gap-2 ${
                    isSearchFocused
                      ? 'shadow-2xl border-accent/50 ring-4 ring-accent/20'
                      : 'border-white/20 shadow-xl'
                  }`}
                >
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                      🔍
                    </span>
                    <input
                      type="text"
                      placeholder="Try 'logo design' or 'web development'"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full px-4 py-4 pl-12 rounded-xl border-none outline-none text-lg bg-transparent text-primary placeholder-gray-400"
                    />
                  </div>
                  <BrandButton
                    variant="navy"
                    size="lg"
                    type="submit"
                    className="px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    Search
                  </BrandButton>
                </div>
              </form>

              {/* Trending Tags */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-gray-500 text-sm font-medium">
                  Popular:
                </span>
                {[
                  { term: 'Website Design', icon: '🎨' },
                  { term: 'Mobile App', icon: '📱' },
                  { term: 'Logo Design', icon: '✨' },
                  { term: 'AI Services', icon: '🤖' },
                ].map(({ term, icon }) => (
                  <a
                    key={term}
                    href={`/shop?search=${encodeURIComponent(term)}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-600 text-sm font-medium hover:border-accent hover:bg-accent/10 transition-all duration-200 hover:-translate-y-1"
                  >
                    <span className="text-sm">{icon}</span>
                    {term}
                  </a>
                ))}
              </div>
            </div>

            <div
              className={`mt-12 lg:mt-0 ${heroAnimated ? 'animate-fade-in' : 'opacity-0'}`}
            >
              <div className="relative rounded-3xl overflow-hidden h-96 md:h-[500px] shadow-2xl">
                {/* Hero Image */}
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
                  alt="Professional collaboration"
                  fill
                  className="object-cover"
                  quality={90}
                  priority
                />

                {/* Floating Success Card */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary text-white flex items-center justify-center text-lg flex-shrink-0">
                      ⭐
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-primary mb-1">
                        Sarah Chen, CEO
                      </div>
                      <div className="text-gray-600 text-sm italic mb-2">
                        "Increased revenue by 200% with Mahardika"
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className="text-accent text-sm">
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          5.0 (150+ reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute top-8 right-8 bg-primary/90 backdrop-blur-sm text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-lg">
                  💼 1M+ Happy Clients
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Statistics */}
      <section
        className={`bg-gradient-to-br from-white to-gray-50 py-16 px-4 ${heroAnimated ? 'animate-fade-in' : 'opacity-0'}`}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-semibold text-gray-600 mb-12">
              Trusted by professionals worldwide
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '5M+', label: 'Active Users', icon: '👥' },
              { value: '2M+', label: 'Expert Freelancers', icon: '⭐' },
              { value: '15M+', label: 'Projects Completed', icon: '🚀' },
              { value: '99%', label: 'Success Rate', icon: '💯' },
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-white/20">
                  <div className="text-3xl mb-4 transform hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-24 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
              Popular Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover our most in-demand services from top-rated professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Logo & Brand Design',
                subtitle: 'Professional identity creation',
                image:
                  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
                gradient: 'from-primary/90 to-accent/90',
                icon: '🎨',
              },
              {
                title: 'Web Development',
                subtitle: 'Custom website solutions',
                image:
                  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
                gradient: 'from-blue-600/90 to-purple-600/90',
                icon: '💻',
              },
              {
                title: 'Mobile App Design',
                subtitle: 'iOS & Android interfaces',
                image:
                  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
                gradient: 'from-green-600/90 to-emerald-600/90',
                icon: '📱',
              },
              {
                title: 'Video Production',
                subtitle: 'Engaging video content',
                image:
                  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44b?w=400&h=300&fit=crop',
                gradient: 'from-orange-600/90 to-red-600/90',
                icon: '🎬',
              },
              {
                title: 'Digital Marketing',
                subtitle: 'Grow your online presence',
                image:
                  'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
                gradient: 'from-purple-600/90 to-pink-600/90',
                icon: '📊',
              },
              {
                title: 'Content Writing',
                subtitle: 'Compelling written content',
                image:
                  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
                gradient: 'from-indigo-600/90 to-blue-600/90',
                icon: '✍️',
              },
            ].map((service, index) => (
              <div key={service.title} className="group">
                <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-80`}
                    />
                    <div className="absolute top-4 left-4 text-3xl">
                      {service.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{service.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
