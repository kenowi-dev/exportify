import type {SavedAlbum} from '$lib/types/spotify';
import type {AlbumStore, StoreError} from '$lib/types/library-stores';
import {writable} from 'svelte/store';

function createStore() {
    const data: AlbumStore = {albums: [], total: 0, loading: false, updated: null, error: null};
    const {subscribe, update} = writable(data);
    return {
        subscribe,
        addAlbums: (albums: SavedAlbum[]) => update((s) => ({...s, albums: [...s.albums, ...albums]})),
        addAlbum: (album: SavedAlbum) => update((s) => ({...s, albums: [...s.albums, album]})),
        setTotal: (total: number) => update((s) => ({...s, total: total})),
        startLoading: () => update(() => ({...data, loading: true})),
        stopLoading: () => update((s) => ({...s, loading: false, updated: new Date(Date.now())})),
        setError: (e: StoreError | null) => update((s) => ({...s, error: e}))
    };
}

export const albums = createStore();
