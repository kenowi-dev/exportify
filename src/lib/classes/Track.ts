import { Album } from './Album';
import { Artist } from './Artist';
import { ExternalId } from './ExternalId';
import { ExternalUrl } from './ExternalUrl';
import { TrackLink } from './TrackLink';
import { User } from './User';

export class Track implements SpotifyData {
	// Playlist Track
	added_by?: User;
	is_local?: boolean;

	// Saved Track
	added_at?: string;

	// Track Full
	album?: Album;
	external_ids?: ExternalId;
	popularity?: number;

	// Track Simplified
	artists!: Artist[];
	available_markets?: string[];
	disc_number!: number;
	duration_ms!: number;
	explicit!: boolean;
	external_urls!: ExternalUrl;
	href!: string;
	id!: string;
	is_playable?: boolean;
	linked_from?: TrackLink;
	name!: string;
	preview_url!: string;
	track_number!: number;
	type!: 'track' | 'episode';
	uri!: string;

	private constructor() {}

	public static fromPlaylistTrack(pt: SpotifyApi.PlaylistTrackObject): Track {
		// The js api differs between TrackObject and Episode Object.
		// The spotify api does not do that (anymore?).
		// An episode has the same fields as a track.
		// Just the track type and album type are different.
		// track.type = "episode"; album.type = "show"
		const track = Track.fromFullTrack(pt.track as SpotifyApi.TrackObjectFull);
		track.added_at = pt.added_at;
		track.added_by = User.fromPublicUser(pt.added_by);
		track.is_local = pt.is_local;
		return track;
	}

	public static fromSavedTrack(saved: SpotifyApi.SavedTrackObject): Track {
		const track = Track.fromFullTrack(saved.track);
		track.added_at = saved.added_at;
		return track;
	}

	public static fromFullTrack(full: SpotifyApi.TrackObjectFull): Track {
		const track = Track.fromSimplifiedTrack(full);
		track.album =  Album.fromSimplifiedAlbum(full.album);
		track.external_ids = ExternalId.fromExternalIdObject(full.external_ids);
		track.popularity = full.popularity;
		return track;
	}

	public static fromSimplifiedTrack(simplified: SpotifyApi.TrackObjectSimplified): Track {
		const track = new Track();
		track.artists = simplified.artists.map((a) => Artist.fromSimplifiedArtist(a));
		track.available_markets = simplified.available_markets;
		track.disc_number = simplified.disc_number;
		track.duration_ms = simplified.duration_ms;
		track.explicit = simplified.explicit;
		track.external_urls = ExternalUrl.fromExternalUrlObject(simplified.external_urls);
		track.href = simplified.href;
		track.id = simplified.id;
		track.is_playable = simplified.is_playable;
		track.linked_from =
			simplified.linked_from && TrackLink.fromTrackLinkObject(simplified.linked_from);
		track.name = simplified.name;
		track.preview_url = simplified.preview_url;
		track.track_number = simplified.track_number;
		track.type = simplified.type;
		track.uri = simplified.uri;
		return track;
	}
}