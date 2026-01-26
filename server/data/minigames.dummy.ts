export type MinigameSlug = "drag-and-drop" | "automation-spotter" | "memory-game"

export const MINIGAMES = [
    {
        slug: "drag-and-drop",
        title: "Drag And Drop",
        description: "Drag and Drop Prompt merupakan game mengisi kata yang hilang pada sebuah kalimat atau paragraf dengan cara melakukan drag and drop kalimat yang disediakan ke tempat yang tepat.",
    },
    {
        slug: "automation-spotter",
        title: "Automation Spotter",
        description: "Automation Spotter adalah game drag and drop di mana pemain harus mengklasifikasikan jawaban ke dalam zona “Ya” atau “Tidak” berdasarkan pertanyaan yang diberikan.",
    },
    {
        slug: "memory-game",
        title: "Memory Game",
        description: "Memory Game adalah game mencocokkan kartu. Dalam permainan ini, kartu-kartu diletakkan tertutup, dan pemain harus membuka (flip) dua kartu. Setiap kartu berisi pertanyaan atau jawaban. Tugas pemain adalah mencocokkan kartu pertanyaan dengan kartu jawaban yang sesuai.",
    },
] as const


export const LEVELS: Record<MinigameSlug, Record<number, any>> = {
    "drag-and-drop": {
        1: {
            id: 1,
            sentence:
                "Saya sedang menulis review untuk riset di bidang {{1}}. Tulis ulasan akademik dengan gaya seorang peneliti tentang konsep dan penerapan {{2}} dalam organisasi modern. Gunakan bahasa formal dan netral, berikan kerangka teori dan contoh penerapan, dan strukturkan {{3}} agar mudah dimasukkan ke dalam {{4}}. Target pembaca saya Adalah {{5}} di perusahaan.",
            blanks: [
                { id: 1, word: "manajemen sains" },
                { id: 2, word: "data-driven decision making" },
                { id: 3, word: "jawaban" },
                { id: 4, word: "paper ilmiah" },
                { id: 5, word: "eksekutif" },
            ],
        },
    },

    "automation-spotter": {
        1: {
            id: 1,
            question:
                "Pilih tugas yang bisa diotomatisasi AI ke kolom Bisa dan yang tidak ke kolom Tidak Bisa",
            card: [
                { id: 1, label: "Menyortir email masuk", answer: true },
                { id: 2, label: "Penjadwalan dan Pengingat Rapat", answer: true },
                { id: 3, label: "Memvalidasi kelengkapan dokumen sebelum diteruskan ke supervisor.", answer: true },
                { id: 4, label: "Menjawab Pertanyaan FAQ", answer: true },
                { id: 5, label: "Mengirim pengingat pembayaran atau tugas berdasarkan jadwal.", answer: true },
                { id: 6, label: "Menentukan strategi bisnis perusahaan", answer: false },
                { id: 7, label: "Melakukan coaching & mentoring karyawan", answer: false },
                { id: 8, label: "Menyetujui tindakan hukum perusahaan", answer: false },
                { id: 9, label: "Menilai potensi kepemimpinan karyawan", answer: false },
                { id: 10, label: "Menentukan komposisi tim proyek strategis", answer: false },
            ],
        },
    },

    "memory-game": {
        1: {
            id: 1,
            card: [
                { id: 1, pairId: 1, contentType: "text", value: "Terintegrasi dengan Gmail, Docs, dan Sheets." },
                { id: 2, pairId: 1, contentType: "svg", value: "gemini" },
                { id: 3, pairId: 2, contentType: "text", value: "Digunakan untuk membantu menulis dan memahami kode secara otomatis." },
                { id: 4, pairId: 2, contentType: "svg", value: "github" },
                { id: 5, pairId: 3, contentType: "text", value: "Digunakan untuk membuat desain, presentasi, dan konten visual dengan cepat." },
                { id: 6, pairId: 3, contentType: "svg", value: "canva" },
                { id: 7, pairId: 4, contentType: "text", value: "Digunakan untuk menulis email, merangkum dokumen, dan merangkum document berbasis teks." },
                { id: 8, pairId: 4, contentType: "svg", value: "chatgpt" },
                { id: 9, pairId: 5, contentType: "text", value: "Digunakan di WhatsApp untuk tanya jawab dan kolaborasi bot di dalam chat." },
                { id: 10, pairId: 5, contentType: "svg", value: "meta" },
            ],
        },
    },
}
