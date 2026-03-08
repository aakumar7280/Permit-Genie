import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUp, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import { permitsAPI } from '../services/api';

const PublicPermitSearch = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-search if ?q= param is present (e.g. from landing page)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q && messages.length === 0) {
      handleSend(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const popularSearches = [
    'I want to open a restaurant',
    'Renovating my home',
    'Starting a food truck',
    'Building a deck',
    'Opening a daycare',
    'Setting up a retail store',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (text = query) => {
    if (!text.trim() || loading) return;

    const userMessage = text.trim();
    setQuery('');

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    const updatedHistory = [...chatHistory, { role: 'user', content: userMessage }];
    setChatHistory(updatedHistory);

    setLoading(true);

    try {
      const response = await permitsAPI.chatPermits(updatedHistory, 8);

      const assistantMsg = {
        role: 'assistant',
        content: response.message || 'Here are some permits that might be relevant:',
        permits: response.permits || [],
        aiPowered: response.aiPowered || false,
      };

      setMessages(prev => [...prev, assistantMsg]);
      setChatHistory(prev => [...prev, { role: 'assistant', content: assistantMsg.content }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I had trouble processing that. Could you try rephrasing your question?',
        permits: [],
        aiPowered: false,
      }]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleSuggestionClick = (suggestion) => {
    handleSend(suggestion);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" style={{ backgroundColor: '#191919' }}>
      {/* Grainy Background Texture */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }}
      />

      <Header />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 pt-16" style={{ height: 'calc(100vh - 0px)' }}>

        {/* Empty State - Centered */}
        {!hasMessages && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-full max-w-3xl flex flex-col items-center">
              {/* Title */}
              <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(241,80,37,0.1)', border: '1px solid rgba(241,80,37,0.25)' }}>
                  <Sparkles size={16} style={{ color: '#F15025' }} />
                  <span className="text-sm font-medium" style={{ color: '#F15025' }}>AI-Powered Permit Assistant</span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-3">
                  What are you planning to do?
                </h1>
                <p style={{ color: '#CED0CE' }} className="text-lg">
                  Describe your project and I'll find the permits you need
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full mb-8">
                <form onSubmit={handleSubmit}>
                  <div className="relative group">
                    <textarea
                      ref={textareaRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      placeholder="e.g. I want to open a bakery in downtown Toronto..."
                      rows="2"
                      className="w-full px-6 py-4 pr-14 backdrop-blur-sm rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 text-base resize-none transition-all duration-200 shadow-lg"
                      style={{ backgroundColor: '#222222', border: '1px solid #333', minHeight: '72px', maxHeight: '200px' }}
                      onFocus={e => { e.target.style.borderColor = '#F15025'; e.target.style.boxShadow = '0 0 0 2px rgba(241,80,37,0.3)'; }}
                      onBlur={e => { e.target.style.borderColor = '#333'; e.target.style.boxShadow = 'none'; }}
                    />
                    <button
                      type="submit"
                      disabled={!query.trim()}
                      className="absolute right-3 bottom-3 w-10 h-10 flex items-center justify-center disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50"
                      style={{ backgroundColor: query.trim() ? '#F15025' : '#333' }}
                    >
                      <ArrowUp size={20} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Suggestions */}
              <div className="w-full">
                <p className="text-sm text-gray-500 mb-3 text-center">Try something like:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="px-4 py-2 backdrop-blur-sm rounded-full text-sm transition-all duration-200"
                      style={{ backgroundColor: '#222222', border: '1px solid #333', color: '#CED0CE' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#F15025'; e.currentTarget.style.color = 'white'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#CED0CE'; }}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chat Messages Area */}
        {(hasMessages || loading) && (
          <>
            <div className="flex-1 overflow-y-auto px-6 pt-8 pb-4">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx}>
                    {msg.role === 'user' ? (
                      /* User Message */
                      <div className="flex justify-end">
                        <div className="max-w-[75%]">
                          <div className="rounded-2xl rounded-tr-md px-5 py-3 shadow-lg" style={{ backgroundColor: '#F15025' }}>
                            <p className="text-white text-sm leading-relaxed">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Assistant Message */
                      <div className="flex justify-start">
                        <div className="max-w-[90%]">
                          {/* AI avatar + message text */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(241,80,37,0.15)', border: '1px solid rgba(241,80,37,0.3)' }}>
                              <Sparkles size={14} style={{ color: '#F15025' }} />
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1" style={{ color: '#F15025' }}>Permit Genie</p>
                              <p className="text-base leading-relaxed" style={{ color: '#E6E8E6' }}>{msg.content}</p>
                            </div>
                          </div>

                          {/* Permit Cards */}
                          {msg.permits && msg.permits.length > 0 && (
                            <div className="ml-11 space-y-3">
                              {msg.permits.map((permit) => (
                                <div
                                  key={permit.id}
                                  className="rounded-xl p-4 transition-all duration-200 shadow-md"
                                  style={{ backgroundColor: '#222222', border: '1px solid #333' }}
                                  onMouseEnter={e => e.currentTarget.style.borderColor = '#444'}
                                  onMouseLeave={e => e.currentTarget.style.borderColor = '#333'}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-base font-semibold text-white">{permit.name}</h4>
                                    {permit.relevanceScore && (
                                      <span className="px-2 py-1 text-xs rounded-lg font-medium flex-shrink-0 ml-3" style={{ backgroundColor: 'rgba(241,80,37,0.15)', color: '#F15025', border: '1px solid rgba(241,80,37,0.3)' }}>
                                        {Math.round(permit.relevanceScore)}%
                                      </span>
                                    )}
                                  </div>

                                  {permit.category && (
                                    <span className="inline-block px-2 py-1 text-xs rounded-md mb-2" style={{ backgroundColor: '#2d2d2d', color: '#CED0CE', border: '1px solid #444' }}>
                                      {permit.category}
                                    </span>
                                  )}

                                  {permit.aiReason && (
                                    <p className="text-sm mb-3 leading-relaxed" style={{ color: '#CED0CE' }}>
                                      {permit.aiReason}
                                    </p>
                                  )}

                                  {!permit.aiReason && permit.description && (
                                    <p className="text-sm mb-3 leading-relaxed line-clamp-2" style={{ color: '#CED0CE' }}>
                                      {permit.description}
                                    </p>
                                  )}

                                  <div className="flex gap-2">
                                    {permit.url && (
                                      <a
                                        href={permit.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-1.5 text-white rounded-lg transition-colors duration-200 text-xs font-medium hover:opacity-90"
                                        style={{ backgroundColor: '#F15025' }}
                                      >
                                        View Details
                                      </a>
                                    )}
                                    <Link
                                      to="/signup"
                                      className="px-4 py-1.5 text-white rounded-lg transition-colors duration-200 text-xs font-medium"
                                      style={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }}
                                    >
                                      Sign Up to Apply
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(241,80,37,0.15)', border: '1px solid rgba(241,80,37,0.3)' }}>
                        <Sparkles size={14} className="animate-pulse" style={{ color: '#F15025' }} />
                      </div>
                      <div className="rounded-2xl rounded-tl-md px-5 py-3" style={{ backgroundColor: '#222222', border: '1px solid #333' }}>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#F15025', animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#F15025', animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: '#F15025', animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-sm" style={{ color: '#CED0CE' }}>Analyzing your request...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Bottom Input Bar */}
            <div className="flex-shrink-0 px-6 pb-6 pt-3" style={{ borderTop: '1px solid #2a2a2a' }}>
              <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                  <div className="relative group">
                    <textarea
                      ref={textareaRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      placeholder="Tell me more about your project..."
                      rows="1"
                      disabled={loading}
                      className="w-full px-6 py-4 pr-14 backdrop-blur-sm rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 text-base resize-none transition-all duration-200 shadow-lg disabled:opacity-50"
                      style={{ backgroundColor: '#222222', border: '1px solid #333', minHeight: '56px', maxHeight: '150px' }}
                      onFocus={e => { e.target.style.borderColor = '#F15025'; e.target.style.boxShadow = '0 0 0 2px rgba(241,80,37,0.3)'; }}
                      onBlur={e => { e.target.style.borderColor = '#333'; e.target.style.boxShadow = 'none'; }}
                    />
                    <button
                      type="submit"
                      disabled={!query.trim() || loading}
                      className="absolute right-3 bottom-3 w-10 h-10 flex items-center justify-center disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50"
                      style={{ backgroundColor: query.trim() && !loading ? '#F15025' : '#333' }}
                    >
                      <ArrowUp size={20} />
                    </button>
                  </div>
                </form>
                <p className="text-center text-xs mt-2" style={{ color: '#555' }}>
                  Permit Genie uses AI to suggest relevant permits. Always verify with the City of Toronto.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicPermitSearch;
