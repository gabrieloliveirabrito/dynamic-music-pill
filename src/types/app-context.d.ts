import DynamicMusicPillExtension from "@/extension"
import { SettingsProvider } from "@/providers/settings-provider";
import { MPRISProvider } from "@/providers/mpris-provider";

export type AppContext = {
    settings: SettingsProvider,
    extension: DynamicMusicPillExtension,
    mpris: MPRISProvider
}
