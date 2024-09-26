import {create} from 'zustand';
import axios from 'axios';
import apis from "../app/apis/apis"; 

const useStore = create((set) => ({
    users: [],
    loading: false,
    error: null,
    fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(apis.getAllFile);
            set({ users: response.data, loading: false });
        } catch (error) {
            set({ loading: false, error: error.message });
        }
    },
}));

 export default useStore;
