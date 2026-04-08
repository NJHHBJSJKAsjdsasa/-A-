import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Conversation {
  _id: string;
  type: 'private' | 'group';
  participants: { _id: string; nickname: string; avatar: string }[];
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: string;
  };
}

interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  type: string;
  content: string;
  createdAt: string;
}

interface MessageState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  unreadCount: number;
  typing: Record<string, boolean>;
}

const initialState: MessageState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  unreadCount: 0,
  typing: {}
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    setTyping: (state, action: PayloadAction<{ conversationId: string; isTyping: boolean }>) => {
      state.typing[action.payload.conversationId] = action.payload.isTyping;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    }
  }
});

export const { 
  setConversations, 
  setCurrentConversation, 
  addMessage, 
  setMessages,
  setTyping,
  setUnreadCount 
} = messageSlice.actions;
export default messageSlice.reducer;
