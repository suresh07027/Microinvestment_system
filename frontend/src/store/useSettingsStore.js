import { create } from 'zustand'

const useSettingsStore = create((set) => ({
  enabled: true,
  roundLevel: 10,
  minAmount: 5,
  maxAmount: 100,
  savedMessage: '',

  updateSettings: (newSettings) =>
    set({ ...newSettings, savedMessage: 'Settings saved!' }),

  clearMessage: () => set({ savedMessage: '' }),
}))

export default useSettingsStore