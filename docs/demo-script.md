# SkillStake: Guided Video Demonstration Script

> **Purpose:** Script for the official Stellar Level 5 submission video walk-through, showcasing the production dApp features, onboarding, smart contract escrows, and reputation layers.

---

## Part 1: Introduction & Onboarding Wizard (0:00 - 0:45)
* **Visual:** Browser showing the home screen with the SkillStake branding and logo. The **Quick Start** wizard modal is open on first load.
* **Audio/Narrative:** 
  > "Welcome to SkillStake, the decentralized accountability and milestone escrow protocol built on the Stellar network. When a new user enters the platform, they are greeted by our interactive Quick Start guide. This wizard simplifies the Web3 onboarding flow into five clear steps: connecting a wallet, choosing a challenge template, locking XLM, uploading daily progress proof, and collecting rewards. Let's close the wizard and connect our wallet."

---

## Part 2: Wallet Connection (0:45 - 1:15)
* **Visual:** Click on **Connect Wallet** in the top header or sidebar. The user connects their Freighter wallet. The address and simulated balance update in real time.
* **Audio/Narrative:**
  > "We navigate to the Wallet Settings and connect our Freighter extension. The dApp securely queries our active keys and displays our XLM balance directly on the sidebar. Our dashboard metrics now reflect our real-time level and XP, displaying a starting Level of Bronze."

---

## Part 3: Selecting a Challenge Template (1:15 - 2:00)
* **Visual:** Navigating to the **Create Challenge** page. The user hovers over the 5 onboarding templates: Data Structures & Algorithms, Gym Consistency, Clean Coding, 30-Min Reading, and Board Exam Prep. They click on **Clean Coding**.
* **Audio/Narrative:**
  > "To help users set up stakes instantly, we implement rapid-onboarding templates. Here, we see five pre-configured templates for DSA, Gym workouts, Coding habits, Reading, and Exams. Let's click on the 'Clean Coding' template. The stake amount of 50 XLM, duration of 30 days, and description are automatically pre-filled, saving time and ensuring a frictionless onboarding journey."

---

## Part 4: Escrow Staking Workflow (2:00 - 2:45)
* **Visual:** Click on **Deploy Escrow & Stake**. A spinner appears, demonstrating the Soroban contract invocation. The user approves the transaction. A success dialog displays the simulated Soroban contract address.
* **Audio/Narrative:**
  > "Now, we deploy the challenge to the Stellar Testnet. By clicking 'Deploy Escrow', the dApp makes a direct call to the Soroban smart contract, locking our 50 XLM collateral in escrow. The transaction resolves in seconds, and we receive our unique contract transaction hash. Our collateral is now cryptographically locked under protocol custody."

---

## Part 5: Challenge Progress & Evidence Submission (2:45 - 3:30)
* **Visual:** Navigate to the **Challenge Details** page for the newly created challenge. The page displays:
  - Day 1 / 30 Timeline Progress Bar
  - 3% Complete
  - 29 days remaining
  The user fills in the **Submit Progress Proof** form with a GitHub commit link and click **Submit Proof**.
* **Audio/Narrative:**
  > "Here is our active challenge tracking page. We see the newly implemented timeline tracking system, displaying our current day, completion percentage, progress bar, and days remaining. To prove our progress, we fill in our daily evidence form, linking our GitHub commit, and click 'Submit Proof'. This records our progress signal on-chain."

---

## Part 6: Community Voting & Feedback Loop (3:30 - 4:15)
* **Visual:** Navigate to the **User Validation** page. We see a list of community validation requests. The user clicks on one, looks at the evidence, and casts an **Approve** vote. Confetti triggers as the vote threshold resolves, and XP gains are displayed.
* **Audio/Narrative:**
  > "Other stakers in the community inspect our evidence on the User Validation page. We see a log table of active validations. Let's inspect a peer's proof and vote to approve it. Casting a vote simulated signature updates their challenge status, triggers a celebratory confetti effect, and awards us 25 XP! The voter and staker's reputation score and global ranking update immediately."

---

## Part 7: Conclusion & Vercel Verification (4:15 - 5:00)
* **Visual:** Open the **Profile** page showing the 7 unlocked achievements and the **Share & Invite** modal. The QR code and invite link copy actions are demonstrated.
* **Audio/Narrative:**
  > "Finally, we visit our Profile to review our reputation. We can see our newly implemented achievement badges, success rate, and global leaderboard rank. We can open the share drawer to generate a custom QR code or invite link to share on WhatsApp or Telegram. The production dApp is live, fully audited, and optimized for Stellar Level 5 compliance. Thank you for watching!"
