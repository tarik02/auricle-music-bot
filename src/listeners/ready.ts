import {
  AppleMusicExtractor,
  AttachmentExtractor,
  ReverbnationExtractor,
  SoundCloudExtractor,
  VimeoExtractor,
} from "@discord-player/extractor";
import { Listener } from "@sapphire/framework";
import { SpotifyExtractor } from "discord-player-spotify";
import { YoutubeSabrExtractor } from "discord-player-googlevideo";

export class UserEvent extends Listener {
  public constructor(
    context: Listener.LoaderContext,
    options: Listener.Options
  ) {
    super(context, {
      ...options,
      once: true,
    });
  }

  public async run() {
    await this.container.client.player.extractors.loadMulti([
      SoundCloudExtractor,
      AttachmentExtractor,
      ReverbnationExtractor,
      AppleMusicExtractor,
      YoutubeSabrExtractor,
      VimeoExtractor,
    ]);
    await this.container.client.player.extractors.register(SpotifyExtractor, {
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      market: process.env.SPOTIFY_MARKET,
      ...(process.env.SPOTIFY_MIRROR_URL && {
        createStream: (ext, url) => {
          const uri = url.replace(/^.*(track)\/([\w\d]+).*$/, "spotify:$1:$2");
          return Promise.resolve(
            `${process.env.SPOTIFY_MIRROR_URL}${encodeURIComponent(uri)}`
          );
        },
      }),
    });
    return this.container.client.logger.info(
      `Successfully logged in as: ${this.container.client.user?.username}`
    );
  }
}
