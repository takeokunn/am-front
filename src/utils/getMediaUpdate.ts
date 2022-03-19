export function getMediaUpdate(media) {
    return {
        __media: media,
        currentTrack: {
            mediaId: media.mediaId,
            title: media.title,
            duration: media.durationSeconds,
            artist: { name: media.artistName },
            album: {
                title: media.albumName,
                image500: media.artwork,
            },
        },
    };
}
