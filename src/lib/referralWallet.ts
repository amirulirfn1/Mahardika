import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface WalletTransaction {
  type: 'earn' | 'withdraw' | 'bonus';
  amount: number;
  description?: string;
  referredAgencyId?: string;
  orderId?: string;
  metadata?: any;
}

interface WalletBalance {
  balance: number;
  pendingBalance: number;
  lifetimeEarned: number;
  totalReferrals: number;
  successfulReferrals: number;
}

export class ReferralWalletService {
  /**
   * Get or create a referral wallet for an agency
   */
  async getOrCreateWallet(agencyId: string): Promise<WalletBalance> {
    try {
      let wallet = await prisma.referralWallet.findUnique({
        where: { agency_id: agencyId },
      });

      if (!wallet) {
        wallet = await prisma.referralWallet.create({
          data: {
            agency_id: agencyId,
            balance: 0,
            pending_balance: 0,
            lifetime_earned: 0,
            total_referrals: 0,
            successful_referrals: 0,
          },
        });
      }

      return {
        balance: Number(wallet.balance),
        pendingBalance: Number(wallet.pending_balance),
        lifetimeEarned: Number(wallet.lifetime_earned),
        totalReferrals: wallet.total_referrals,
        successfulReferrals: wallet.successful_referrals,
      };
    } catch (error) {
      console.error('Error getting/creating wallet:', error);
      throw new Error('Failed to access referral wallet');
    }
  }

  /**
   * Add earnings to wallet (e.g., when a referral completes a purchase)
   */
  async addEarnings(
    agencyId: string,
    transaction: WalletTransaction
  ): Promise<WalletBalance> {
    try {
      return await prisma.$transaction(async prisma => {
        // Get current wallet
        const wallet = await prisma.referralWallet.findUnique({
          where: { agency_id: agencyId },
        });

        if (!wallet) {
          throw new Error('Wallet not found');
        }

        // Calculate new balances
        const newBalance = Number(wallet.balance) + transaction.amount;
        const newLifetimeEarned =
          Number(wallet.lifetime_earned) + transaction.amount;
        const newSuccessfulReferrals =
          transaction.type === 'earn'
            ? wallet.successful_referrals + 1
            : wallet.successful_referrals;

        // Update wallet
        const updatedWallet = await prisma.referralWallet.update({
          where: { agency_id: agencyId },
          data: {
            balance: newBalance,
            lifetime_earned: newLifetimeEarned,
            successful_referrals: newSuccessfulReferrals,
          },
        });

        // Create transaction record
        await prisma.referralTransaction.create({
          data: {
            wallet_id: wallet.id,
            agency_id: agencyId,
            type: transaction.type,
            amount: transaction.amount,
            status: 'completed',
            description:
              transaction.description || `${transaction.type} transaction`,
            referred_agency_id: transaction.referredAgencyId,
            order_id: transaction.orderId,
            metadata: transaction.metadata || {},
          },
        });

        return {
          balance: Number(updatedWallet.balance),
          pendingBalance: Number(updatedWallet.pending_balance),
          lifetimeEarned: Number(updatedWallet.lifetime_earned),
          totalReferrals: updatedWallet.total_referrals,
          successfulReferrals: updatedWallet.successful_referrals,
        };
      });
    } catch (error) {
      console.error('Error adding earnings:', error);
      throw new Error('Failed to add earnings to wallet');
    }
  }

  /**
   * Process a withdrawal from the wallet
   */
  async processWithdrawal(
    agencyId: string,
    amount: number,
    description?: string
  ): Promise<WalletBalance> {
    try {
      return await prisma.$transaction(async prisma => {
        const wallet = await prisma.referralWallet.findUnique({
          where: { agency_id: agencyId },
        });

        if (!wallet) {
          throw new Error('Wallet not found');
        }

        const currentBalance = Number(wallet.balance);

        if (currentBalance < amount) {
          throw new Error('Insufficient balance for withdrawal');
        }

        const newBalance = currentBalance - amount;

        // Update wallet
        const updatedWallet = await prisma.referralWallet.update({
          where: { agency_id: agencyId },
          data: {
            balance: newBalance,
          },
        });

        // Create withdrawal transaction
        await prisma.referralTransaction.create({
          data: {
            wallet_id: wallet.id,
            agency_id: agencyId,
            type: 'withdraw',
            amount: -amount, // Negative for withdrawal
            status: 'completed',
            description: description || 'Wallet withdrawal',
            metadata: {
              withdrawalDate: new Date().toISOString(),
              previousBalance: currentBalance,
              newBalance,
            },
          },
        });

        return {
          balance: Number(updatedWallet.balance),
          pendingBalance: Number(updatedWallet.pending_balance),
          lifetimeEarned: Number(updatedWallet.lifetime_earned),
          totalReferrals: updatedWallet.total_referrals,
          successfulReferrals: updatedWallet.successful_referrals,
        };
      });
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      throw error;
    }
  }

