import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';

const BlockOfficeSection = () => {
  const { account, connectWallet, error: walletError } = useWallet();
  const [timeFilter, setTimeFilter] = useState('week');
  const [newsCategory, setNewsCategory] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for statistics
  const stats = [
    { label: 'Total Box Office', value: '$1.2B', icon: 'fa-dollar-sign', trend: 'up', trendValue: '12%' },
    { label: 'Active Projects', value: '243', icon: 'fa-film', trend: 'up', trendValue: '8%' },
    { label: 'Investors', value: '18.5K', icon: 'fa-users', trend: 'up', trendValue: '15%' },
    { label: 'Average ROI', value: '27%', icon: 'fa-chart-line', trend: 'down', trendValue: '3%' }
  ];

  // Mock data for top films
  const topFilms = [
    {
      id: 1,
      title: 'Quantum Horizon',
      director: 'Sarah Chen',
      poster: 'https://i.ibb.co/d4zkmt45/Quantum-Dreams.jpg',
      revenue: '$125M',
      trend: 'up',
      trendValue: '12%',
      description: 'A mind-bending journey through parallel universes and quantum realities. When physicist Dr. Alex Mercer discovers a way to access alternate dimensions, he finds himself caught in a web of different versions of his own life.',
      releaseDate: '2024-02-15',
      runtime: '2h 18m',
      cast: ['Michael Chen', 'Elena Petrov', 'James Wilson'],
      genres: ['Sci-Fi', 'Thriller', 'Drama'],
      rating: 8.4,
      weeklyRevenue: [12.5, 18.7, 22.3, 25.8, 19.2, 15.6, 10.9]
    },
    {
      id: 2,
      title: 'The Last Symphony',
      director: 'Michael Rodriguez',
      poster: 'https://i.ibb.co/VpHHLnYM/Last-Symphony.jpg',
      revenue: '$98M',
      trend: 'up',
      trendValue: '8%',
      description: 'A touching story about a deaf musician\'s journey to compose her final masterpiece. Set against the backdrop of 1950s Paris, this emotional drama explores themes of perseverance and artistic expression.',
      releaseDate: '2024-01-20',
      runtime: '2h 5m',
      cast: ['Sophia Laurent', 'Thomas Wright', 'Maria Chen'],
      genres: ['Drama', 'Music', 'Biography'],
      rating: 9.1,
      weeklyRevenue: [8.2, 12.5, 15.8, 20.1, 18.7, 14.2, 8.5]
    },
    {
      id: 3,
      title: 'Neon Dreams',
      director: 'Alex Kim',
      poster: 'https://i.ibb.co/RT0vfKzb/The-Last-Sunset.jpg',
      revenue: '$87M',
      trend: 'down',
      trendValue: '3%',
      description: 'In a dystopian future where dreams are commodified and sold as entertainment, a dream harvester discovers a rare dreamscape that could change the world or destroy it.',
      releaseDate: '2024-03-05',
      runtime: '1h 58m',
      cast: ['David Park', 'Lily Chen', 'Robert Johnson'],
      genres: ['Sci-Fi', 'Cyberpunk', 'Action'],
      rating: 7.8,
      weeklyRevenue: [15.2, 18.5, 16.8, 14.2, 12.5, 10.1, 9.7]
    },
    {
      id: 4,
      title: 'Echoes of Tomorrow',
      director: 'James Wilson',
      poster: 'https://i.ibb.co/9kgV2mtk/heroic-super-cat-stockcake.jpg',
      revenue: '$76M',
      trend: 'up',
      trendValue: '5%',
      description: 'In a near-future society where memories can be digitally stored and traded, a memory detective uncovers a conspiracy that threatens to destabilize the entire system.',
      releaseDate: '2024-02-28',
      runtime: '2h 12m',
      cast: ['Emma Stone', 'Michael B. Jordan', 'Sandra Oh'],
      genres: ['Thriller', 'Mystery', 'Sci-Fi'],
      rating: 8.2,
      weeklyRevenue: [10.5, 12.8, 15.2, 18.7, 16.5, 14.2, 12.1]
    },
    {
      id: 5,
      title: 'Whispers in the Dark',
      director: 'Elena Petrov',
      poster: 'https://i.ibb.co/kGjhMX8/director3.jpg',
      revenue: '$65M',
      trend: 'down',
      trendValue: '2%',
      description: 'A psychological horror film about a novelist who moves to a remote cabin to finish her book, only to discover that the cabin has a dark history and may be haunted.',
      releaseDate: '2024-01-05',
      runtime: '1h 52m',
      cast: ['Jessica Chastain', 'Oscar Isaac', 'Toni Collette'],
      genres: ['Horror', 'Psychological', 'Thriller'],
      rating: 7.5,
      weeklyRevenue: [14.2, 12.5, 10.8, 9.5, 8.2, 7.5, 6.8]
    }
  ];

  // Mock data for news
  const newsItems = [
    {
      id: 1,
      title: '"Quantum Horizon" Breaks Opening Weekend Records',
      excerpt: 'The sci-fi thriller has surpassed expectations with a record-breaking $45M opening weekend, setting new benchmarks for independent productions.',
      content: 'In an unprecedented turn of events, "Quantum Horizon" directed by Sarah Chen has shattered box office expectations with a staggering $45M opening weekend. Industry analysts are calling this a watershed moment for independently financed films on the blockchain platform.\n\nThe film, which was partially funded through FilmChain\'s IndieFund platform, has demonstrated the viability of decentralized funding models for high-concept science fiction productions. Over 15,000 individual investors participated in the funding round, each now standing to receive returns proportional to their investment as the film continues its successful theatrical run.\n\n"This proves that audiences are hungry for innovative storytelling and are willing to support films directly through blockchain platforms," said Chen in a statement. "The traditional studio system isn\'t the only path to commercial success anymore."\n\nThe film\'s success has already triggered increased investment activity on the FilmChain platform, with several upcoming projects seeing funding boosts of 30-50% in the days following "Quantum Horizon\'s" opening weekend.',
      image: 'https://i.ibb.co/d4zkmt45/Quantum-Dreams.jpg',
      category: 'box-office',
      date: 'May 15, 2024',
      author: 'Michael Thompson',
      source: 'Blockchain Entertainment Weekly'
    },
    {
      id: 2,
      title: 'Indie Film "Moonlight Sonata" Secures Distribution Deal',
      excerpt: 'The award-winning indie drama has secured a major distribution deal following its festival success, marking a milestone for blockchain-funded productions.',
      content: 'Following its Grand Jury Prize win at the Sundance Film Festival, the blockchain-funded indie drama "Moonlight Sonata" has secured a worldwide distribution deal with Artisan Pictures. The film, directed by newcomer Jasmine Wong, was financed entirely through FilmChain\'s IndieFund platform with over 8,000 individual investors.\n\nThe distribution deal, reportedly worth $12 million, includes theatrical release in major markets as well as streaming rights. This represents one of the largest acquisitions for a blockchain-funded film to date and signals growing acceptance of this funding model within traditional distribution channels.\n\n"We\'re thrilled to bring this beautiful film to audiences worldwide," said Artisan Pictures CEO Robert Martinez. "The fact that it was funded through blockchain technology is a testament to the evolving landscape of film financing."\n\nWong expressed gratitude to the film\'s many investors: "This wouldn\'t have been possible without the support of thousands of believers who funded this project. They took a chance on my vision, and now they\'ll share in its success."\n\nInvestors in the film will receive returns based on the distribution deal as well as ongoing revenue sharing from theatrical and streaming performance, all managed automatically through FilmChain\'s smart contracts.',
      image: 'https://i.ibb.co/VpHHLnYM/Last-Symphony.jpg',
      category: 'distribution',
      date: 'May 12, 2024',
      author: 'Sarah Johnson',
      source: 'Film Industry Today'
    },
    {
      id: 3,
      title: 'FilmChain Introduces New Investor Analytics Dashboard',
      excerpt: 'The platform has launched a new analytics tool to help investors track performance metrics in real-time, enhancing transparency in film investments.',
      content: 'FilmChain has unveiled a comprehensive new analytics dashboard designed to provide investors with unprecedented visibility into the performance of their film investments. The new tool, which launched in beta today, offers real-time data on box office performance, streaming views, and projected returns.\n\n"Transparency is essential in any investment ecosystem," said FilmChain CEO David Chen. "Our new analytics dashboard gives investors the data they need to make informed decisions and track the performance of their portfolio in real-time."\n\nThe dashboard includes features such as geographic revenue breakdowns, comparison tools for benchmarking against similar films, and predictive analytics that forecast potential returns based on current performance trends. All data is secured and verified through blockchain technology, ensuring accuracy and preventing manipulation.\n\nEarly beta testers have responded positively to the new tools. "As someone who has invested in multiple films through the platform, having this level of insight into performance metrics is game-changing," said Maria Rodriguez, a FilmChain investor since 2022. "I can now see exactly how my investments are performing across different markets and platforms."\n\nThe analytics dashboard will be available to all FilmChain users starting next month, with premium features available to those who stake FILM tokens in the platform.',
      image: 'https://i.ibb.co/RT0vfKzb/The-Last-Sunset.jpg',
      category: 'platform',
      date: 'May 10, 2024',
      author: 'Alex Chen',
      source: 'Blockchain Technology Review'
    }
  ];

  // Filter news based on selected category
  const filteredNews = newsCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === newsCategory);

  const handleFilmClick = (film) => {
    setSelectedFilm(film);
    setShowDetailModal(true);
  };

  const handleNewsClick = (news) => {
    setSelectedNews(news);
    setShowNewsModal(true);
  };

  const formatCurrency = (value) => {
    return value.startsWith('$') ? value : `$${value}`;
  };

  const formatPercentage = (value) => {
    return value.endsWith('%') ? value : `${value}%`;
  };

  return (
    <div className="blockoffice-container">
      <div className="section-header">
        <h2 className="section-title">Block Office</h2>
        <p className="section-subtitle">Real-time box office data, analytics, and industry news powered by blockchain technology</p>
      </div>
      
      {/* Statistics Section */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-icon">
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div className={`stat-trend ${stat.trend}`}>
              <i className={`fas fa-arrow-${stat.trend}`}></i>
              <span>{stat.trendValue}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart Section */}
      <div className="chart-container">
        <div className="chart-header">
          <h3>Box Office Revenue</h3>
          <div className="chart-filters">
            <button 
              className={`chart-filter-btn ${timeFilter === 'week' ? 'active' : ''}`}
              onClick={() => setTimeFilter('week')}
            >
              Week
            </button>
            <button 
              className={`chart-filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
              onClick={() => setTimeFilter('month')}
            >
              Month
            </button>
            <button 
              className={`chart-filter-btn ${timeFilter === 'year' ? 'active' : ''}`}
              onClick={() => setTimeFilter('year')}
            >
              Year
            </button>
          </div>
        </div>
        
        {account ? (
          <div className="chart-content">
            <div className="chart-placeholder">
              <div className="chart-bars">
                {selectedFilm ? 
                  selectedFilm.weeklyRevenue.map((value, index) => (
                    <div 
                      key={index} 
                      className="chart-bar" 
                      style={{ height: `${(value / Math.max(...selectedFilm.weeklyRevenue)) * 100}%` }}
                    >
                      <div className="chart-bar-tooltip">${value}M</div>
                    </div>
                  )) : 
                  topFilms[0].weeklyRevenue.map((value, index) => (
                    <div 
                      key={index} 
                      className="chart-bar" 
                      style={{ height: `${(value / Math.max(...topFilms[0].weeklyRevenue)) * 100}%` }}
                    >
                      <div className="chart-bar-tooltip">${value}M</div>
                    </div>
                  ))
                }
              </div>
              <div className="chart-labels">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: 'var(--primary-color)' }}></div>
                <span>{selectedFilm ? selectedFilm.title : topFilms[0].title}</span>
              </div>
              <p className="chart-note">Click on any film below to view its revenue chart</p>
            </div>
          </div>
        ) : (
          <div className="chart-placeholder empty">
            <div className="connect-prompt">
              <i className="fas fa-lock"></i>
              <p>Connect your wallet to view detailed analytics</p>
              <button className="btn btn-primary" onClick={connectWallet}>Connect Wallet</button>
            </div>
          </div>
        )}
      </div>

      {/* Top Films Section */}
      <div className="top-films-section">
        <h3 className="section-subtitle">Top Performing Films</h3>
        <div className="responsive-table-container">
          <table className="films-table">
            <thead>
              <tr>
                <th>Film</th>
                <th>Revenue</th>
                <th>Trend</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {topFilms.map(film => (
                <tr key={film.id} onClick={() => handleFilmClick(film)}>
                  <td>
                    <div className="film-title">
                      <img src={film.poster} alt={film.title} className="film-poster" />
                      <div>
                        <div className="film-name">{film.title}</div>
                        <div className="film-director">Dir: {film.director}</div>
                      </div>
                    </div>
                  </td>
                  <td className="revenue-value">{film.revenue}</td>
                  <td>
                    <span className={`trending-badge ${film.trend}`}>
                      <i className={`fas fa-arrow-${film.trend}`}></i>
                      {film.trendValue}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFilmClick(film);
                      }}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* News Section */}
      <div className="news-section">
        <div className="section-header">
          <h3 className="section-subtitle">Industry News</h3>
          <div className="tabs">
            <button 
              className={`tab-button ${newsCategory === 'all' ? 'active' : ''}`}
              onClick={() => setNewsCategory('all')}
            >
              All News
            </button>
            <button 
              className={`tab-button ${newsCategory === 'box-office' ? 'active' : ''}`}
              onClick={() => setNewsCategory('box-office')}
            >
              Box Office
            </button>
            <button 
              className={`tab-button ${newsCategory === 'distribution' ? 'active' : ''}`}
              onClick={() => setNewsCategory('distribution')}
            >
              Distribution
            </button>
            <button 
              className={`tab-button ${newsCategory === 'platform' ? 'active' : ''}`}
              onClick={() => setNewsCategory('platform')}
            >
              Platform Updates
            </button>
          </div>
        </div>
        
        <div className="grid">
          {filteredNews.map(news => (
            <div 
              className="card news-card" 
              key={news.id}
              onClick={() => handleNewsClick(news)}
            >
              <div className="card-image">
                <img src={news.image} alt={news.title} />
                <div className="card-badge">
                  {news.category === 'box-office' ? 'Box Office' : 
                   news.category === 'distribution' ? 'Distribution' : 
                   'Platform Update'}
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{news.title}</h3>
                <p className="card-text">{news.excerpt}</p>
                <div className="card-footer">
                  <span className="news-date">
                    <i className="far fa-calendar-alt"></i> {news.date}
                  </span>
                  <button className="btn-link">Read More</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default BlockOfficeSection;
