import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';

const BlockOfficeSection = () => {
  const { account, connectWallet } = useWallet();
  const [timeFilter, setTimeFilter] = useState('week');
  const [newsCategory, setNewsCategory] = useState('all');

  // Mock data for statistics
  const stats = [
    { label: 'Total Box Office', value: '$1.2B' },
    { label: 'Active Projects', value: '243' },
    { label: 'Investors', value: '18.5K' },
    { label: 'Average ROI', value: '27%' }
  ];

  // Mock data for top films
  const topFilms = [
    {
      id: 1,
      title: 'Quantum Horizon',
      director: 'Sarah Chen',
      poster: 'https://via.placeholder.com/40x60',
      revenue: '$125M',
      trend: 'up',
      trendValue: '12%'
    },
    {
      id: 2,
      title: 'The Last Symphony',
      director: 'Michael Rodriguez',
      poster: 'https://via.placeholder.com/40x60',
      revenue: '$98M',
      trend: 'up',
      trendValue: '8%'
    },
    {
      id: 3,
      title: 'Neon Dreams',
      director: 'Alex Kim',
      poster: 'https://via.placeholder.com/40x60',
      revenue: '$87M',
      trend: 'down',
      trendValue: '3%'
    },
    {
      id: 4,
      title: 'Echoes of Tomorrow',
      director: 'James Wilson',
      poster: 'https://via.placeholder.com/40x60',
      revenue: '$76M',
      trend: 'up',
      trendValue: '5%'
    },
    {
      id: 5,
      title: 'Whispers in the Dark',
      director: 'Elena Petrov',
      poster: 'https://via.placeholder.com/40x60',
      revenue: '$65M',
      trend: 'down',
      trendValue: '2%'
    }
  ];

  // Mock data for news
  const newsItems = [
    {
      id: 1,
      title: '"Quantum Horizon" Breaks Opening Weekend Records',
      excerpt: 'The sci-fi thriller has surpassed expectations with a record-breaking $45M opening weekend.',
      image: 'https://via.placeholder.com/300x180',
      category: 'box-office',
      date: 'May 15, 2023'
    },
    {
      id: 2,
      title: 'Indie Film "Moonlight Sonata" Secures Distribution Deal',
      excerpt: 'The award-winning indie drama has secured a major distribution deal following its festival success.',
      image: 'https://via.placeholder.com/300x180',
      category: 'distribution',
      date: 'May 12, 2023'
    },
    {
      id: 3,
      title: 'FilmChain Introduces New Investor Analytics Dashboard',
      excerpt: 'The platform has launched a new analytics tool to help investors track performance metrics in real-time.',
      image: 'https://via.placeholder.com/300x180',
      category: 'platform',
      date: 'May 10, 2023'
    }
  ];

  // Filter news based on selected category
  const filteredNews = newsCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === newsCategory);

  return (
    <div className="blockoffice-container">
      <div className="section-header">
        <h2>Block Office</h2>
        <p>Real-time box office data, analytics, and industry news powered by blockchain technology.</p>
      </div>

      {/* Statistics Section */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
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
        <div className="chart-placeholder">
          {!account ? (
            <div>
              <p>Connect your wallet to view detailed analytics</p>
              <button className="wallet-btn" onClick={connectWallet}>Connect Wallet</button>
            </div>
          ) : (
            <p>Chart visualization will be displayed here</p>
          )}
        </div>
      </div>

      {/* Top Films Section */}
      <div className="top-films-section">
        <h3>Top Performing Films</h3>
        <table className="films-table">
          <thead>
            <tr>
              <th>Film</th>
              <th>Revenue</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            {topFilms.map(film => (
              <tr key={film.id}>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* News Section */}
      <div className="news-section">
        <div className="section-header">
          <h3>Industry News</h3>
          <div className="category-tabs">
            <button 
              className={`category-tab ${newsCategory === 'all' ? 'active' : ''}`}
              onClick={() => setNewsCategory('all')}
            >
              All News
            </button>
            <button 
              className={`category-tab ${newsCategory === 'box-office' ? 'active' : ''}`}
              onClick={() => setNewsCategory('box-office')}
            >
              Box Office
            </button>
            <button 
              className={`category-tab ${newsCategory === 'distribution' ? 'active' : ''}`}
              onClick={() => setNewsCategory('distribution')}
            >
              Distribution
            </button>
            <button 
              className={`category-tab ${newsCategory === 'platform' ? 'active' : ''}`}
              onClick={() => setNewsCategory('platform')}
            >
              Platform Updates
            </button>
          </div>
        </div>
        <div className="news-grid">
          {filteredNews.map(news => (
            <div className="news-card" key={news.id}>
              <img src={news.image} alt={news.title} className="news-image" />
              <div className="news-content">
                <span className="news-category">{news.category === 'box-office' ? 'Box Office' : news.category === 'distribution' ? 'Distribution' : 'Platform Update'}</span>
                <h4 className="news-title">{news.title}</h4>
                <p className="news-excerpt">{news.excerpt}</p>
                <div className="news-footer">
                  <span className="news-date">
                    <i className="far fa-calendar-alt"></i> {news.date}
                  </span>
                  <a href="/news" className="read-more">Read More</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Connection Prompt */}
      {!account && (
        <div className="wallet-prompt">
          <p>Connect your wallet to access premium analytics and personalized insights</p>
          <button className="wallet-btn" onClick={connectWallet}>Connect Wallet</button>
        </div>
      )}
    </div>
  );
};

export default BlockOfficeSection;
