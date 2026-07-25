// Simple, clean chat theme
export const simpleTheme = {
  // Colors
  primary: '#6366f1', // Soft indigo
  primaryLight: '#eef2ff',

  // Backgrounds
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',

  // Messages
  sentMessage: '#6366f1',
  sentMessageText: '#ffffff',
  receivedMessage: '#f1f5f9',
  receivedMessageText: '#1e293b',

  // Text
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textLight: '#94a3b8',

  // Borders
  border: '#e2e8f0',

  // Status
  online: '#22c55e', // Green

  // Spacing
  radius: '12px',
  radiusSm: '8px',
} as const;

export default simpleTheme;
