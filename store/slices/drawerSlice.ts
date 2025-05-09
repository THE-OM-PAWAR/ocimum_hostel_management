import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PageType = 'blocks' | 'tenants' | 'payments' | 'settings';

interface DrawerState {
  isOpen: boolean;
  page: PageType | null;
  content: {
    type: 'action' | 'info' | null;
    title: string;
    description?: string;
    actions?: {
      label: string;
      onClick: () => void;
      variant?: 'default' | 'destructive' | 'outline';
    }[];
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
  },
};

const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (state, action: PayloadAction<{
      page: PageType;
      content: {
        type: 'action' | 'info';
        title: string;
        description?: string;
        actions?: {
          label: string;
          onClick: () => void;
          variant?: 'default' | 'destructive' | 'outline';
        }[];
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
      };
    },
  },
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice.reducer; 