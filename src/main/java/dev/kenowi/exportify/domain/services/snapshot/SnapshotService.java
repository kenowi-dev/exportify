package dev.kenowi.exportify.domain.services.snapshot;

import dev.kenowi.exportify.domain.entities.Snapshot;
import dev.kenowi.exportify.domain.entities.valueobjects.EventStatus;
import dev.kenowi.exportify.domain.events.SnapshotCreatedEvent;
import dev.kenowi.exportify.domain.exceptions.EntityNotFoundException;
import dev.kenowi.exportify.domain.exceptions.SnapshotNotReadyException;
import dev.kenowi.exportify.domain.services.exportifyuser.AuthenticatedUser;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SnapshotService {

    private final SnapshotRepository snapshotRepository;
    private final ApplicationEventPublisher eventPublisher;

    SnapshotService(SnapshotRepository snapshotRepository,
                    ApplicationEventPublisher eventPublisher) {
        this.snapshotRepository = snapshotRepository;
        this.eventPublisher = eventPublisher;
    }


    public Snapshot create() {

        Snapshot snapshot = snapshotRepository
                .save(new Snapshot().setExportifyUser(AuthenticatedUser.getSecurityContext().getUser()));

        eventPublisher.publishEvent(new SnapshotCreatedEvent(snapshot.getId()));
        return snapshot;
    }

    @Async
    @EventListener
    public void onSnapshotArtists(SnapshotCreatedEvent.SnapshotArtistsCreated event) {
        Snapshot snapshot = snapshotRepository
                .findById(event.getSnapshotID())
                .orElseThrow(() -> new EntityNotFoundException("Snapshot not found"))
                .setArtists(event.getData())
                .setArtistsStatus(EventStatus.FINISHED);
        snapshotRepository.save(snapshot);
    }

    @Async
    @EventListener
    public void onSnapshotAlbums(SnapshotCreatedEvent.SnapshotAlbumsCreated event) {
        Snapshot snapshot = snapshotRepository
                .findById(event.getSnapshotID())
                .orElseThrow(() -> new EntityNotFoundException("Snapshot not found"))
                .setSavedAlbums(event.getData())
                .setAlbumsStatus(EventStatus.FINISHED);
        snapshotRepository.save(snapshot);
    }

    @Async
    @EventListener
    public void onSnapshotTracks(SnapshotCreatedEvent.SnapshotTracksCreated event) {
        Snapshot snapshot = snapshotRepository
                .findById(event.getSnapshotID())
                .orElseThrow(() -> new EntityNotFoundException("Snapshot not found"))
                .setSavedTracks(event.getData())
                .setTracksStatus(EventStatus.FINISHED);
        snapshotRepository.save(snapshot);
    }

    @Async
    @EventListener
    public void onSnapshotPlaylists(SnapshotCreatedEvent.SnapshotPlaylistsCreated event) {
        Snapshot snapshot = snapshotRepository
                .findById(event.getSnapshotID())
                .orElseThrow(() -> new EntityNotFoundException("Snapshot not found"))
                .setPlaylists(event.getData())
                .setPlaylistsStatus(EventStatus.FINISHED);
        snapshotRepository.save(snapshot);
    }

    @Async
    @EventListener
    public void onSnapshotUser(SnapshotCreatedEvent.SnapshotUserCreated event) {
        Snapshot snapshot = snapshotRepository
                .findById(event.getSnapshotID())
                .orElseThrow(() -> new EntityNotFoundException("Snapshot not found"))
                .setPrivateSpotifyUser(event.getData())
                .setUserStatus(EventStatus.FINISHED);
        snapshotRepository.save(snapshot);
    }

    public Snapshot get(UUID id) {
        Snapshot snapshot = snapshotRepository
                .findById(id)
                .filter(s -> s.getExportifyUser().getId().equals(AuthenticatedUser.getSecurityContext().getID()))
                .orElseThrow(() -> new EntityNotFoundException("snapshot %s does not exist".formatted(id)));

        if (snapshot.getAlbumsStatus() != EventStatus.FINISHED
                || snapshot.getTracksStatus() != EventStatus.FINISHED
                || snapshot.getArtistsStatus() != EventStatus.FINISHED
                || snapshot.getPlaylistsStatus() != EventStatus.FINISHED
                || snapshot.getUserStatus() != EventStatus.FINISHED) {
            throw new SnapshotNotReadyException("Snapshot not ready");
        }
        return snapshot;
    }
}
