import { create } from 'zustand';

interface VerifyEmailStore {
  isVerified: boolean;

  setVerified: (isVerified: boolean) => void;

  resetVerified: () => void;
}

const verifyEmailStore = create<VerifyEmailStore>((set) => ({
  isVerified: false,

  setVerified: (isVerified: boolean) => set((state) => ({ ...state, isVerified })),

  resetVerified: () =>
    set((state) => ({
      isVerified: false,
    })),
}));

export default verifyEmailStore;
