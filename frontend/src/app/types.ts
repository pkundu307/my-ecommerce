export interface UserState {
    user: {
      id: string;
      name: string;
      email: string;
    } | null;
  }

export interface RootState {
    user: UserState;
  }