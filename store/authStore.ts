import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Business } from '@/lib/db/schema/businesses';
import { UserRolesPermissions } from '@/lib/helpers/types';

interface AuthState {
  userRolesPermissions: UserRolesPermissions | null;
  authenticated: {
    isAuthenticated: boolean;
    loggedInUserEmail: string | null;
  };
  authorize: (userRolesPermissions: UserRolesPermissions) => void;
  authenticate: (userEmail: string) => void;
  registeredBusiness: Business | null;
  updateRegisteredBusiness: (business: Business | null) => void;
  updateUserRolesPermissions: (userRolesPermissions: UserRolesPermissions) => void;
  logout: () => void;
}

const initialAuthState = {
  userRolesPermissions: null,
  authenticated: { isAuthenticated: false, loggedInUserEmail: null },
  registeredBusiness: null,
} as const;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialAuthState,

      authorize: (urp) =>
        set({ userRolesPermissions: urp }),

      authenticate: (email) =>
        set({
          authenticated: {
            isAuthenticated: true,
            loggedInUserEmail: email,
          },
        }),

      updateRegisteredBusiness: (business) =>
        set((state) => ({
          ...state,
          registeredBusiness: business === null ? null : {
            ...state.registeredBusiness,
            ...business,
          },
        })),

      updateUserRolesPermissions: (userRolesPermissions) =>
        set({ userRolesPermissions }),


      logout: () => {
        set(initialAuthState);
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
