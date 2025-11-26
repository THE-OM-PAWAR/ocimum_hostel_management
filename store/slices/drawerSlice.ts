import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define all possible page types
type PageType = 'hostels' | 'tenants' | 'settings' | 'dashboard' | 'tenants-details' | 'default';

// Define action types
type ActionType = 'navigation' | 'action' | 'info';

// Define action variants
type ActionVariant = 'default' | 'destructive' | 'outline' | 'ghost';

// Define action structure
interface DrawerAction {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: ActionVariant;
  disabled?: boolean;
  description?: string;
}

interface DrawerState {
  isOpen: boolean;
  page: PageType | null;
  content: {
    type: ActionType | null;
    title: string;
    description?: string;
    actions?: DrawerAction[];
    data?: any; // For storing any additional data needed by the drawer
  };
}

const initialState: DrawerState = {
  isOpen: false,
  page: null,
  content: {
    type: null,
    title: '',
    description: '',
    actions: [],
    data: null,
  },
};

import type { Slice } from '@reduxjs/toolkit';

const drawerSlice: Slice<DrawerState> = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state, action: PayloadAction<{
      page: PageType;
      content: {
        type: ActionType;
        title: string;
        description?: string;
        actions?: DrawerAction[];
        data?: any;
      };
    }>) => {
      state.isOpen = true;
      state.page = action.payload.page;
      state.content = action.payload.content;
    },
    closeDrawer: (state) => {
      state.isOpen = false;
      state.page = null;
      state.content = {
        type: null,
        title: '',
        description: '',
        actions: [],
        data: null,
      };
    },
    updateDrawerContent: (state, action: PayloadAction<{
      title?: string;
      description?: string;
      actions?: DrawerAction[];
      data?: any;
    }>) => {
      if (action.payload.title) state.content.title = action.payload.title;
      if (action.payload.description) state.content.description = action.payload.description;
      if (action.payload.actions) state.content.actions = action.payload.actions;
      if (action.payload.data) state.content.data = action.payload.data;
    },
  },
});

export const { openDrawer, closeDrawer, updateDrawerContent } = drawerSlice.actions;
export default drawerSlice.reducer; 