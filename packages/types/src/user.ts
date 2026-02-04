export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  status: 'ONLINE' | 'OFFLINE' | 'AWAY' | 'DO_NOT_DISTURB';
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface UpdateUserInput {
  displayName?: string;
  avatar?: string;
  bio?: string;
  status?: 'ONLINE' | 'OFFLINE' | 'AWAY' | 'DO_NOT_DISTURB';
}
