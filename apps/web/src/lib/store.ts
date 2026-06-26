import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChallengeSummary, ProofSummary, RewardPoolSummary, LeaderboardRow, UserProfile, NotificationSummary, ActivitySummary } from "./api";

// Initial Mock/Default Data to keep pages rich and lively on first load
const INITIAL_CHALLENGES: ChallengeSummary[] = [
  {
    _id: "challenge-1",
    creatorAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    title: "Complete 30 Days of DSA",
    description: "Write and commit one data structures and algorithms solution every single day on GitHub.",
    category: "Learning",
    stakeAmount: 100,
    durationDays: 30,
    verificationThreshold: 3,
    status: "active",
    proofCount: 2,
    approvedVotes: 2,
    rejectedVotes: 0,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "challenge-2",
    creatorAddress: "GBV3L2U4N2J6L6K77XW2L...MOCKED",
    title: "Run 50 Kilometers in 2 Weeks",
    description: "Submit Strava screenshots showing running workouts totaling at least 50km.",
    category: "Fitness",
    stakeAmount: 150,
    durationDays: 14,
    verificationThreshold: 3,
    status: "proof_submitted",
    proofCount: 1,
    approvedVotes: 1,
    rejectedVotes: 0,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "challenge-3",
    creatorAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    title: "100 Hours of Rust Programming",
    description: "Learn Rust syntax, build a CLI project, and deploy a Soroban smart contract.",
    category: "Development",
    stakeAmount: 250,
    durationDays: 45,
    verificationThreshold: 3,
    status: "completed",
    proofCount: 3,
    approvedVotes: 3,
    rejectedVotes: 0,
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_PROOFS: ProofSummary[] = [
  {
    _id: "proof-1",
    challengeId: "challenge-1",
    submitterAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    title: "Day 1: Reverse Linked List Completed",
    description: "Implemented standard iterative reversal of singly linked list with O(N) time and O(1) space complexity.",
    githubLink: "https://github.com/stellar/soroban",
    externalUrl: "https://stellar.org",
    textEvidence: "Pushed to github main branch. Verified with Leetcode local runtime.",
    status: "approved",
    voteCount: 3,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: "proof-2",
    challengeId: "challenge-2",
    submitterAddress: "GBV3L2U4N2J6L6K77XW2L...MOCKED",
    title: "Final 12km Workout Completed",
    description: "Finished my run in 56 minutes, bringing total distance for the challenge to 51.5km.",
    githubLink: "",
    externalUrl: "https://strava.com",
    textEvidence: "Workout ID: 9812739281. Checked and public.",
    status: "pending",
    voteCount: 1,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_REWARD_POOL: RewardPoolSummary = {
  currentBalance: 750,
  historicalDistributions: [
    { amount: 100, reason: "Validator Reward Distribution - Epoch 1", distributedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { amount: 200, reason: "Developer Accountability Kickback", distributedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() }
  ],
  topContributors: [
    { walletAddress: "GBRSTF728X...CONTRIB1", amount: 350 },
    { walletAddress: "GBV3L2U4N2J...CONTRIB2", amount: 200 }
  ],
  topEarners: [
    { walletAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN", amount: 150 },
    { walletAddress: "GBCX728HJS...EARNER2", amount: 100 }
  ]
};

const INITIAL_LEADERBOARD: LeaderboardRow[] = [
  {
    walletAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    displayName: "Stellar Stake Master",
    xp: 3480,
    successRate: 94.2,
    totalXlmStaked: 1250,
    rank: 1
  },
  {
    walletAddress: "GBRSTF728X...CONTRIB1",
    displayName: "Accountability Guru",
    xp: 2850,
    successRate: 88.0,
    totalXlmStaked: 900,
    rank: 2
  },
  {
    walletAddress: "GBV3L2U4N2J...CONTRIB2",
    displayName: "Vetted Validator",
    xp: 1920,
    successRate: 91.5,
    totalXlmStaked: 750,
    rank: 3
  }
];

const INITIAL_NOTIFICATIONS: NotificationSummary[] = [
  {
    _id: "notif-1",
    title: "Challenge Created Successfully",
    body: "Your stake of 100 XLM is locked in the Soroban escrow. Good luck!",
    kind: "challenge_created",
    createdAt: new Date().toISOString()
  },
  {
    _id: "notif-2",
    title: "Proof Approved",
    body: "Your submitted proof for 100 Hours of Rust was approved by the community. Stake returned + XP awarded!",
    kind: "proof_approved",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

const INITIAL_ACTIVITIES: ActivitySummary[] = [
  {
    _id: "act-1",
    kind: "challenge_created",
    actorAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    message: "Stellar Stake Master created challenge: 'Complete 30 Days of DSA' with 100 XLM staked.",
    createdAt: new Date().toISOString()
  },
  {
    _id: "act-2",
    kind: "proof_submitted",
    actorAddress: "GAKAKTP2BNVJPMGMGB2Y63VG65QCXSF4B5AX54SY45MEHYEQT526XFTN",
    message: "Stellar Stake Master submitted a verification proof for 'Complete 30 Days of DSA'.",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  }
];

interface DappStore {
  // Challenge State
  challenges: ChallengeSummary[];
  proofs: ProofSummary[];
  rewardPool: RewardPoolSummary;
  leaderboard: LeaderboardRow[];
  notifications: NotificationSummary[];
  activities: ActivitySummary[];
  
  // UI State
  themeMode: "light" | "dark" | "auto";
  sidebarOpen: boolean;
  
  // Actions
  addChallenge: (challenge: Omit<ChallengeSummary, "_id" | "createdAt" | "proofCount" | "approvedVotes" | "rejectedVotes" | "status">) => ChallengeSummary;
  addProof: (proof: Omit<ProofSummary, "_id" | "createdAt" | "status" | "voteCount">) => ProofSummary;
  castVote: (proofId: string, voterAddress: string, decision: "approve" | "reject") => void;
  addNotification: (title: string, body: string, kind: string) => void;
  addActivity: (kind: string, actorAddress: string, message: string) => void;
  updateRewardPoolBalance: (balance: number) => void;
  setThemeMode: (mode: "light" | "dark" | "auto") => void;
  setSidebarOpen: (open: boolean) => void;
  
  // User profiles
  getProfile: (address: string) => { user: UserProfile; challenges: ChallengeSummary[]; achievements: any[]; proofs: ProofSummary[] };
}

export const useDappStore = create<DappStore>()(
  persist(
    (set, get) => ({
      challenges: INITIAL_CHALLENGES,
      proofs: INITIAL_PROOFS,
      rewardPool: INITIAL_REWARD_POOL,
      leaderboard: INITIAL_LEADERBOARD,
      notifications: INITIAL_NOTIFICATIONS,
      activities: INITIAL_ACTIVITIES,
      themeMode: "dark",
      sidebarOpen: false,
      
      addChallenge: (newChallenge) => {
        const id = "challenge-" + Math.random().toString(36).substring(2, 9);
        const challenge: ChallengeSummary = {
          ...newChallenge,
          _id: id,
          status: "active",
          proofCount: 0,
          approvedVotes: 0,
          rejectedVotes: 0,
          createdAt: new Date().toISOString()
        };
        
        set((state) => {
          const updatedChallenges = [challenge, ...state.challenges];
          
          // Add to activity stream
          const activity: ActivitySummary = {
            _id: "act-" + Math.random().toString(36).substring(2, 9),
            kind: "challenge_created",
            actorAddress: newChallenge.creatorAddress,
            message: `${newChallenge.creatorAddress.slice(0, 6)}... created a new challenge: '${newChallenge.title}' with ${newChallenge.stakeAmount} XLM staked.`,
            createdAt: new Date().toISOString()
          };
          
          // Invalidate leaderboard staked amount
          const updatedLeaderboard = state.leaderboard.map((row) => {
            if (row.walletAddress === newChallenge.creatorAddress) {
              return {
                ...row,
                totalXlmStaked: row.totalXlmStaked + newChallenge.stakeAmount
              };
            }
            return row;
          });
          
          return {
            challenges: updatedChallenges,
            activities: [activity, ...state.activities],
            leaderboard: updatedLeaderboard
          };
        });
        
        return challenge;
      },
      
      addProof: (newProof) => {
        const id = "proof-" + Math.random().toString(36).substring(2, 9);
        const proof: ProofSummary = {
          ...newProof,
          _id: id,
          status: "pending",
          voteCount: 0,
          createdAt: new Date().toISOString()
        };
        
        set((state) => {
          const updatedProofs = [proof, ...state.proofs];
          const updatedChallenges = state.challenges.map((c) => {
            if (c._id === newProof.challengeId) {
              return {
                ...c,
                proofCount: c.proofCount + 1,
                status: "proof_submitted" as const
              };
            }
            return c;
          });
          
          const activity: ActivitySummary = {
            _id: "act-" + Math.random().toString(36).substring(2, 9),
            kind: "proof_submitted",
            actorAddress: newProof.submitterAddress,
            message: `${newProof.submitterAddress.slice(0, 6)}... submitted a proof: '${newProof.title}'.`,
            createdAt: new Date().toISOString()
          };
          
          return {
            proofs: updatedProofs,
            challenges: updatedChallenges,
            activities: [activity, ...state.activities]
          };
        });
        
        return proof;
      },
      
      castVote: (proofId, voterAddress, decision) => {
        set((state) => {
          const proofIndex = state.proofs.findIndex((p) => p._id === proofId);
          if (proofIndex === -1) return {};
          
          const proof = { ...state.proofs[proofIndex] } as ProofSummary;
          if (proof.status !== "pending") return {}; // Vote closed
          
          const challengeIndex = state.challenges.findIndex((c) => c._id === proof.challengeId);
          if (challengeIndex === -1) return {};
          
          const challenge = { ...state.challenges[challengeIndex] } as ChallengeSummary;
          
          // Register the vote
          proof.voteCount += 1;
          
          let approvedVotes = challenge.approvedVotes;
          let rejectedVotes = challenge.rejectedVotes;
          
          if (decision === "approve") {
            approvedVotes += 1;
          } else {
            rejectedVotes += 1;
          }
          
          // Check resolution threshold
          let newChallengeStatus = challenge.status;
          let newProofStatus: "pending" | "approved" | "rejected" = proof.status;
          let poolBalanceDelta = 0;
          
          if (approvedVotes >= challenge.verificationThreshold) {
            newProofStatus = "approved" as const;
            newChallengeStatus = "completed" as const;
          } else if (rejectedVotes >= challenge.verificationThreshold) {
            newProofStatus = "rejected" as const;
            newChallengeStatus = "failed" as const;
            poolBalanceDelta = challenge.stakeAmount;
          }
          
          const updatedProofs = state.proofs.map((p) => (p._id === proofId ? { ...proof, status: newProofStatus } : p)) as ProofSummary[];
          const updatedChallenges = state.challenges.map((c) =>
            c._id === challenge._id
              ? {
                  ...c,
                  approvedVotes,
                  rejectedVotes,
                  status: newChallengeStatus
                }
              : c
          ) as ChallengeSummary[];
          
          // Add to activity stream
          const activity: ActivitySummary = {
            _id: "act-" + Math.random().toString(36).substring(2, 9),
            kind: decision === "approve" ? "proof_approved" : "proof_rejected",
            actorAddress: voterAddress,
            message: `${voterAddress.slice(0, 6)}... voted to ${decision} proof '${proof.title}'.`,
            createdAt: new Date().toISOString()
          };
          
          // Update Reward Pool Balance if challenge failed
          const updatedRewardPool = {
            ...state.rewardPool,
            currentBalance: state.rewardPool.currentBalance + poolBalanceDelta,
            historicalDistributions: poolBalanceDelta > 0 
              ? [
                  {
                    amount: poolBalanceDelta,
                    reason: `Failed challenge stake collection from '${challenge.title}'`,
                    distributedAt: new Date().toISOString()
                  },
                  ...state.rewardPool.historicalDistributions
                ]
              : state.rewardPool.historicalDistributions
          };
          
          // Award XP to voter
          const xpGained = decision === "approve" ? 25 : 15;
          const updatedLeaderboard = state.leaderboard.map((row) => {
            if (row.walletAddress === voterAddress) {
              return { ...row, xp: row.xp + xpGained };
            }
            return row;
          });
          
          return {
            proofs: updatedProofs,
            challenges: updatedChallenges,
            activities: [activity, ...state.activities],
            rewardPool: updatedRewardPool,
            leaderboard: updatedLeaderboard
          };
        });
      },
      
      addNotification: (title, body, kind) => {
        set((state) => ({
          notifications: [
            {
              _id: "notif-" + Math.random().toString(36).substring(2, 9),
              title,
              body,
              kind,
              createdAt: new Date().toISOString()
            },
            ...state.notifications
          ]
        }));
      },
      
      addActivity: (kind, actorAddress, message) => {
        set((state) => ({
          activities: [
            {
              _id: "act-" + Math.random().toString(36).substring(2, 9),
              kind,
              actorAddress,
              message,
              createdAt: new Date().toISOString()
            },
            ...state.activities
          ]
        }));
      },
      
      updateRewardPoolBalance: (balance) => {
        set((state) => ({
          rewardPool: {
            ...state.rewardPool,
            currentBalance: balance
          }
        }));
      },
      
      setThemeMode: (mode) => set({ themeMode: mode }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      getProfile: (address) => {
        const state = get();
        const userChallenges = state.challenges.filter((c) => c.creatorAddress === address);
        const userProofs = state.proofs.filter((p) => p.submitterAddress === address);
        
        // Find or create profile in leaderboard list
        let leaderboardUser = state.leaderboard.find((row) => row.walletAddress === address);
        if (!leaderboardUser) {
          leaderboardUser = {
            walletAddress: address,
            displayName: "Stellar Staker",
            xp: 50,
            successRate: 100,
            totalXlmStaked: 0,
            rank: state.leaderboard.length + 1
          };
        }
        
        const profileUser: UserProfile = {
          walletAddress: address,
          displayName: leaderboardUser.displayName,
          bio: "Stellar accountability participant.",
          avatarUrl: "",
          xp: leaderboardUser.xp,
          level: leaderboardUser.xp > 3000 ? "Diamond" : leaderboardUser.xp > 1500 ? "Platinum" : "Bronze",
          totalXlmStaked: leaderboardUser.totalXlmStaked,
          successRate: leaderboardUser.successRate,
          streakDays: 3
        };
        
        const achievements = [
          { code: "first-step", title: "First Commitment", description: "Created your first accountability challenge.", xpReward: 100 },
          ...(leaderboardUser.xp > 1000 ? [{ code: "validator-medal", title: "Diligent Validator", description: "Participated in 5 or more community verifications.", xpReward: 250 }] : [])
        ];
        
        return {
          user: profileUser,
          challenges: userChallenges,
          achievements,
          proofs: userProofs
        };
      }
    }),
    {
      name: "skillstake_dapp_storage"
    }
  )
);
