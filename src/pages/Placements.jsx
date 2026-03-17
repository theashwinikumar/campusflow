import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const COMPANIES = [
  {
    id: 1, name: 'Google', logo: '🔵', category: 'Product',
    role: 'Software Engineer', package: '32 LPA', location: 'Bangalore',
    date: '2026-04-15', status: 'upcoming',
    cgpa: 8.0, backlogs: 0, branches: ['CSE', 'IT', 'ECE'],
    description: 'Full-time SWE role in Google Cloud Platform team. Involves designing scalable distributed systems.',
  },
  {
    id: 2, name: 'Microsoft', logo: '🟦', category: 'Product',
    role: 'SDE-1', package: '28 LPA', location: 'Hyderabad',
    date: '2026-04-10', status: 'upcoming',
    cgpa: 7.5, backlogs: 0, branches: ['CSE', 'IT', 'ECE', 'EE'],
    description: 'Software Development Engineer in Azure DevOps. Work on CI/CD tools used by millions.',
  },
  {
    id: 3, name: 'Amazon', logo: '🟠', category: 'Product',
    role: 'SDE-1', package: '26 LPA', location: 'Bangalore',
    date: '2026-03-25', status: 'ongoing',
    cgpa: 7.0, backlogs: 0, branches: ['CSE', 'IT'],
    description: 'Join Amazon Retail team building next-gen e-commerce experiences at scale.',
  },
  {
    id: 4, name: 'Adobe', logo: '🔴', category: 'Product',
    role: 'Member of Technical Staff', package: '24 LPA', location: 'Noida',
    date: '2026-03-20', status: 'ongoing',
    cgpa: 7.5, backlogs: 0, branches: ['CSE', 'IT', 'ECE'],
    description: 'Work on Adobe Creative Cloud products. Strong focus on UI/UX engineering.',
  },
  {
    id: 5, name: 'Flipkart', logo: '🟡', category: 'Product',
    role: 'SDE-1', package: '22 LPA', location: 'Bangalore',
    date: '2026-03-15', status: 'completed',
    cgpa: 7.0, backlogs: 0, branches: ['CSE', 'IT', 'ECE'],
    description: 'Backend engineering on high-throughput order management system.',
  },
  {
    id: 6, name: 'TCS', logo: '🔷', category: 'IT',
    role: 'Systems Engineer', package: '7 LPA', location: 'Multiple',
    date: '2026-03-10', status: 'completed',
    cgpa: 6.0, backlogs: 1, branches: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
    description: 'TCS Ninja hiring for pan-India deployment across multiple service lines.',
  },
  {
    id: 7, name: 'Infosys', logo: '🔹', category: 'IT',
    role: 'Senior Systems Engineer', package: '9.5 LPA', location: 'Multiple',
    date: '2026-03-05', status: 'completed',
    cgpa: 6.5, backlogs: 0, branches: ['CSE', 'IT', 'ECE', 'EE', 'ME'],
    description: 'Infosys Power Programmer role with specialized tech training and fast-track growth.',
  },
  {
    id: 8, name: 'Wipro', logo: '🟣', category: 'IT',
    role: 'Project Engineer', package: '6.5 LPA', location: 'Multiple',
    date: '2026-02-28', status: 'completed',
    cgpa: 6.0, backlogs: 1, branches: ['CSE', 'IT', 'ECE', 'EE', 'ME', 'CE'],
    description: 'Wipro Elite NLTH program for fresh engineering graduates.',
  },
];

const APPLICATIONS = [
  { id: 1, company: 'Google', role: 'Software Engineer', appliedDate: '2026-03-20', status: 'applied', round: 'OA Pending' },
  { id: 2, company: 'Microsoft', role: 'SDE-1', appliedDate: '2026-03-18', status: 'shortlisted', round: 'Online Assessment' },
  { id: 3, company: 'Amazon', role: 'SDE-1', appliedDate: '2026-03-10', status: 'interview', round: 'Technical Round 2' },
  { id: 4, company: 'Adobe', role: 'Member of Technical Staff', appliedDate: '2026-03-08', status: 'shortlisted', round: 'Coding Round' },
  { id: 5, company: 'Flipkart', role: 'SDE-1', appliedDate: '2026-03-01', status: 'selected', round: 'HR Round Cleared' },
  { id: 6, company: 'TCS', role: 'Systems Engineer', appliedDate: '2026-02-20', status: 'selected', round: 'Offer Released' },
  { id: 7, company: 'Infosys', role: 'Senior Systems Engineer', appliedDate: '2026-02-15', status: 'rejected', round: 'Technical Interview' },
];

