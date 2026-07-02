import { useState, useRef, useEffect } from 'react';
import API from '../../services/api';

const QUICK_QUESTIONS = [
  'Suggest a healthy breakfast 🥗',
  'What fruits are available? 🍎',
  'High protein dairy products 💪',
  'Cheap vegetables under $2 🥦',
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: "Hi! 👋 I'm FreshMart's AI shopping assistant. Ask me anything about our products, recipes, or healthy eating tips!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const history = newMessages.slice(1).map(m => ({ role: m.role, content: m.content }));
      const { data } = await API.post('/ai/chat', { message: userMessage, history: history.slice(0, -1) });
      setMessages(prev => [...prev, { role: 'model', content: data.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting. Please try again! 🙏" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '56px', height: '56px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #22C55E, #16A34A)',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s, box-shadow 0.2s',
          fontSize: '24px'
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        title="AI Shopping Assistant"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '90px', right: '24px', zIndex: 999,
          width: '360px', maxHeight: '500px',
          background: '#fff', borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          display: 'flex', flexDirection: 'column',
          border: '1px solid #E5E7EB', overflow: 'hidden',
          animation: 'slideUp 0.2s ease-out'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{ fontSize: '24px' }}>🤖</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>FreshMart AI Assistant</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>Powered by Gemini AI ✨</div>
            </div>
            <div style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: '#86EFAC' }} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.role === 'user' ? 'linear-gradient(135deg, #22C55E, #16A34A)' : '#F3F4F6',
                  color: msg.role === 'user' ? '#fff' : '#111827',
                  fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: '4px', padding: '10px 14px', background: '#F3F4F6', borderRadius: '16px 16px 16px 4px', width: 'fit-content' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9CA3AF', animation: `bounce 1s infinite ${i * 0.2}s` }} />
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {QUICK_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} style={{
                  padding: '5px 10px', borderRadius: '20px', border: '1px solid #22C55E',
                  background: '#F0FDF4', color: '#16A34A', fontSize: '11px', cursor: 'pointer',
                  fontWeight: 500, transition: 'all 0.15s'
                }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: '9px 12px', borderRadius: '20px',
                border: '1px solid #E5E7EB', fontSize: '13px', outline: 'none',
                background: '#F9FAFB'
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: loading || !input.trim() ? '#E5E7EB' : 'linear-gradient(135deg, #22C55E, #16A34A)',
                border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                color: '#fff', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
      `}</style>
    </>
  );
};

export default ChatBot;
