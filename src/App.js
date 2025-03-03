// src/App.js - Update the navigation order
// Replace the existing navigation section with this code

<div className="main-navigation">
  <button 
    className={`nav-button ${activeSection === 'indieFund' ? 'active' : ''}`}
    onClick={() => setActiveSection('indieFund')}
  >
    Indie Fund
  </button>
  <button 
    className={`nav-button ${activeSection === 'communityVoice' ? 'active' : ''}`}
    onClick={() => setActiveSection('communityVoice')}
  >
    Community Voice
  </button>
  <button 
    className={`nav-button ${activeSection === 'hyreBlock' ? 'active' : ''}`}
    onClick={() => setActiveSection('hyreBlock')}
  >
    Hyre Block
  </button>
  <button 
    className={`nav-button ${activeSection === 'blockOffice' ? 'active' : ''}`}
    onClick={() => setActiveSection('blockOffice')}
  >
    Block Office
  </button>
</div>

{/* Update the conditional rendering order to match */}
{activeSection === 'indieFund' && <IndieFundSection />}
{activeSection === 'communityVoice' && <CommunityVoiceSection />}
{activeSection === 'hyreBlock' && <HyreBlockSection />}
{activeSection === 'blockOffice' && <BlockOfficeSection />}
