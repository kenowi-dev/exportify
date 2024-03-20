package de.wittenbude.exportify.http.controller;

import de.wittenbude.exportify.models.Artist;
import de.wittenbude.exportify.services.ArtistService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/artists")
public class ArtistController {
    private final ArtistService artistService;

    public ArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @GetMapping("/followed")
    public List<Artist> followed() {
        return artistService.loadCurrentUserFollowedArtists();
    }
}
