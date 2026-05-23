import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CandidateState {
  selectedCandidateId: string | null;
  searchTerm: string;
  activeFilters: Record<string, string[]>;
  selectedRows: string[];
  setSearchTerm: (term: string) => void;
  setFilters: (filters: Record<string, string[]>) => void;
  clearFilters: () => void;
  setSelectedCandidateId: (id: string | null) => void;
  toggleSelectedRow: (id: string) => void;
  clearSelectedRows: () => void;
}

export const useCandidateStore = create<CandidateState>()(
  devtools(
    persist(
      (set) => ({
        selectedCandidateId: null,
        searchTerm: '',
        activeFilters: {},
        selectedRows: [],

        setSearchTerm: (term) => set(
          { searchTerm: term },
          false,
          'setSearchTerm'
        ),

        setFilters: (filters) => set(
          { activeFilters: filters },
          false,
          'setFilters'
        ),

        clearFilters: () => set(
          { activeFilters: {}, searchTerm: '' },
          false,
          'clearFilters'
        ),

        setSelectedCandidateId: (id) => set(
          { selectedCandidateId: id },
          false,
          'setSelectedCandidateId'
        ),

        toggleSelectedRow: (id) => set(
          (state) => ({
            selectedRows: state.selectedRows.includes(id)
              ? state.selectedRows.filter((rowId) => rowId !== id)
              : [...state.selectedRows, id],
          }),
          false,
          'toggleSelectedRow'
        ),

        clearSelectedRows: () => set(
          { selectedRows: [] },
          false,
          'clearSelectedRows'
        ),
      }),
      {
        name: 'candidate-storage',
        partialize: (state) => ({
          searchTerm: state.searchTerm,
          activeFilters: state.activeFilters,
          selectedCandidateId: state.selectedCandidateId,
        }),
      }
    ),
    { name: 'CandidateStore' }
  )
);
