import type {Playlist} from "$lib/types/spotify";
import type {PlaylistStore, StoreError} from "$lib/types/library-stores";
import {writable} from "svelte/store";


function createStore() {
    const data: PlaylistStore = {playlists: [], total: 0, loading: false, updated: null, error: null};
    const {subscribe, set, update} = writable(data);
    return {
        subscribe,
        addPlaylists: (playlists: Playlist[]) => update(s => ({...s, playlists: [...s.playlists, ...playlists]})),
        addPlaylist: (playlist: Playlist) => update(s => ({...s, playlists: [...s.playlists, playlist]})),
        setTotal: (total: number) => update(s => ({...s, total: total})),
        startLoading: () => update(_ => ({...data, loading: true})),
        stopLoading: () => update(s => ({...s, loading: false, updated: new Date(Date.now())})),
        setError: (e: StoreError | null) => update(s => ({...s, error: e})),
        reset: () => set(data)
    };
}

export const playlists = createStore();