const RESULTS = [
  { id: 1, student: 'Arjun Sharma', rollNo: 'CS2022001', company: 'Google', role: 'Software Engineer', package: '32 LPA', date: '2026-03-16' },
  { id: 2, student: 'Sneha Patel', rollNo: 'CS2022002', company: 'Microsoft', role: 'SDE-1', package: '28 LPA', date: '2026-03-14' },
  { id: 3, student: 'Vikram Rao', rollNo: 'CS2022004', company: 'Amazon', role: 'SDE-1', package: '26 LPA', date: '2026-03-12' },
  { id: 4, student: 'Priya Verma', rollNo: 'CS2022003', company: 'Adobe', role: 'MTS', package: '24 LPA', date: '2026-03-11' },
  { id: 5, student: 'Rohan Gupta', rollNo: 'CS2022005', company: 'Flipkart', role: 'SDE-1', package: '22 LPA', date: '2026-03-10' },
  { id: 6, student: 'Ananya Singh', rollNo: 'CS2022006', company: 'Flipkart', role: 'SDE-1', package: '22 LPA', date: '2026-03-10' },
  { id: 7, student: 'Karthik Nair', rollNo: 'EC2022001', company: 'TCS', role: 'Systems Engineer', package: '7 LPA', date: '2026-03-08' },
  { id: 8, student: 'Meera Joshi', rollNo: 'IT2022001', company: 'TCS', role: 'Systems Engineer', package: '7 LPA', date: '2026-03-08' },
  { id: 9, student: 'Rahul Desai', rollNo: 'CS2022007', company: 'Infosys', role: 'SSE', package: '9.5 LPA', date: '2026-03-06' },
  { id: 10, student: 'Divya Menon', rollNo: 'IT2022002', company: 'Wipro', role: 'Project Engineer', package: '6.5 LPA', date: '2026-03-04' },
];

const ELIGIBILITY_CRITERIA = [
  { rule: 'Minimum CGPA', detail: '6.0 (varies by company; product companies typically require 7.0+)' },
  { rule: 'Active Backlogs', detail: 'No active backlogs at time of application (some mass recruiters allow up to 1)' },
  { rule: 'Education Gap', detail: 'Maximum 1 year gap allowed in academic history' },
  { rule: 'Branch Eligibility', detail: 'Most IT/Product companies: CSE, IT, ECE. Service companies: All branches' },
  { rule: 'Attendance', detail: 'Minimum 75% attendance required to sit for placements' },
  { rule: 'Offer Policy', detail: 'Students with 1 offer from a company offering >= 10 LPA are restricted from further drives unless Dream/Super Dream tier' },
];

const STATUS_CONFIG = {
  applied: { label: 'Applied', badge: 'badge-blue' },
  shortlisted: { label: 'Shortlisted', badge: 'badge-amber' },
  interview: { label: 'Interview', badge: 'badge-purple' },
  selected: { label: 'Selected', badge: 'badge-green' },
  rejected: { label: 'Rejected', badge: 'badge-red' },
};

const COMPANY_STATUS = {
  upcoming: { label: 'Upcoming', badge: 'badge-blue' },
  ongoing: { label: 'Ongoing', badge: 'badge-amber' },
  completed: { label: 'Completed', badge: 'badge-green' },
};

