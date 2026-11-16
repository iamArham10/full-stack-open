import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { addAnecdote, getAnecdotes, updateAnecdote } from "./requests";

export const useAnecdotes = () => {
    const queryClient = useQueryClient();

    const result = useQuery({
        queryKey: ["anecdotes"],
        queryFn: getAnecdotes,
        refetchOnWindowFocus: false,
    });

    const updateAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (updatedAnecdote) => {
            const anecdotes = queryClient.getQueryData(["anecdotes"]);
            queryClient.setQueryData(
                ["anecdotes"],
                anecdotes.map((a) =>
                    a.id === updatedAnecdote.id ? updatedAnecdote : a,
                ),
            );
        },
    });

    const addAnecdoteMutation = useMutation({
        mutationFn: addAnecdote,
        onSuccess: (newAnecdote) => {
            const anecdotes = queryClient.getQueryData(["anecdotes"]);
            queryClient.setQueryData(
                ["anecdotes"],
                anecdotes.concat(newAnecdote),
            );
        },
    });

    return {
        anecdotes: result.data,
        isPending: result.isPending,
        addAnecdote: (content) =>
            addAnecdoteMutation.mutate({ content, votes: 0 }),
        updateAnecdote: (anecdote) =>
            updateAnecdoteMutation.mutate({
                ...anecdote,
                votes: anecdote.votes + 1,
            }),
    };
};
