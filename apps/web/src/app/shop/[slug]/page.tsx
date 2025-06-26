import React from 'react';
import { notFound } from 'next/navigation';
import { BrandButton, BrandCard, colors } from '@mahardika/ui';
import {
  agencyService,
  mockAgencyData,
  mockReviewsData,
  isSupabaseConfigured,
  Agency,
  AgencyReview,
} from '../../../lib/supabase';
import ShopPage from '../../../components/ShopPage';

interface ShopSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Server component to fetch data
export default async function ShopSlugPage({ params }: ShopSlugPageProps) {
  // Await params to get the slug
  const { slug } = await params;

  let agency: Agency | null = null;
  let reviews: AgencyReview[] = [];

  try {
    if (isSupabaseConfigured()) {
      // Try to fetch from Supabase
      agency = await agencyService.getBySlug(slug);
      if (agency) {
        reviews = await agencyService.getReviews(agency.id);
      }
    } else if (slug === mockAgencyData.slug) {
      // Use mock data for development
      agency = mockAgencyData;
      reviews = mockReviewsData;
    }
  } catch (error) {
    console.error('Error fetching agency data:', error);
    // Fall back to mock data if Supabase fails
    if (slug === mockAgencyData.slug) {
      agency = mockAgencyData;
      reviews = mockReviewsData;
    }
  }

  // Return 404 if agency not found
  if (!agency) {
    notFound();
  }

  return <ShopPage agency={agency} reviews={reviews} />;
}
