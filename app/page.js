'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Menu, 
  Settings,
  Sparkles,
  MessageSquare,
  Trash2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#0f172a',
  },
  sidebar: {
    width: '280px',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    backdropFilter: 'blur(12px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  sidebarTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  chatList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: '1px solid transparent',
  },
  chatItemActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(12px)',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '18px',
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  messageWrapper: {
    display: 'flex',
    gap: '12px',
    maxWidth: '80%',
  },
  messageUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  messageAI: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarUser: {
    backgroundColor: '#3b82f6',
  },
  avatarAI: {
    backgroundColor: '#8b5cf6',
  },
  messageContent: {
    padding: '12px 16px',
    borderRadius: '16px',
    lineHeight: '1.6',
  },
  messageContentUser: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: '4px',
  },
  messageContentAI: {
    backgroundColor: 'rgba(51, 65, 85, 0.8)',
    borderBottomLeftRadius: '4px',
  },
  inputContainer: {
    padding: '16px 24px',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(12px)',
  },
  inputWrapper: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    minHeight: '52px',
    maxHeight: '200px',
    transition: 'all 0.2s',
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    minHeight: '52px',
  },
  sendButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  newChatButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s',
    width: '100%',
    justifyContent: 'center',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: '16px',
    color: '#64748b',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '8px',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#94a3b8',
    animation: 'pulse 1.4s infinite both',
  },
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const savedChats = localStorage.getItem('groqChats');
    if (savedChats) {
      const parsed = JSON.parse(savedChats);
      setChats(parsed);
      if (parsed.length > 0) {
        setCurrentChatId(parsed[0].id);
        setMessages(parsed[0].messages);
      }
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('groqChats', JSON.stringify(chats));
    }
  }, [chats]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats([newChat, ...chats]);
    setCurrentChatId(newChat.id);
    setMessages([]);
    inputRef.current?.focus();
  };

  const switchChat = (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
    }
  };

  const deleteChat = (chatId, e) => {
    e.stopPropagation();
    const updatedChats = chats.filter(c => c.id !== chatId);
    setChats(updatedChats);
    if (currentChatId === chatId) {
      if (updatedChats.length > 0) {
        setCurrentChatId(updatedChats[0].id);
        setMessages(updatedChats[0].messages);
      } else {
        setCurrentChatId(null);
        setMessages([]);
      }
    }
  };

  const updateChatTitle = (chatId, firstMessage) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId && chat.title === 'New Chat') {
        const title = firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
        return { ...chat, title };
      }
      return chat;
    });
    setChats(updatedChats);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    let chatId = currentChatId;
    if (!chatId) {
      const newChat = {
        id: Date.now().toString(),
        title: 'New Chat',
        messages: [userMessage],
        createdAt: new Date().toISOString(),
      };
      setChats([newChat, ...chats]);
      setCurrentChatId(newChat.id);
      chatId = newChat.id;
    } else {
      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, messages: [...chat.messages, userMessage] };
        }
        return chat;
      });
      setChats(updatedChats);
    }

    if (chats.find(c => c.id === chatId)?.title === 'New Chat') {
      updateChatTitle(chatId, userMessage.content);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.content };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      const updatedChats2 = chats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, messages: finalMessages };
        }
        return chat;
      });
      setChats(updatedChats2);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: '⚠️ ' + (error.message || 'Sorry, I encountered an error. Please try again.') 
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div style={styles.container}>
      <motion.div 
        style={styles.sidebar}
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex"
      >
        <div style={styles.sidebarHeader}>
          <Bot size={28} style={{ color: '#3b82f6' }} />
          <span style={styles.sidebarTitle}>Groq Chat</span>
        </div>

        <button style={styles.newChatButton} onClick={createNewChat}>
          <MessageSquare size={18} />
          New Chat
        </button>

        <div style={{ ...styles.chatList, marginTop: '16px' }}>
          {chats.map((chat) => (
            <div
              key={chat.id}
              style={{
                ...styles.chatItem,
                ...(currentChatId === chat.id ? styles.chatItemActive : {}),
              }}
              onClick={() => switchChat(chat.id)}
            >
              <MessageSquare size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {chat.title}
              </span>
              <button
                onClick={(e) => deleteChat(chat.id, e)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      <div style={styles.mainContent}>
        <div style={styles.header}>
          <div style={styles.headerTitle}>
            <button 
              onClick={() => {}}
              className="md:hidden"
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <Menu size={24} />
            </button>
            <Bot size={24} style={{ color: '#3b82f6' }} />
            <span>Groq AI Assistant</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={createNewChat}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              <Sparkles size={20} />
            </button>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <div style={styles.messagesContainer}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <Bot size={64} style={{ color: '#3b82f6', opacity: 0.3 }} />
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#94a3b8' }}>
                Start a conversation
              </h2>
              <p style={{ textAlign: 'center', maxWidth: '400px', color: '#64748b' }}>
                Ask me anything! I'm powered by Groq's AI models.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  style={{
                    ...styles.messageWrapper,
                    ...(msg.role === 'user' ? styles.messageUser : styles.messageAI),
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div style={{
                    ...styles.avatar,
                    ...(msg.role === 'user' ? styles.avatarUser : styles.avatarAI),
                  }}>
                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                  </div>
                  <div>
                    <div style={{
                      ...styles.messageContent,
                      ...(msg.role === 'user' ? styles.messageContentUser : styles.messageContentAI),
                    }}>
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                      )}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', padding: '0 4px' }}>
                      {formatTime(new Date())}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {isLoading && (
            <motion.div
              style={styles.messageWrapper}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div style={{ ...styles.avatar, ...styles.avatarAI }}>
                <Bot size={18} />
              </div>
              <div style={styles.typingIndicator}>
                <div style={{ ...styles.typingDot, animationDelay: '0s' }} />
                <div style={{ ...styles.typingDot, animationDelay: '0.2s' }} />
                <div style={{ ...styles.typingDot, animationDelay: '0.4s' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputContainer}>
          <div style={styles.inputWrapper}>
            <textarea
              ref={inputRef}
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              style={{
                ...styles.sendButton,
                ...((!input.trim() || isLoading) ? styles.sendButtonDisabled : {}),
              }}
            >
              <Send size={18} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}