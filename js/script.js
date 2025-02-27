document.addEventListener('DOMContentLoaded', function() {
    // Connect Wallet Button
    const connectWalletBtn = document.querySelector('.connect-wallet');
    
    connectWalletBtn.addEventListener('click', async function() {
        // Check if MetaMask is installed
        if (typeof window.ethereum !== 'undefined') {
            try {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = accounts[0];
                
                // Update button text to show connected account
                connectWalletBtn.textContent = `${account.substring(0, 6)}...${account.substring(38)}`;
                
                // Add connected class
                connectWalletBtn.classList.add('connected');
                
                console.log('Connected to wallet:', account);
            } catch (error) {
                console.error('User denied account access');
                alert('Please connect to MetaMask to use FilmChain');
            }
        } else {
            alert('Please install MetaMask to use FilmChain');
            window.open('https://metamask.io/download.html', '_blank');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Project funding buttons
    const fundButtons = document.querySelectorAll('.project-card .btn.primary');
    
    fundButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!connectWalletBtn.classList.contains('connected')) {
                alert('Please connect your wallet first');
                return;
            }
            
            const projectTitle = this.closest('.project-info').querySelector('h3').textContent;
            alert(`You're about to fund "${projectTitle}". This would open a funding modal in the full application.`);
        });
    });
});
