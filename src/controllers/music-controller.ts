import { IMPrisProvider } from "@/interfaces/impris-provider";
import { createMockMPRISProvider } from "@/providers/mock";

export class MusicController {
    private provider: IMPrisProvider = createMockMPRISProvider();
}