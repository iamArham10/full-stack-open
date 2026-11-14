import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
    addAnecdotes,
    getAnecdotes,
    updateAnecdotes,
    deleteAnecdote,
} from "./service/anecdotes";

const useNotificationStore = create((set) => ({
    notification: null,
    actions: {
        setNotification: (notification, time = 3000) =>
            set(() => {
                setTimeout(() => {
                    set(() => ({ notification: null }));
                }, time);
                return { notification };
            }),
    },
}));

const useAnecdoteStore = create((set, get) => ({
    anecdotes: [],
    filter: "",
    actions: {
        initialize: async () => {
            const anecdotes = await getAnecdotes();
            set(() => ({ anecdotes }));
        },
        vote: async (id) => {
            const anecdote = get().anecdotes.find((a) => a.id === id);
            const updatedAnecdote = await updateAnecdotes({
                ...anecdote,
                votes: anecdote.votes + 1,
            });
            set((state) => {
                return {
                    anecdotes: state.anecdotes.map((a) =>
                        a.id === id ? updatedAnecdote : a,
                    ),
                };
            });
        },
        add: async (content) => {
            const newAnecdote = await addAnecdotes(content);
            set((state) => ({ anecdotes: [...state.anecdotes, newAnecdote] }));
        },
        remove: async (id) => {
            const anecdote = get().anecdotes.find((a) => a.id === id);
            if (anecdote) {
                await deleteAnecdote(anecdote.id);
                // remove anecdote from state
                set((state) => ({
                    anecdotes: state.anecdotes.filter(
                        (a) => a.id !== anecdote.id,
                    ),
                }));
            }
        },
        setFilter: (filter) => set({ filter: filter }),
    },
}));

const useAnecdotes = () => {
    const { anecdotes, filter } = useAnecdoteStore(
        useShallow((state) => ({
            anecdotes: state.anecdotes,
            filter: state.filter,
        })),
    );

    const normalizedFilter = filter.trim().toLowerCase();
    const filteredAnecdotes =
        normalizedFilter !== ""
            ? anecdotes.filter((a) =>
                  a.content.toLowerCase().includes(normalizedFilter),
              )
            : anecdotes;

    return {
        filter,
        anecdotes: filteredAnecdotes,
    };
};

const useAnecdotesActions = () => useAnecdoteStore((state) => state.actions);

const useNotification = () =>
    useNotificationStore((state) => state.notification);

const useNotificationActions = () =>
    useNotificationStore((state) => state.actions);

export {
    useAnecdoteStore,
    useAnecdotesActions,
    useAnecdotes,
    useNotification,
    useNotificationStore,
    useNotificationActions,
};
