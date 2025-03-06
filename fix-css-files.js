// fix-css-files.js
const fs = require('fs');
const path = require('path');

// Helper function to log with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

// Main function to fix CSS files
function fixCssFiles() {
  try {
    log('Starting CSS files fix...');

    // Create directories if they don't exist
    const dirs = ['src/pages', 'src/components'];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log(`Created directory: ${dir}`);
      }
    }

    // Fix ProjectsPage.css
    log('Creating ProjectsPage.css...');
    const projectsPageCssContent = `.projects-page {
  min-height: calc(100vh - 70px - 200px);
}

.page-header {
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-dark) 100%);
  padding: 60px 0;
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--text-muted);
  max-width: 800px;
  margin: 0 auto;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.project-card {
  background-color: var(--background-card);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.project-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.project-content {
  padding: 20px;
}

.project-title {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.project-director {
  color: var(--text-muted);
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.project-description {
  color: var(--text-light);
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.project-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-status {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-funding {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1976d2;
}

.status-production {
  background-color: rgba(246, 133, 27, 0.1);
  color: #f6851b;
}

.status-completed {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

@media (max-width: 768px) {
  .page-header {
    padding: 40px 0;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
}`;

    fs.writeFileSync('src/pages/ProjectsPage.css', projectsPageCssContent);
    log('Created ProjectsPage.css');

    // Fix HomePage.css
    log('Creating HomePage.css...');
    const homePageCssContent = `.hero-section {
  padding: 80px 0;
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-dark) 100%);
  text-align: center;
}

.hero-section h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #f6851b, #e2761b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  max-width: 700px;
  margin: 0 auto 2rem;
  color: var(--text-light);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.wallet-section {
  padding: 60px 0;
  background-color: var(--background-dark);
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-light);
}

.section-header p {
  max-width: 700px;
  margin: 0 auto;
  color: var(--text-muted);
}

.wallet-container {
  display: flex;
  justify-content: center;
}

.features-section {
  padding: 80px 0;
  background-color: var(--background-light);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.feature-card {
  background-color: var(--background-card);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  font-size: 2.5rem;
  color: #f6851b;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 15px;
  color: var(--text-light);
}

.feature-card p {
  color: var(--text-muted);
}

.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #f6851b 0%, #e2761b 100%);
  text-align: center;
  color: white;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cta-section p {
  max-width: 700px;
  margin: 0 auto 2rem;
  font-size: 1.1rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-section .btn-primary {
  background-color: white;
  color: #f6851b;
}

.cta-section .btn-primary:hover {
  background-color: rgba(255, 255, 255, 0.9);
}

.cta-section .btn-secondary {
  border-color: white;
  color: white;
}

.cta-section .btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.placeholder-section {
  padding: 40px;
  margin: 40px 0;
  background-color: var(--background-light);
  border-radius: var(--border-radius-md);
  text-align: center;
}

.placeholder-section h2 {
  font-size: 1.75rem;
  margin-bottom: 15px;
  color: var(--text-light);
}

.placeholder-section p {
  color: var(--text-muted);
  margin-bottom: 15px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0;
  }
  
  .hero-section h1 {
    font-size: 2.25rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .section-header h2 {
    font-size: 1.75rem;
  }
  
  .feature-card {
    padding: 20px;
  }
  
  .cta-section h2 {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 40px 0;
  }
  
  .hero-section h1 {
    font-size: 1.75rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}`;

    fs.writeFileSync('src/pages/HomePage.css', homePageCssContent);
    log('Created HomePage.css');

    // Fix MarketplacePage.css
    log('Creating MarketplacePage.css...');
    const marketplacePageCssContent = `.marketplace-page {
  min-height: calc(100vh - 70px - 200px);
}

.nft-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.nft-card {
  background-color: var(--background-card);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.nft-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.nft-image {
  width: 100%;
  height: 280px;
  object-fit: cover;
}

.nft-content {
  padding: 20px;
}

.nft-title {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.nft-film {
  color: var(--text-muted);
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.nft-description {
  color: var(--text-light);
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.nft-price {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.price-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-right: 5px;
}

.price-currency {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.nft-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nft-creator {
  display: flex;
  align-items: center;
}

.creator-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.creator-name {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.nft-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.nft-button:hover {
  background-color: var(--primary-hover);
}

.marketplace-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
}

.filter-button {
  background-color: var(--background-card);
  color: var(--text-light);
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-button.active {
  background-color: var(--primary-color);
  color: white;
}

.filter-button:hover:not(.active) {
  background-color: rgba(246, 133, 27, 0.1);
}

@media (max-width: 768px) {
  .nft-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 480px) {
  .nft-grid {
    grid-template-columns: 1fr;
  }
  
  .marketplace-filters {
    flex-direction: column;
    gap: 10px;
  }
}`;

    fs.writeFileSync('src/pages/MarketplacePage.css', marketplacePageCssContent);
    log('Created MarketplacePage.css');

    // Fix GovernancePage.css
    log('Creating GovernancePage.css...');
    const governancePageCssContent = `.governance-page {
  min-height: calc(100vh - 70px - 200px);
}

.governance-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background-color: var(--background-card);
  color: var(--text-light);
  border: none;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-normal);
  white-space: nowrap;
}

.tab-btn.active {
  background-color: var(--primary-color);
  color: white;
}

.tab-btn:hover:not(.active) {
  background-color: rgba(246, 133, 27, 0.1);
}

.section-header-with-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header-with-action h2 {
  font-size: 1.75rem;
  color: var(--text-light);
}

.proposals-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.proposal-card {
  background-color: var(--background-card);
  border-radius: var(--border-radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.proposal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.proposal-header h3 {
  font-size: 1.25rem;
  margin-right: 1rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.active {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1976d2;
}

.status-badge.passed {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.status-badge.rejected {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.proposal-description {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.proposal-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-label {
  color: var(--text-muted);
  margin-right: 0.5rem;
  font-size: 0.9rem;
}

.stat-value {
  color: var(--text-light);
  font-size: 0.9rem;
}

.voting-progress {
  margin-bottom: 1.5rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.progress-bar {
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-for {
  height: 100%;
  background-color: var(--primary-color);
}

.voting-actions {
  display: flex;
  gap: 1rem;
}

.vote-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.vote-for {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.vote-for:hover {
  background-color: rgba(76, 175, 80, 0.2);
}

.vote-against {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.vote-against:hover {
  background-color: rgba(220, 53, 69, 0.2);
}

.treasury-section {
  margin-bottom: 3rem;
}

.treasury-balance {
  margin-bottom: 2rem;
}

.balance-card {
  background-color: var(--background-card);
  border-radius: var(--border-radius-md);
  padding: 1.5rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.balance-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
}

.balance-amount {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.allocations-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.allocation-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.allocation-info {
  display: flex;
  justify-content: space-between;
}

.allocation-category {
  color: var(--text-light);
}

.allocation-amount {
  color: var(--text-muted);
}

.allocation-bar {
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.allocation-fill {
  height: 100%;
}

.allocation-percentage {
  text-align: right;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.voting-power-section {
  margin-bottom: 3rem;
}

.voting-power-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.info-card {
  background-color: var(--background-card);
  border-radius: var(--border-radius-md);
  padding: 1.5rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.info-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
}

.info-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.connect-wallet-message {
  background-color: var(--background-card);
  border-radius: var(--border-radius-md);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.connect-wallet-message p {
  margin-bottom: 1.5rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .governance-tabs {
    flex-wrap: wrap;
  }
  
  .section-header-with-action {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .voting-power-info {
    grid-template-columns: 1fr;
  }
}`;

    fs.writeFileSync('src/pages/GovernancePage.css', governancePageCssContent);
    log('Created GovernancePage.css');

    // Fix HyrePage.css
    log('Creating HyrePage.css...');
    const hyrePageCssContent = `.hyre-page {
  min-height: calc(100vh - 70px - 200px);
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.job-card {
  background-color: var(--background-card);
  border-radius: var(--border-radius-md);
  padding: 25px;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.job-title {
  font-size: 1.25rem;
  margin-bottom: 5px;
}

.job-company {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.job-type {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.job-type.full-time {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.job-type.part-time {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1976d2;
}

.job-type.contract {
  background-color: rgba(246, 133, 27, 0.1);
  color: #f6851b;
}

.job-description {
  color: var(--text-muted);
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.job-details {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.job-detail {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-light);
}

.detail-icon {
  margin-right: 8px;
  color: var(--primary-color);
}

.job-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.skill-tag {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-light);
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.job-date {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.apply-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.apply-button:hover {
  background-color: var(--primary-hover);
}

.job-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 30px;
}

.filter-button {
  background-color: var(--background-card);
  color: var(--text-light);
  border: none;
  padding: 8px 16px;
  border-radius: var(--border-radius-sm);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-button.active {
  background-color: var(--primary-color);
  color: white;
}

.filter-button:hover:not(.active) {
  background-color: rgba(246, 133, 27, 0.1);
}

@media (max-width: 768px) {
  .jobs-grid {
    grid-template-columns: 1fr;
  }
  
  .job-filters {
    flex-direction: column;
    gap: 10px;
  }
}`;

    fs.writeFileSync('src/pages/HyrePage.css', hyrePageCssContent);
    log('Created HyrePage.css');

    // Fix AboutPage.css
    log('Creating AboutPage.css...');
    const aboutPageCssContent = `.about-page {
  min-height: calc(100vh - 70px - 200px);
}

.about-content {
  padding: 40px 0;
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.about-text h2 {
  font-size: 2rem;
  margin-bottom: 20px;
  color: var(--text-light);
}

.about-text p {
  margin-bottom: 20px;
  color: var(--text-muted);
  line-height: 1.7;
}

.about-image {
  position: relative;
  height: 400px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.team-section {
  padding: 60px 0;
  background-color: var(--background-light);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.team-card {
  background-color: var(--background-card);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.team-image {
  width: 100%;
  height: 250px;
  object-fit: cover;
}

.team-content {
  padding: 20px;
  text-align: center;
}

.team-name {
  font-size: 1.25rem;
  margin-bottom: 5px;
}

.team-role {
  color: var(--primary-color);
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.team-bio {
  color: var(--text-muted);
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.team-social {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-link {
  color: var(--text-muted);
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.social-link:hover {
  color: var(--primary-color);
}

.roadmap-section {
  padding: 60px 0;
}

.roadmap-timeline {
  position: relative;
  max-width: 800px;
  margin: 40px auto 0;
}

.roadmap-timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 60px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-content {
  position: relative;
  width: calc(50% - 30px);
  padding: 20px;
  background-color: var(--background-card);
  border-radius:
