import React from 'react';

export type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

const tierColors: Record<Tier, { bg: string; text: string }> = {
  bronze: { bg: '#cd7f32', text: '#fff' },
  silver: { bg: '#c0c0c0', text: '#000' },
  gold: { bg: '#ffd700', text: '#000' },
  platinum: { bg: '#e5e4e2', text: '#000' },
};

const TierBadge: React.FC<{ tier: Tier; className?: string }> = ({
  tier,
  className = '',
}) => {
  const { bg, text } = tierColors[tier];
  return (
    <span
      className={`badge rounded-pill ${className}`}
      style={{ backgroundColor: bg, color: text }}
    >
      {tier.toUpperCase()}
    </span>
  );
};

export default TierBadge;
