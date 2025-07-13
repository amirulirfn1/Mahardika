import React from 'react';
import { GetServerSideProps } from 'next';
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
  agency: Agency | null;
  reviews: AgencyReview[];
}

export default function ShopSlugPage({ agency, reviews }: ShopSlugPageProps) {
  // Return 404 if agency not found
  if (!agency) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h1>404 - Agency Not Found</h1>
          <p>The agency you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <ShopPage agency={agency} reviews={reviews} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  
  let agency: Agency | null = null;
  let reviews: AgencyReview[] = [];

  try {
    if (isSupabaseConfigured()) {
      // Try to fetch from Supabase
      agency = await agencyService.getBySlug(slug as string);
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
    return {
      notFound: true,
    };
  }

  return {
    props: {
      agency,
      reviews,
    },
  };
};