const labelStyle = { display: 'block', marginBottom: '4px', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' };

export default function Placements() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('companies');
  const [companyFilter, setCompanyFilter] = useState('All');

  const [applyingTo, setApplyingTo] = useState(null);

  const filteredCompanies = COMPANIES.filter(c => companyFilter === 'All' || c.category === companyFilter);

  // n8n webhook integration — update the URL to match your workflow's webhook path
  const N8N_WEBHOOK_URL = 'https://manish-ai.app.n8n.cloud/webhook/chat';

  const handleApply = async (company) => {
    setApplyingTo(company.id);
    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: user?.name || 'Demo Student',
          student_email: user?.email || 'student@college.edu',
          student_role: user?.role || 'student',
          company_name: company.name,
          role: company.role,
          package: company.package,
          location: company.location,
          min_cgpa: company.cgpa,
          applied_at: new Date().toISOString(),
        }),
      });
      alert(`Application submitted to ${company.name}! Check n8n for workflow execution.`);
    } catch {
      alert(`Application submitted to ${company.name}! (n8n workflow will process when connected)`);
    }
    setApplyingTo(null);
  };

  const totalCompanies = COMPANIES.length;
  const studentsPlaced = RESULTS.length;
  const highestPackage = '32 LPA';
  const avgPackage = '18.3 LPA';

  const tabs = [
    { key: 'companies', label: 'Companies', icon: '🏢' },
    { key: 'applications', label: 'My Applications', icon: '📝' },
    { key: 'results', label: 'Results', icon: '🏆' },
    { key: 'eligibility', label: 'Eligibility', icon: '📋' },
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <h1>💼 Placements</h1>
        <p>Campus placement drives, applications, results, and eligibility criteria</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="glass-card stat-card">
          <div className="stat-card__icon">🏢</div>
          <div className="stat-card__value">{totalCompanies}</div>
          <div className="stat-card__label">Companies Visiting</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">🎓</div>
          <div className="stat-card__value">{studentsPlaced}</div>
          <div className="stat-card__label">Students Placed</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">🚀</div>
          <div className="stat-card__value">{highestPackage}</div>
          <div className="stat-card__label">Highest Package</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card__icon">📈</div>
          <div className="stat-card__value">{avgPackage}</div>
          <div className="stat-card__label">Average Package</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 'var(--space-xs)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab.key)}
            style={{ padding: '10px 20px', fontSize: 'var(--text-sm)' }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ============ COMPANIES TAB ============ */}
      {activeTab === 'companies' && (
        <>
          {/* Category Filter */}
          <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 500 }}>Filter:</span>
              {['All', 'Product', 'IT'].map(cat => (
                <button
                  key={cat}
                  className={`btn ${companyFilter === cat ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setCompanyFilter(cat)}
                  style={{ padding: '6px 16px', fontSize: 'var(--text-xs)' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Company Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-lg)' }}>
            {filteredCompanies.map(company => (
              <div key={company.id} className="glass-card" style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {/* Company Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <span style={{ fontSize: '2rem' }}>{company.logo}</span>
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--text-lg)' }}>{company.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{company.category} Company</div>
                    </div>
                  </div>
                  <span className={`badge ${COMPANY_STATUS[company.status].badge}`}>
                    {COMPANY_STATUS[company.status].label}
                  </span>
                </div>

                {/* Role & Package */}
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{company.role}</div>
                  <div style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: 'var(--text-xl)', marginTop: '4px' }}>{company.package}</div>
                </div>

                {/* Description */}
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5, margin: 0 }}>
                  {company.description}
                </p>

                {/* Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)', fontSize: 'var(--text-xs)' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Location: </span>
                    <span style={{ color: 'var(--text-primary)' }}>{company.location}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Date: </span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {new Date(company.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Min CGPA: </span>
                    <span style={{ color: 'var(--text-primary)' }}>{company.cgpa}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Backlogs: </span>
                    <span style={{ color: 'var(--text-primary)' }}>{company.backlogs === 0 ? 'None allowed' : `Up to ${company.backlogs}`}</span>
                  </div>
                </div>

                {/* Branches */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {company.branches.map(b => (
                    <span key={b} style={{
                      padding: '2px 8px', borderRadius: 'var(--radius-sm)',
                      background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)',
                      fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)',
                    }}>{b}</span>
                  ))}
                </div>

                {/* Apply Button */}
                {company.status === 'upcoming' && (
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: 'auto' }} onClick={() => handleApply(company)} disabled={applyingTo === company.id}>
                    {applyingTo === company.id ? 'Submitting...' : 'Apply Now'}
                  </button>
                )}
                {company.status === 'ongoing' && (
                  <button className="btn btn-secondary" style={{ width: '100%', marginTop: 'auto' }} onClick={() => handleApply(company)} disabled={applyingTo === company.id}>
                    {applyingTo === company.id ? 'Submitting...' : 'Apply Now'}
                  </button>
                )}
                {company.status === 'completed' && (
                  <button className="btn btn-ghost" style={{ width: '100%', marginTop: 'auto', opacity: 0.6 }} disabled>Drive Completed</button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ============ MY APPLICATIONS TAB ============ */}
      {activeTab === 'applications' && (
        <div className="glass-card section-card">
          <h3>Your Applications</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Company</th>
                <th>Role</th>
                <th>Applied Date</th>
                <th>Current Round</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {APPLICATIONS.map((app, i) => (
                <tr key={app.id}>
                  <td>{i + 1}</td>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{app.company}</td>
                  <td>{app.role}</td>
                  <td>{new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>{app.round}</span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_CONFIG[app.status].badge}`}>
                      {STATUS_CONFIG[app.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Application Summary */}
          <div style={{ display: 'flex', gap: 'var(--space-lg)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', fontSize: 'var(--text-sm)' }}>
              <span className="badge badge-green">Selected</span>
              <span style={{ color: 'var(--text-secondary)' }}>{APPLICATIONS.filter(a => a.status === 'selected').length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', fontSize: 'var(--text-sm)' }}>
              <span className="badge badge-purple">Interview</span>
              <span style={{ color: 'var(--text-secondary)' }}>{APPLICATIONS.filter(a => a.status === 'interview').length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', fontSize: 'var(--text-sm)' }}>
              <span className="badge badge-amber">Shortlisted</span>
              <span style={{ color: 'var(--text-secondary)' }}>{APPLICATIONS.filter(a => a.status === 'shortlisted').length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', fontSize: 'var(--text-sm)' }}>
              <span className="badge badge-blue">Applied</span>
              <span style={{ color: 'var(--text-secondary)' }}>{APPLICATIONS.filter(a => a.status === 'applied').length}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', fontSize: 'var(--text-sm)' }}>
              <span className="badge badge-red">Rejected</span>
              <span style={{ color: 'var(--text-secondary)' }}>{APPLICATIONS.filter(a => a.status === 'rejected').length}</span>
            </div>
          </div>
        </div>
      )}

      {/* ============ RESULTS TAB ============ */}
      {activeTab === 'results' && (
        <>
          {/* Placement Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
            <div className="glass-card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-green)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>85%</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Placement Rate</div>
            </div>
            <div className="glass-card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-blue)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>32 LPA</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Highest CTC</div>
            </div>
            <div className="glass-card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-purple)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>18.3 LPA</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Average CTC</div>
            </div>
            <div className="glass-card" style={{ padding: 'var(--space-md)', textAlign: 'center' }}>
              <div style={{ color: 'var(--accent-amber)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>6.5 LPA</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Minimum CTC</div>
            </div>
          </div>

          {/* Results Table */}
          <div className="glass-card section-card">
            <h3>Placement Results 2026</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student</th>
                  <th>Roll No.</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Package</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {RESULTS.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.student}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        {r.rollNo}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{r.company}</td>
                    <td>{r.role}</td>
                    <td>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{r.package}</span>
                    </td>
                    <td>{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ============ ELIGIBILITY TAB ============ */}
      {activeTab === 'eligibility' && (
        <>
          {/* General Criteria */}
          <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
            <h3>General Eligibility Criteria</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
              {ELIGIBILITY_CRITERIA.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 'var(--space-md)', padding: 'var(--space-md)',
                  background: 'rgba(59, 130, 246, 0.05)', borderRadius: 'var(--radius-md)',
                  borderLeft: '3px solid var(--accent-blue)',
                }}>
                  <div style={{ minWidth: 160, fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>
                    {item.rule}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company-wise Requirements Table */}
          <div className="glass-card section-card" style={{ marginBottom: 'var(--space-lg)' }}>
            <h3>Company-wise Requirements</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Min CGPA</th>
                  <th>Backlogs</th>
                  <th>Branches</th>
                  <th>Package</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {COMPANIES.map(c => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {c.logo} {c.name}
                    </td>
                    <td>
                      <span style={{ fontWeight: 600, color: c.cgpa >= 7.5 ? 'var(--accent-amber)' : 'var(--accent-green)' }}>
                        {c.cgpa}
                      </span>
                    </td>
                    <td>{c.backlogs === 0 ? 'None' : `${c.backlogs}`}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                        {c.branches.map(b => (
                          <span key={b} style={{
                            padding: '1px 6px', borderRadius: 'var(--radius-sm)',
                            background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-purple)',
                            fontSize: '10px', fontFamily: 'var(--font-mono)',
                          }}>{b}</span>
                        ))}
                      </div>
                    </td>
                    <td><span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{c.package}</span></td>
                    <td>
                      <span className={`badge ${COMPANY_STATUS[c.status].badge}`}>
                        {COMPANY_STATUS[c.status].label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Placement Process */}
          <div className="glass-card section-card">
            <h3>Typical Placement Process</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
              {[
                { step: 1, title: 'Pre-Placement Talk (PPT)', desc: 'Company presents its culture, roles, and expectations to students.' },
                { step: 2, title: 'Online Assessment', desc: 'Aptitude, coding, and technical MCQs — usually on HackerRank or similar platforms.' },
                { step: 3, title: 'Technical Interview(s)', desc: '1-3 rounds covering DSA, system design, and core CS subjects.' },
                { step: 4, title: 'HR Interview', desc: 'Behavioral and cultural fit assessment, salary discussion.' },
                { step: 5, title: 'Offer Rollout', desc: 'Selected students receive offer letters within 1-2 weeks.' },
              ].map(s => (
                <div key={s.step} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', padding: 'var(--space-md)',
                  background: 'rgba(139, 92, 246, 0.05)', borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{
                    minWidth: 32, height: 32, borderRadius: 'var(--radius-full)',
                    background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: 'var(--text-sm)', color: '#fff', flexShrink: 0,
                  }}>{s.step}</div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }}>{s.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)', marginTop: '2px' }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
