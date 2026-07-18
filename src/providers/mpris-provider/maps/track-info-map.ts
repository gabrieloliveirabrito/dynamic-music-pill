import { TrackInfo } from "@/types/player-types";
import { MapperType } from "@/utils/mapper";

export const TrackInfoMap : MapperType<TrackInfo> = {
    "xesam:title": (t, v) => t.title = v,
    "xesam:artist": (t, v) => t.artist = v,
    "xesam:album": (t, v) => t.album = v,
    "mpris:artUrl": (t, v) => t.artUrl = v,
    "mpris:length": (t, v) => t.length = v,
    "mpris:trackid": (t, v) => t.trackId = v,
    "rate": (t, v) => t.rate = v
}