  /**
   * Add a referral (when someone uses a referral link)
   */
  async addReferral(
    referrerAgencyId: string,
    referredAgencyId: string,
    metadata?: any
  ): Promise<void> {
    try {
      await prisma.referralWallet.update({
        where: { agency_id: referrerAgencyId },
        data: {
          total_referrals: {
            increment: 1,
          },
        },
      });

      // You might want to create a separate referrals table to track this
      // For now, we'll add it to metadata of a transaction
      const wallet = await prisma.referralWallet.findUnique({
        where: { agency_id: referrerAgencyId },
      });

      if (wallet) {
        await prisma.referralTransaction.create({
          data: {
            wallet_id: wallet.id,
            agency_id: referrerAgencyId,
            type: 'earn',
            amount: 0, // No immediate earning, just tracking
            status: 'pending',
            description: 'New referral registered',
            referred_agency_id: referredAgencyId,
            metadata: {
              referralDate: new Date().toISOString(),
              status: 'pending',
              ...metadata,
            },
          },
        });
      }
    } catch (error) {
      console.error('Error adding referral:', error);
      throw new Error('Failed to add referral');
    }
  }

  /**
   * Calculate referral commission based on order amount
   */
  calculateCommission(
    orderAmount: number,
    commissionRate: number = 0.05
  ): number {
    return Math.round(orderAmount * commissionRate * 100) / 100; // 5% default, rounded to 2 decimals
  }

  /**
   * Process referral earning when referred agency makes a purchase
   */
  async processReferralEarning(
    referrerAgencyId: string,
    referredAgencyId: string,
    orderId: string,
    orderAmount: number,
    commissionRate?: number
  ): Promise<WalletBalance> {
    try {
      const commission = this.calculateCommission(orderAmount, commissionRate);

      return await this.addEarnings(referrerAgencyId, {
        type: 'earn',
        amount: commission,
        description: `Referral commission from order ${orderId}`,
        referredAgencyId,
        orderId,
        metadata: {
          orderAmount,
          commissionRate: commissionRate || 0.05,
          calculatedCommission: commission,
        },
      });
    } catch (error) {
      console.error('Error processing referral earning:', error);
      throw new Error('Failed to process referral earning');
    }
  }

  /**
   * Get wallet transaction history
   */
  async getTransactionHistory(
    agencyId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    try {
      const wallet = await prisma.referralWallet.findUnique({
        where: { agency_id: agencyId },
      });

      if (!wallet) {
        return [];
      }

      const transactions = await prisma.referralTransaction.findMany({
        where: { wallet_id: wallet.id },
        orderBy: { created_at: 'desc' },
        take: limit,
        skip: offset,
        include: {
          agency: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      });

      return transactions.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: Number(tx.amount),
        status: tx.status,
        description: tx.description,
        referredAgencyId: tx.referred_agency_id,
        orderId: tx.order_id,
        metadata: tx.metadata,
        createdAt: tx.created_at,
        agency: tx.agency,
      }));
    } catch (error) {
      console.error('Error getting transaction history:', error);
      throw new Error('Failed to get transaction history');
    }
  }

  /**
   * Get referral statistics for an agency
   */
  async getReferralStats(agencyId: string): Promise<any> {
    try {
      const wallet = await this.getOrCreateWallet(agencyId);

      const recentTransactions = await this.getTransactionHistory(agencyId, 10);

      const monthlyStats = await prisma.referralTransaction.groupBy({
        by: ['created_at'],
        where: {
          agency_id: agencyId,
          type: 'earn',
          created_at: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: {
          amount: true,
        },
        _count: {
          id: true,
        },
      });

      const monthlyEarnings = monthlyStats.reduce(
        (sum, stat) => sum + Number(stat._sum.amount || 0),
        0
      );

      return {
        wallet,
        monthlyEarnings,
        recentTransactions,
        stats: {
          totalEarningsThisMonth: monthlyEarnings,
          totalTransactionsThisMonth: monthlyStats.length,
          averageCommissionPerReferral:
            wallet.successfulReferrals > 0
              ? wallet.lifetimeEarned / wallet.successfulReferrals
              : 0,
          conversionRate:
            wallet.totalReferrals > 0
              ? (wallet.successfulReferrals / wallet.totalReferrals) * 100
              : 0,
        },
      };
    } catch (error) {
      console.error('Error getting referral stats:', error);
      throw new Error('Failed to get referral statistics');
    }
  }
}

// Export singleton instance
export const referralWallet = new ReferralWalletService();

// Export utility functions
export async function createReferralWallet(
  agencyId: string
): Promise<WalletBalance> {
  return referralWallet.getOrCreateWallet(agencyId);
}

export async function processReferral(
  referrerAgencyId: string,
  referredAgencyId: string,
  orderAmount: number,
  orderId: string
): Promise<WalletBalance> {
  return referralWallet.processReferralEarning(
    referrerAgencyId,
    referredAgencyId,
    orderId,
    orderAmount
  );
}

export async function withdrawFromWallet(
  agencyId: string,
  amount: number,
  description?: string
): Promise<WalletBalance> {
  return referralWallet.processWithdrawal(agencyId, amount, description);
}

export async function getReferralDashboard(agencyId: string): Promise<any> {
  return referralWallet.getReferralStats(agencyId);
}
