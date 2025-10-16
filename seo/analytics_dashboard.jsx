/**
 * SEO Analytics Dashboard for Autoilty.com
 * Comprehensive tracking and visualization of SEO metrics
 * 
 * Required APIs: Google Analytics 4, Search Console, Ahrefs
 */

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SEODashboard = () => {
    const [metrics, setMetrics] = useState({
        organic_traffic: 0,
        keyword_rankings: 0,
        backlinks: 0,
        domain_authority: 0,
        forum_signups: 0,
        engagement_rate: 0
    });

    const [timeRange, setTimeRange] = useState('30d');

    // Simulated data (replace with actual API calls)
    const trafficData = [
        { month: 'Jan', traffic: 5000, goal: 10000 },
        { month: 'Feb', traffic: 8000, goal: 15000 },
        { month: 'Mar', traffic: 12000, goal: 20000 },
        { month: 'Apr', traffic: 18000, goal: 30000 },
        { month: 'May', traffic: 27000, goal: 45000 },
        { month: 'Jun', traffic: 40000, goal: 60000 },
        { month: 'Jul', traffic: 58000, goal: 80000 },
        { month: 'Aug', traffic: 82000, goal: 100000 },
        { month: 'Sep', traffic: 115000, goal: 150000 },
        { month: 'Oct', traffic: 160000, goal: 200000 },
        { month: 'Nov', traffic: 220000, goal: 300000 },
        { month: 'Dec', traffic: 310000, goal: 400000 }
    ];

    const keywordData = [
        { position: 'Top 3', count: 45 },
        { position: '4-10', count: 120 },
        { position: '11-20', count: 180 },
        { position: '21-50', count: 250 },
        { position: '51-100', count: 150 }
    ];

    const trafficSourceData = [
        { name: 'Organic Search', value: 65 },
        { name: 'Direct', value: 15 },
        { name: 'Social Media', value: 12 },
        { name: 'Referral', value: 8 }
    ];

    const topKeywords = [
        { keyword: 'car forum canada', position: 1, traffic: 2500, change: '+2' },
        { keyword: 'winter tires canada', position: 2, traffic: 1800, change: '+5' },
        { keyword: 'electric car forum', position: 3, traffic: 1500, change: '-1' },
        { keyword: 'auto enthusiast community', position: 4, traffic: 1200, change: '+8' },
        { keyword: 'car maintenance tips', position: 5, traffic: 1100, change: '+3' },
        { keyword: 'vehicle reviews canada', position: 7, traffic: 950, change: '+12' },
        { keyword: 'diy car repair', position: 8, traffic: 880, change: '+6' },
        { keyword: 'best suv canada', position: 9, traffic: 820, change: '+15' },
        { keyword: 'car buying guide', position: 11, traffic: 750, change: '+4' },
        { keyword: 'automotive discussion', position: 14, traffic: 680, change: '+9' }
    ];

    const conversionFunnel = [
        { stage: 'Organic Visitors', count: 100000, percentage: 100 },
        { stage: 'Page Views', count: 45000, percentage: 45 },
        { stage: 'Forum Visits', count: 25000, percentage: 25 },
        { stage: 'Sign-up Started', count: 8000, percentage: 8 },
        { stage: 'Completed Sign-up', count: 5000, percentage: 5 }
    ];

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Autoilty SEO Analytics Dashboard</h1>
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 90 Days</option>
                    <option value="12m">Last 12 Months</option>
                </select>
            </header>

            {/* KPI Cards */}
            <section className="kpi-grid">
                <div className="kpi-card">
                    <h3>Organic Traffic</h3>
                    <div className="kpi-value">310,000</div>
                    <div className="kpi-change positive">+41% vs last month</div>
                </div>
                
                <div className="kpi-card">
                    <h3>Keywords in Top 10</h3>
                    <div className="kpi-value">165</div>
                    <div className="kpi-change positive">+28 this month</div>
                </div>
                
                <div className="kpi-card">
                    <h3>Domain Authority</h3>
                    <div className="kpi-value">58</div>
                    <div className="kpi-change positive">+12 since launch</div>
                </div>
                
                <div className="kpi-card">
                    <h3>Total Backlinks</h3>
                    <div className="kpi-value">1,247</div>
                    <div className="kpi-change positive">+186 this month</div>
                </div>

                <div className="kpi-card">
                    <h3>Forum Sign-ups</h3>
                    <div className="kpi-value">5,234</div>
                    <div className="kpi-change positive">+892 this month</div>
                </div>

                <div className="kpi-card">
                    <h3>Avg. Session Duration</h3>
                    <div className="kpi-value">8:42</div>
                    <div className="kpi-change positive">+1:23 improvement</div>
                </div>
            </section>

            {/* Traffic Growth Chart */}
            <section className="chart-section">
                <h2>Organic Traffic Growth</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="traffic" stroke="#E2231A" strokeWidth={2} name="Actual Traffic" />
                        <Line type="monotone" dataKey="goal" stroke="#999" strokeDasharray="5 5" name="Target" />
                    </LineChart>
                </ResponsiveContainer>
            </section>

            {/* Keyword Position Distribution */}
            <section className="chart-section">
                <h2>Keyword Position Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={keywordData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="position" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#E2231A" />
                    </BarChart>
                </ResponsiveContainer>
            </section>

            {/* Traffic Sources */}
            <section className="chart-section">
                <h2>Traffic Sources</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={trafficSourceData}
                            cx="50%"
                            cy="50%"
                            label
                            outerRadius={80}
                            fill="#E2231A"
                            dataKey="value"
                        />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </section>

            {/* Top Performing Keywords */}
            <section className="table-section">
                <h2>Top Performing Keywords</h2>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Keyword</th>
                            <th>Position</th>
                            <th>Monthly Traffic</th>
                            <th>Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topKeywords.map((kw, index) => (
                            <tr key={index}>
                                <td>{kw.keyword}</td>
                                <td>
                                    <span className={`position-badge ${kw.position <= 3 ? 'top-3' : ''}`}>
                                        #{kw.position}
                                    </span>
                                </td>
                                <td>{kw.traffic.toLocaleString()}</td>
                                <td className={kw.change.startsWith('+') ? 'positive' : 'negative'}>
                                    {kw.change}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Conversion Funnel */}
            <section className="table-section">
                <h2>Conversion Funnel</h2>
                <div className="funnel">
                    {conversionFunnel.map((stage, index) => (
                        <div key={index} className="funnel-stage" style={{width: `${stage.percentage}%`}}>
                            <div className="funnel-label">{stage.stage}</div>
                            <div className="funnel-value">{stage.count.toLocaleString()} ({stage.percentage}%)</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Insights & Recommendations */}
            <section className="insights-section">
                <h2>AI-Powered Insights</h2>
                <div className="insights-grid">
                    <div className="insight-card success">
                        <span className="insight-icon">✅</span>
                        <h3>Excellent Performance</h3>
                        <p>Your "winter tires canada" keyword moved from position 7 to position 2 this month. Continue optimizing this content cluster.</p>
                    </div>
                    
                    <div className="insight-card warning">
                        <span className="insight-icon">⚠️</span>
                        <h3>Opportunity Detected</h3>
                        <p>24 keywords ranking positions 11-15. Small optimizations could push these to page 1. Priority: "car buying guide canada"</p>
                    </div>
                    
                    <div className="insight-card info">
                        <span className="insight-icon">💡</span>
                        <h3>Content Gap</h3>
                        <p>Competitors ranking for "ev charging stations canada" - you have no content. Estimated traffic opportunity: 2,500/month</p>
                    </div>
                    
                    <div className="insight-card success">
                        <span className="insight-icon">📈</span>
                        <h3>Traffic Milestone</h3>
                        <p>Congratulations! You've reached 300K+ monthly organic visitors - 3 months ahead of target.</p>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .dashboard {
                    padding: 2rem;
                    background: #f4f4f4;
                    font-family: 'Inter', sans-serif;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }

                .dashboard-header h1 {
                    font-size: 2rem;
                    color: #000;
                }

                .dashboard-header select {
                    padding: 0.5rem 1rem;
                    border: 2px solid #E2231A;
                    border-radius: 4px;
                    font-size: 1rem;
                }

                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .kpi-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .kpi-card h3 {
                    font-size: 0.9rem;
                    color: #767676;
                    margin-bottom: 0.5rem;
                }

                .kpi-value {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #000;
                    margin-bottom: 0.5rem;
                }

                .kpi-change {
                    font-size: 0.85rem;
                    font-weight: 500;
                }

                .kpi-change.positive {
                    color: #10B981;
                }

                .kpi-change.negative {
                    color: #EF4444;
                }

                .chart-section {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .chart-section h2 {
                    font-size: 1.25rem;
                    margin-bottom: 1rem;
                }

                .table-section {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 2rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .data-table th {
                    text-align: left;
                    padding: 1rem;
                    border-bottom: 2px solid #E8E8E8;
                    font-weight: 600;
                    color: #000;
                }

                .data-table td {
                    padding: 1rem;
                    border-bottom: 1px solid #E8E8E8;
                }

                .position-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    background: #F4F4F4;
                    border-radius: 4px;
                    font-weight: 600;
                }

                .position-badge.top-3 {
                    background: #10B981;
                    color: white;
                }

                .funnel {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .funnel-stage {
                    background: linear-gradient(135deg, #E2231A, #ff6b6b);
                    color: white;
                    padding: 1rem;
                    text-align: center;
                    border-radius: 4px;
                    transition: all 0.3s;
                }

                .funnel-label {
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }

                .insights-section {
                    margin-top: 2rem;
                }

                .insights-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-top: 1rem;
                }

                .insight-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 8px;
                    border-left: 4px solid;
                }

                .insight-card.success {
                    border-color: #10B981;
                }

                .insight-card.warning {
                    border-color: #F59E0B;
                }

                .insight-card.info {
                    border-color: #3B82F6;
                }

                .insight-icon {
                    font-size: 2rem;
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .insight-card h3 {
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                }

                .insight-card p {
                    color: #767676;
                    line-height: 1.5;
                }

                @media (max-width: 768px) {
                    .kpi-grid {
                        grid-template-columns: 1fr;
                    }

                    .insights-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default SEODashboard;

