import { create } from "zustand";

interface AppState {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;

  isRenameModalOpen: boolean;
  setIsRenameModalOpen: (isOpen: boolean) => void;

  fileId: string | null;
  setFileId: (id: string) => void;

  fileName: string | null;
  setFileName: (name: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  fileId: null,
  setFileId: (id) => set({ fileId: id }),

  fileName: "",
  setFileName: (name) => set({ fileName: name }),

  isDeleteModalOpen: false,
  setIsDeleteModalOpen: (isOpen) => set({ isDeleteModalOpen: isOpen }),

  isRenameModalOpen: false,
  setIsRenameModalOpen: (isOpen) => set({ isRenameModalOpen: isOpen }),
}));
