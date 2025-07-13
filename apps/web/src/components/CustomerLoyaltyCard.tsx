import React from 'react';
import TierBadge from './TierBadge';

const CustomerLoyaltyCard: React.FC<{
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
}> = ({ tier, points }) => (
  <div className="card shadow-sm">
    <div className="card-body d-flex align-items-center justify-content-between">
      <div>
        <h5 className="card-title mb-1">Loyalty Points</h5>
        <p className="mb-0 fw-bold fs-4">{points.toLocaleString()} pts</p>
      </div>
      <TierBadge tier={tier} className="fs-6" />
    </div>
  </div>
);

export default CustomerLoyaltyCard;
