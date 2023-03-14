package de.wittenbude.expandify.services.spotifyapi;

import org.apache.hc.core5.http.ParseException;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.requests.IRequest;
import se.michaelthelin.spotify.requests.data.IPagingRequestBuilder;

import java.io.IOException;

public interface SpotifyApiPagingRequestCaller<T, BT extends IPagingRequestBuilder<T,  BT>> {
    BT callApi(SpotifyApi spotifyApi) throws IOException, ParseException, SpotifyWebApiException;
}
