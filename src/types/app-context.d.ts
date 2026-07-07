import DynamicMusicPillExtension from "@/extension"
import { IMPrisProvider } from "@/interfaces/impris-provider"
import { SettingsProvider } from "@/providers/settings-provider";

export type AppContext = {
    settings: SettingsProvider,
    extension: DynamicMusicPillExtension,
    mpris: IMPrisProvider
}
