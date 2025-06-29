import { colors } from "@mahardika/ui";
/**
 * Component Exports - Mahardika Platform
 * Centralized exports for all components
 * Brand Colors: Navy colors.navy, Gold colors.gold
 */

// Authentication Components
export { default as ForgotPasswordForm } from './auth/ForgotPasswordForm';
export { ForgotPasswordExample } from './auth/ForgotPasswordForm';

// Re-export any existing components
// Add other component exports here as they are created

// Export all components
export { default as AgencyGrid } from './AgencyGrid';
export { default as AuthForm } from './AuthForm';
export { default as BossUploadForm } from './BossUploadForm';
export { default as CheckoutWizard } from './CheckoutWizard';
export { default as ErrorPage } from './ErrorPage';
export { default as InsuranceDashboard } from './InsuranceDashboard';
export { default as ReviewReplyInterface } from './ReviewReplyInterface';
export { default as ShopPage } from './ShopPage';
export { default as StarRatingForm } from './StarRatingForm';

// New Mahardika Platform components
export { default as TokenUsageCard } from './TokenUsageCard';
export { default as AiMessageModal } from './AiMessageModal';
export { default as HeroImageUploadModal } from './HeroImageUploadModal';
export { Navigation } from './Navigation';
export { Footer } from './Footer';
