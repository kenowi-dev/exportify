package de.wittenbude.exportify.infrastructure.spotify.data;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.neovisionaries.i18n.CountryCode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SpotifyPrivateUser extends SpotifyPublicUser {
    @JsonProperty("country")
    private CountryCode country;

    @JsonProperty("email")
    private String email;

    @JsonProperty("explicit_content")
    private SpotifyExplicitContent spotifyExplicitContent;

    @JsonProperty("product")
    private SpotifyProductType product;


    @Getter
    @AllArgsConstructor
    public enum SpotifyProductType {

        @JsonProperty("basic-desktop")
        BASIC_DESKTOP("basic-desktop"),

        @JsonProperty("daypass")
        DAYPASS("daypass"),

        @JsonProperty("free")
        FREE("free"),

        @JsonProperty("open")
        OPEN("open"),

        @JsonProperty("premium")
        PREMIUM("premium");


        private final String type;

    }

    @Getter
    @Setter
    public static class SpotifyExplicitContent {
        @JsonProperty("filter_enabled")
        private Boolean filterEnabled;

        @JsonProperty("filter_locked")
        private Boolean filterLocked;

    }

}