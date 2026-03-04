import { create } from "zustand";
import {
  fetchUserRequests,
  fetchPendingUploads,
  uploadMedia,
  changeMediaStatus,
} from "../api/mediaRequestService";

const useMediaRequestStore = create((set) => ({
  mediaRequests: [],
  pendingUploads: [],

  fetchUserRequests: async () => {
    const data = await fetchUserRequests();
    set({ mediaRequests: data });
  },

  fetchPendingUploads: async () => {
    const data = await fetchPendingUploads();
    set({ pendingUploads: data });
  },

  uploadMedia: async (requestId, file) => {
    await uploadMedia(requestId, file);
    set((state) => ({
      pendingUploads: state.pendingUploads.filter((r) => r._id !== requestId),
    }));
  },

  changeStatus: async (requestId, status) => {
    await changeMediaStatus(requestId, status);
    set((state) => ({
      mediaRequests: state.mediaRequests.map((r) =>
        r._id === requestId ? { ...r, status } : r
      ),
    }));
  },
}));

export default useMediaRequestStore;
