import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import './BlockOffice.css';

const BlockOfficeSection = () => {
  const { account, connectWallet, error: walletError } = useWallet();
  const [activeTab, setActiveTab] = useState('analytics');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  const [sortBy, setSortBy] = useState('revenue');

  // Sample data for films
  const films = [
    {
      id: 1,
      title: "Quantum Horizon",
      director: "Alexandra Chen",
      poster: "https://placehold.co/300x450/6a1b9a/ffffff?text=Quantum+Horizon",
      releaseDate: "2024-02-15",
      revenue: "$42.8M",
      trend: "up",
      trendValue: "+12%",
      rating: 8.4,
      genres: ["Sci-Fi", "Drama", "Adventure"],
      runtime: "2h 18m",
      description: "A visionary scientist discovers a way to travel between parallel universes, only to find herself trapped in a reality where her choices led to catastrophic consequences.",
      cast: ["Emma Stone", "John Boyega", "Michelle Yeoh", "Oscar Isaac"],
      weeklyRevenue: [3.2, 4.5, 5.1, 4.8, 6.2, 8.5, 10.5]
    },
    {
      id: 2,
      title: "Midnight Serenade",
      director: "Marcus Johnson",
      poster: "https://placehold.co/300x450/9c27b0/ffffff?text=Midnight+Serenade",
      releaseDate: "2024-01-22",
      revenue: "$38.5M",
      trend: "down",
      trendValue: "-5%",
      rating: 7.9,
      genres: ["Romance", "Musical", "Drama"],
      runtime: "2h 05m",
      description: "In 1950s New Orleans, a struggling jazz pianist and an aspiring singer form an unlikely bond that transforms their lives and music forever.",
      cast: ["Zendaya", "Daniel Kaluuya", "Ana de Armas", "Daveed Diggs"],
      weeklyRevenue: [7.2, 6.8, 6.5, 6.2, 5.9, 5.5, 5.2]
    },
    {
      id: 3,
      title: "Emerald Legacy",
      director: "Sofia Patel",
      poster: "https://placehold.co/300x450/00796b/ffffff?text=Emerald+Legacy",
      releaseDate: "2024-03-08",
      revenue: "$51.2M",
      trend: "up",
      trendValue: "+18%",
      rating: 8.7,
      genres: ["Action", "Adventure", "Fantasy"],
      runtime: "2h 32m",
      description: "When an ancient artifact awakens dormant powers within a young archaeologist, she becomes the key to preventing a looming supernatural war.",
      cast: ["Lupita Nyong'o", "Pedro Pascal", "Ke Huy Quan", "Florence Pugh"],
      weeklyRevenue: [4.8, 5.6, 6.2, 7.1, 8.3, 9.5, 9.7]
    }
  ];

  // Sample data for news
  const news = [
    {
      id: 1,
      title: "Quantum Horizon Breaks Opening Weekend Records",
      image: "https://placehold.co/800x400/6a1b9a/ffffff?text=Quantum+Horizon+News",
      summary: "Alexandra Chen's sci-fi epic has shattered box office expectations with a $42.8M opening weekend.",
      date: "March 18, 2024",
      author: "Michael Rivera",
      source: "Film Industry Today",
      category: "box-office",
      content: "Quantum Horizon, the highly anticipated sci-fi film directed by visionary filmmaker Alexandra Chen, has exceeded all box office projections with a stunning $42.8 million opening weekend.\n\nThe film, which stars Emma Stone as brilliant physicist Dr. Eliza Mercer, has resonated with audiences and critics alike, earning praise for its innovative visual effects and thought-provoking narrative about parallel universes.\n\nIndustry analysts are particularly impressed by the film's performance given its original IP status in a market dominated by franchises and sequels. \"This demonstrates that audiences are still hungry for original, high-concept storytelling when executed with vision and precision,\" noted box office analyst Sarah Johnson.\n\nThe film's success on FilmChain's blockchain distribution platform has also been noteworthy, with record token-based transactions for opening weekend streaming purchases."
    },
    {
      id: 2,
      title: "FilmChain Expands Decentralized Distribution to Asian Markets",
      image: "https://placehold.co/800x400/9c27b0/ffffff?text=FilmChain+Expansion",
      summary: "The blockchain-based distribution platform announces major expansion into South Korean and Japanese markets.",
      date: "March 15, 2024",
      author: "Jennifer Wu",
      source: "Digital Cinema Report",
      category: "distribution",
      content: "FilmChain, the pioneering blockchain-based film distribution platform, has announced a significant expansion into Asian markets, with a particular focus on South Korea and Japan.\n\nThe platform, which has revolutionized film distribution through its decentralized model and transparent revenue sharing, will now offer its services to filmmakers and audiences in these key Asian film markets.\n\n\"We're thrilled to bring FilmChain's innovative distribution model to these vibrant film communities,\" said FilmChain CEO David Park. \"Both South Korea and Japan have dynamic, world-class film industries that we believe will benefit tremendously from our blockchain-based approach to distribution and revenue sharing.\"\n\nThe expansion includes partnerships with major local theaters and streaming platforms, as well as localized versions of the FilmChain platform that cater to regional preferences and payment systems."
    },
    {
      id: 3,
      title: "New Analytics Dashboard Launches for Filmmakers",
      image: "https://placehold.co/800x400/00796b/ffffff?text=Analytics+Dashboard",
      summary: "FilmChain introduces advanced real-time analytics for filmmakers to track performance across platforms.",
      date: "March 10, 2024",
      author: "Thomas Chen",
      source: "Tech & Cinema",
      category: "platform-update",
      content: "FilmChain has launched a comprehensive new analytics dashboard that provides filmmakers with unprecedented insights into their films' performance across multiple distribution channels.\n\nThe new BlockOffice Analytics suite offers real-time data on viewership, revenue, audience demographics, and engagement metrics, all secured and verified through blockchain technology.\n\n\"We've designed this dashboard to empower filmmakers with the kind of detailed analytics that were previously only available to major studios and distributors,\" explained FilmChain CTO Maria Rodriguez. \"Now, independent filmmakers can make data-driven decisions about marketing, distribution strategies, and future projects.\"\n\nThe dashboard includes features such as geographic heat maps of viewership, time-of-day engagement patterns, and correlation analyses between marketing activities and ticket sales or streaming numbers. All data is immutably recorded on the blockchain, ensuring accuracy and preventing manipulation."
    }
  ];

  // Filter films based on search term
  const filteredFilms = films.filter(film => 
    film.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    film.director.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter news based on search term
  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle film card click
  const handleFilmClick = (film) => {
    setSelectedFilm(film);
    setShowDetailModal(true);
  };

  // Handle news card click
  const handleNewsClick = (newsItem) => {
    setSelectedNews(newsItem);
    setShowNewsModal(true);
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="blockoffice-container">
      <div className="section-header">
        <h2 className="section-title">BlockOffice</h2>
        <p className="section-subtitle">Real-time box office analytics and industry insights powered by blockchain</p>
      </div>

      <div className="tabs-navigation">
        <button 
          className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <i className="fas fa-chart-line"></i>
          Box Office Analytics
        </button>
        <button 
          className={`tab-button ${activeTab === 'films' ? 'active' : ''}`}
          onClick={() => setActiveTab('films')}
        >
          <i className="fas fa-film"></i>
          Current Films
        </button>
        <button 
          className={`tab-button ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          <i className="fas fa-newspaper"></i>
          Industry News
        </button>
      </div>

      <div className="search-filter-bar">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input 
            type="text" 
            className="search-input" 
            placeholder={`Search ${activeTab === 'news' ? 'news' : 'films'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {activeTab === 'analytics' && (
          <div className="filter-controls">
            <select 
              className="filter-select" 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="quarter">Past Quarter</option>
              <option value="year">Past Year</option>
            </select>
            <select 
              className="filter-select" 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="revenue">Revenue</option>
              <option value="tickets">Ticket Sales</option>
              <option value="growth">Growth Rate</option>
            </select>
          </div>
        )}
      </div>

      {activeTab === 'analytics' && (
        <div className="analytics-dashboard">
          <div className="dashboard-grid">
            <div className="dashboard-card summary-card">
              <div className="card-header">
                <h3>Box Office Summary</h3>
                <span className="time-period">{timeRange === 'week' ? 'Past 7 Days' : timeRange === 'month' ? 'Past 30 Days' : timeRange === 'quarter' ? 'Past 90 Days' : 'Past 365 Days'}</span>
              </div>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-value">$132.5M</span>
                  <span className="stat-label">Total Revenue</span>
                  <span className="stat-change positive">+8.3%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">1.45M</span>
                  <span className="stat-label">Tickets Sold</span>
                  <span className="stat-change positive">+5.7%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">$91.38</span>
                  <span className="stat-label">Avg. Per Film</span>
                  <span className="stat-change negative">-2.1%</span>
                </div>
              </div>
            </div>

            <div className="dashboard-card chart-card">
              <div className="card-header">
                <h3>Revenue Trends</h3>
                <div className="chart-legend">
                  <span className="legend-item"><span className="legend-color" style={{backgroundColor: '#6a11cb'}}></span>This Period</span>
                  <span className="legend-item"><span className="legend-color" style={{backgroundColor: '#cccccc'}}></span>Previous Period</span>
                </div>
              </div>
              <div className="chart-placeholder">
                <div className="chart-bars">
                  {[65, 59, 80, 81, 56, 55, 40].map((value, index) => (
                    <div key={index} className="chart-bar-container">
                      <div className="chart-bar" style={{ height: `${value}%` }}></div>
                      <span className="bar-label">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dashboard-card top-performers-card">
              <div className="card-header">
                <h3>Top Performers</h3>
                <select className="card-filter">
                  <option>By Revenue</option>
                  <option>By Growth</option>
                </select>
              </div>
              <ul className="top-performers-list">
                {films.map((film, index) => (
                  <li key={index} className="performer-item">
                    <span className="rank">{index + 1}</span>
                    <div className="film-info">
                      <span className="film-title">{film.title}</span>
                      <span className="film-director">{film.director}</span>
                    </div>
                    <div className="performance-data">
                      <span className="revenue">{film.revenue}</span>
                      <span className={`trend ${film.trend}`}>
                        <i className={`fas fa-arrow-${film.trend}`}></i>
                        {film.trendValue}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dashboard-card genre-performance-card">
              <div className="card-header">
                <h3>Genre Performance</h3>
              </div>
              <div className="donut-chart-placeholder">
                <div className="donut-chart">
                  <div className="donut-segment" style={{ '--percentage': '35%', '--color': '#6a11cb' }}></div>
                  <div className="donut-segment" style={{ '--percentage': '25%', '--color': '#9c27b0' }}></div>
                  <div className="donut-segment" style={{ '--percentage': '20%', '--color': '#e91e63' }}></div>
                  <div className="donut-segment" style={{ '--percentage': '15%', '--color': '#ff5722' }}></div>
                  <div className="donut-segment" style={{ '--percentage': '5%', '--color': '#ffc107' }}></div>
                </div>
                <div className="donut-legend">
                  <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#6a11cb'}}></span>Action/Adventure (35%)</div>
                  <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#9c27b0'}}></span>Sci-Fi (25%)</div>
                  <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#e91e63'}}></span>Drama (20%)</div>
                  <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#ff5722'}}></span>Comedy (15%)</div>
                  <div className="legend-item"><span className="legend-color" style={{backgroundColor: '#ffc107'}}></span>Other (5%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'films' && (
        <div className="films-grid">
          {filteredFilms.map(film => (
            <div key={film.id} className="film-card" onClick={() => handleFilmClick(film)}>
              <div className="film-poster">
                <img src={film.poster} alt={film.title} />
                <div className="film-rating">
                  <i className="fas fa-star"></i>
                  <span>{film.rating}</span>
                </div>
              </div>
              <div className="film-info">
                <h3 className="film-title">{film.title}</h3>
                <p className="film-director">Dir. {film.director}</p>
                <p className="film-release-date">{formatDate(film.releaseDate)}</p>
                <div className="film-performance">
                  <span className="film-revenue">{film.revenue}</span>
                  <span className={`film-trend ${film.trend}`}>
                    <i className={`fas fa-arrow-${film.trend}`}></i>
                    {film.trendValue}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'news' && (
        <div className="news-grid">
          {filteredNews.map(item => (
            <div key={item.id} className="news-card" onClick={() => handleNewsClick(item)}>
              <div className="news-image">
                <img src={item.image} alt={item.title} />
                <span className={`news-category ${item.category}`}>
                  {item.category === 'box-office' ? 'Box Office' : 
                   item.category === 'distribution' ? 'Distribution' : 
                   'Platform Update'}
                </span>
              </div>
              <div className="news-content">
                <h3 className="news-title">{item.title}</h3>
                <p className="news-summary">{item.summary}</p>
                <div className="news-meta">
                  <span className="news-date">{item.date}</span>
                  <span className="news-source">{item.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Film Detail Modal */}
      {showDetailModal && selectedFilm && (
        <div className={`modal-overlay ${showDetailModal ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{selectedFilm.title}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedFilm(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="film-details">
                <div className="film-poster-large">
                  <img src={selectedFilm.poster} alt={selectedFilm.title} />
                </div>
                
                <div className="film-info">
                  <div className="film-meta">
                    <div className="meta-item">
                      <i className="fas fa-user"></i>
                      <span>Director: {selectedFilm.director}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Released: {formatDate(selectedFilm.releaseDate)}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-clock"></i>
                      <span>Runtime: {selectedFilm.runtime}</span>
                    </div>
                    <div className="meta-item">
                      <i className="fas fa-star"></i>
                      <span>Rating: {selectedFilm.rating}/10</span>
                    </div>
                  </div>
                  
                  <div className="film-genres">
                    {selectedFilm.genres.map((genre, index) => (
                      <span key={index} className="genre-tag">{genre}</span>
                    ))}
                  </div>
                  
                  <div className="film-description">
                    <h4>Synopsis</h4>
                    <p>{selectedFilm.description}</p>
                  </div>
                  
                  <div className="film-cast">
                    <h4>Cast</h4>
                    <div className="cast-list">
                      {selectedFilm.cast.map((actor, index) => (
                        <span key={index} className="cast-member">{actor}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="film-performance">
                    <h4>Box Office Performance</h4>
                    <div className="performance-stats">
                      <div className="stat-item">
                        <span className="stat-label">Total Revenue:</span>
                        <span className="stat-value">{selectedFilm.revenue}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Weekly Trend:</span>
                        <span className={`trending-badge ${selectedFilm.trend}`}>
                          <i className={`fas fa-arrow-${selectedFilm.trend}`}></i>
                          {selectedFilm.trendValue}
                        </span>
                      </div>
                    </div>
                    
                    <div className="weekly-chart">
                      <h5>Weekly Revenue</h5>
                      <div className="chart-bars horizontal">
                        {selectedFilm.weeklyRevenue.map((value, index) => (
                          <div key={index} className="chart-bar-container">
                            <span className="day-label">
                              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                            </span>
                            <div className="chart-bar-wrapper">
                              <div 
                                className="chart-bar" 
                                style={{ width: `${(value / Math.max(...selectedFilm.weeklyRevenue)) * 100}%` }}
                              ></div>
                              <span className="value-label">${value}M</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* News Detail Modal */}
      {showNewsModal && selectedNews && (
        <div className={`modal-overlay ${showNewsModal ? 'active' : ''}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">{selectedNews.title}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowNewsModal(false);
                  setSelectedNews(null);
                }}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <div className="news-details">
                <div className="news-image-large">
                  <img src={selectedNews.image} alt={selectedNews.title} />
                </div>
                
                <div className="news-meta">
                  <div className="meta-item">
                    <i className="fas fa-user"></i>
                    <span>By {selectedNews.author}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-calendar-alt"></i>
                    <span>{selectedNews.date}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-newspaper"></i>
                    <span>{selectedNews.source}</span>
                  </div>
                  <div className="meta-item">
                    <span className="category-tag">
                      {selectedNews.category === 'box-office' ? 'Box Office' : 
                       selectedNews.category === 'distribution' ? 'Distribution' : 
                       'Platform Update'}
                    </span>
                  </div>
                </div>
                
                <div className="news-content">
                  {selectedNews.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="news-actions">
                  <button className="btn btn-outline">
                    <i className="fas fa-share-alt"></i> Share
                  </button>
                  <button className="btn btn-outline">
                    <i className="fas fa-bookmark"></i> Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Connection Prompt */}
      {!account && (
        <div className="wallet-prompt">
          <i className="fas fa-lock"></i>
          <p>Connect your wallet to access premium analytics and personalized insights</p>
          <button className="btn btn-primary" onClick={connectWallet}>Connect Wallet</button>
        </div>
      )}
      
      {walletError && <p className="form-error">{walletError}</p>}
    </div>
  );
};

export default BlockOfficeSection;
