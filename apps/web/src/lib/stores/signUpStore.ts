import { create } from 'zustand';

// Wizard state store (expand as needed)
interface SignUpState {
  step: number;
  setStep: (step: number) => void;
  // Add more fields as needed for form data
}

export const useSignUpStore = create<SignUpState>(set => ({
  step: 1,
  setStep: step => set({ step }),
})); 