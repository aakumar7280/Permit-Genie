import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Plus, Clock, CheckCircle, XCircle, AlertCircle, ExternalLink, Trash2, Bookmark, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import { authAPI, applicationsAPI, savedPermitsAPI } from '../services/api';

const MyApplications = () => {
  const user = authAPI.getCurrentUser();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [savedPermits, setSavedPermits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('saved'); // saved | in_progress | approved

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [appRes, savedRes] = await Promise.all([
        applicationsAPI.getApplications(),
        savedPermitsAPI.getSavedPermits(),
      ]);
      if (appRes.success) setApplications(appRes.applications);
      if (savedRes.success) setSavedPermits(savedRes.savedPermits);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApp = async (id) => {
    if (!window.confirm('Delete this draft application?')) return;
    try {
      await applicationsAPI.deleteApplication(id);
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleUnsave = async (permitId) => {
    try {
      await savedPermitsAPI.unsavePermit(permitId);
      setSavedPermits(prev => prev.filter(s => s.permitId !== permitId));
    } catch (err) {
      console.error('Unsave failed:', err);
    }
  };

  // Derived lists
  const inProgressApps = applications.filter(a => ['draft', 'submitted', 'in_review'].includes(a.status));
  const approvedApps = applications.filter(a => ['approved', 'rejected'].includes(a.status));

  const statusConfig = {
    draft: { label: 'Draft', color: '#CED0CE', bg: 'rgba(206,208,206,0.1)', border: 'rgba(206,208,206,0.3)', icon: FileText },
    submitted: { label: 'Submitted', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.3)', icon: Clock },
    in_review: { label: 'In Review', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', icon: AlertCircle },
    approved: { label: 'Approved', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', icon: CheckCircle },
    rejected: { label: 'Rejected', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', icon: XCircle },
  };

  const tabs = [
    { key: 'saved', label: 'Saved', count: savedPermits.length, icon: Bookmark },
    { key: 'in_progress', label: 'In Progress', count: inProgressApps.length, icon: Clock },
    { key: 'approved', label: 'Completed', count: approvedApps.length, icon: CheckCircle },
  ];

  const EmptyState = ({ icon: Icon, title, subtitle }) => (
    <div className="rounded-2xl p-12 text-center" style={{ backgroundColor: '#222222', border: '1px solid #333' }}>
      <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(241,80,37,0.1)', border: '1px solid rgba(241,80,37,0.25)' }}>
        <Icon size={24} style={{ color: '#F15025' }} />
      </div>
      <h2 className="text-lg font-semibold text-white mb-2">{title}</h2>
      <p className="text-sm max-w-md mx-auto mb-6" style={{ color: '#CED0CE' }}>{subtitle}</p>
      <Link
        to="/search"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#F15025' }}
      >
        <Plus size={16} />
        Find Permits
      </Link>
    </div>
  );

  // ── Application card (reused by In Progress & Completed tabs) ──
  const AppCard = ({ app }) => {
    const status = statusConfig[app.status] || statusConfig.draft;
    const StatusIcon = status.icon;
    return (
      <div
        className="rounded-xl p-5 transition-all duration-200"
        style={{ backgroundColor: '#222222', border: '1px solid #333' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#444'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-lg font-semibold text-white">{app.permit?.name || 'Unknown Permit'}</h3>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: status.bg, color: status.color, border: `1px solid ${status.border}` }}
              >
                <StatusIcon size={12} />
                {status.label}
              </span>
            </div>
            <p className="text-sm mb-1" style={{ color: '#CED0CE' }}>{app.permit?.category}</p>
            {app.businessName && <p className="text-sm mb-1" style={{ color: '#888' }}>Business: {app.businessName}</p>}
            {app.propertyAddress && <p className="text-sm mb-1" style={{ color: '#888' }}>Property: {app.propertyAddress}</p>}
            <p className="text-xs" style={{ color: '#888' }}>
              {app.submittedAt ? `Submitted: ${new Date(app.submittedAt).toLocaleDateString()}` : `Created: ${new Date(app.createdAt).toLocaleDateString()}`}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {app.permit?.url && (
              <a
                href={app.permit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                style={{ backgroundColor: '#2d2d2d', color: '#CED0CE', border: '1px solid #444' }}
              >
                <ExternalLink size={12} />
                View Permit
              </a>
            )}
            {app.status === 'draft' && (
              <button
                onClick={() => handleDeleteApp(app.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-red-500/10"
                style={{ color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#191919' }}>
      <Header />

      <div className="pt-24 px-6 pb-12 max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My Applications</h1>
            <p style={{ color: '#CED0CE' }}>
              {user?.firstName ? `Hi ${user.firstName}, ` : ''}track your saved permits and applications.
            </p>
          </div>
          <Link
            to="/search"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: '#F15025' }}
          >
            <Plus size={18} />
            Find New Permits
          </Link>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ backgroundColor: '#222222', border: '1px solid #333' }}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: isActive ? '#F15025' : 'transparent',
                  color: isActive ? 'white' : '#888',
                }}
              >
                <TabIcon size={15} />
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className="px-1.5 py-0.5 rounded-full text-[11px] font-semibold"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#333',
                      color: isActive ? 'white' : '#888',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Content ── */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-600 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* ── Saved Tab ── */}
            {activeTab === 'saved' && (
              savedPermits.length === 0 ? (
                <EmptyState
                  icon={Bookmark}
                  title="No saved permits"
                  subtitle="Save permits from the search page so you can come back and apply for them later."
                />
              ) : (
                <div className="space-y-4">
                  {savedPermits.map(saved => (
                    <div
                      key={saved.id}
                      className="rounded-xl p-5 transition-all duration-200"
                      style={{ backgroundColor: '#222222', border: '1px solid #333' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#444'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Bookmark size={16} style={{ color: '#F15025' }} fill="#F15025" />
                            <h3 className="text-lg font-semibold text-white">{saved.permit?.name}</h3>
                          </div>
                          <p className="text-sm mb-1" style={{ color: '#CED0CE' }}>{saved.permit?.category}</p>
                          {saved.permit?.description && (
                            <p className="text-sm line-clamp-2 mb-1" style={{ color: '#888' }}>
                              {saved.permit.description}
                            </p>
                          )}
                          <p className="text-xs" style={{ color: '#666' }}>
                            Saved: {new Date(saved.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => navigate(`/apply/${saved.permitId}`, { state: { permit: saved.permit } })}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: '#F15025' }}
                          >
                            Apply Now
                            <ArrowRight size={12} />
                          </button>
                          {saved.permit?.url && (
                            <a
                              href={saved.permit.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                              style={{ backgroundColor: '#2d2d2d', color: '#CED0CE', border: '1px solid #444' }}
                            >
                              <ExternalLink size={12} />
                              Details
                            </a>
                          )}
                          <button
                            onClick={() => handleUnsave(saved.permitId)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-red-500/10"
                            style={{ color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}
                            title="Remove from saved"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* ── In Progress Tab ── */}
            {activeTab === 'in_progress' && (
              inProgressApps.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="No applications in progress"
                  subtitle="Start a new application from your saved permits or search for one."
                />
              ) : (
                <div className="space-y-4">
                  {inProgressApps.map(app => <AppCard key={app.id} app={app} />)}
                </div>
              )
            )}

            {/* ── Completed Tab ── */}
            {activeTab === 'approved' && (
              approvedApps.length === 0 ? (
                <EmptyState
                  icon={CheckCircle}
                  title="No completed applications"
                  subtitle="Applications that have been approved or rejected will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {approvedApps.map(app => <AppCard key={app.id} app={app} />)}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
