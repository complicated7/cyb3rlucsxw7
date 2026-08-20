/* ============================================================
   CYB3RLUCSXW7.EXE — data.js
   Todo o conteúdo do site vive aqui: posts, boot sequence,
   frases do hero e comandos do shell falso.
   ============================================================ */

/* -------------------- BOOT SEQUENCE -------------------- */
const BOOT_LINES = [
  [{ text: "CYB3RLUCSXW7 BIOS v3.11 — (C) 1995 Ellingson Mineral Co.", cls: "boot-title" }],
  [{ text: "CPU: MOS 6502 @ 1.023 MHz ..........." }, { text: " OK", cls: "boot-ok" }],
  [{ text: "Memory check: 640K ..........." }, { text: " OK", cls: "boot-ok" }],
  [{ text: "Detecting reality ...........", cls: "boot-fail" }, { text: " FAILED", cls: "boot-fail" }],
  [{ text: "Loading kernel /dev/matrix ..........." }, { text: " OK", cls: "boot-ok" }],
  [{ text: "Mounting /home/lucsxw7/posts ..........." }, { text: " OK", cls: "boot-ok" }],
  [{ text: "Scanning for agents ..........." }, { text: " NONE FOUND", cls: "boot-warn" }],
  [{ text: "Injecting Da Vinci virus ..........." }, { text: " just kidding", cls: "boot-warn" }],
  [],
  [{ text: "HACK THE PLANET! HACK THE PLANET!", cls: "boot-cyan" }],
  [],
  [{ text: "Wake up, lucsxw7...", cls: "boot-ok" }],
  [{ text: "The Matrix has you.", cls: "boot-ok" }],
  [{ text: "Follow the white rabbit.", cls: "boot-ok" }],
  [],
  [{ text: "> exec cyb3rlucsxw7.exe" }]
];

/* -------------------- HERO TYPING -------------------- */
const HERO_PHRASES = [
  "conexão estabelecida.",
  "root@matrix, sem senha.",
  "acredite no que quiser, eu só compilo.",
  "nada aqui é por acaso.",
  "execute por sua conta e risco."
];

/* -------------------- POSTS -------------------- */
const POSTS = [
  {
    file: "hello_world.txt",
    desc: "Primeiro post: alguém aí?",
    date: "Jul 04 2026",
    title: "Primeiro post: alguém aí?",
    body: [
      "echo 'hello, world' > blog",
      "Pronto. Agora é oficial: tenho um blog com fundo preto e letra verde, como manda a lei.",
      "Se você chegou aqui, provavelmente clicou em algo errado. Fica aí mesmo assim."
    ]
  },
  {
    file: "cafe_overflow.log",
    desc: "Stack overflow de café",
    date: "Ago 02 2026",
    title: "Stack overflow de café",
    body: [
      "Descoberta científica do dia: a quarta xícara de café não deixa você mais acordado.",
      "Ela só deixa a insônia mais produtiva.",
      "kernel panic às 3h da manhã, mas o commit foi feito."
    ]
  },
  {
    file: "hack_the_planet.md",
    desc: "Poder da informação.",
    date: "Ago 07 2026",
    title: "hack the planet (mas com moderação)",
    body: [
      "\"Hack the planet\" nunca foi sobre invadir sistema de ninguém. Era sobre curiosidade sem pedir permissão pra sua própria cabeça.",
      "Ler o código-fonte de tudo. Perguntar por que o botão é azul. Abrir o F12 sem culpa. Isso é hackear — no sentido bom, no sentido antigo, antes da palavra virar sinônimo de crime.",
      "Meu conselho de hoje: abre o inspecionar elemento de um site que você usa todo dia. Aposto que tem coisa ali que vai te irritar."
    ]
  }
];

/* -------------------- SHELL: COMANDOS -------------------- */
const SHELL_HELP = [
  "comandos disponíveis:",
  "  help        - mostra essa lista",
  "  whoami      - quem é você aqui",
  "  ls          - lista os posts",
  "  cat [file]  - lê um post pelo nome do arquivo",
  "  matrix      - ???",
  "  sudo [algo] - tente e veja",
  "  clear       - limpa a tela",
  "  exit        - volta pro início"
];

/* Cada comando recebe (args) e devolve um array de linhas (strings) pra imprimir. */
const SHELL_COMMANDS = {
  help: () => SHELL_HELP,

  whoami: () => [
    "você é um visitante com JavaScript habilitado e curiosidade suficiente",
    "pra abrir um terminal falso num site pessoal."
  ],

  ls: () => [
    "total " + POSTS.length,
    ...POSTS.map(p => "-rw-r--r-- lucsxw7 matrix " + p.file)
  ],

  cat: (args) => {
    if (!args.length) return ["uso: cat [nome_do_arquivo]"];
    const found = POSTS.find(p => p.file === args[0]);
    if (!found) return ["cat: " + args[0] + ": arquivo não encontrado"];
    return ["--- " + found.title + " ---", ...found.body, "--- EOF ---"];
  },

  matrix: () => [
    "Wake up, Neo...",
    "The Matrix has you...",
    "Follow the white rabbit.",
    "🐇"
  ],

  sudo: (args) => [
    "[sudo] password for lucsxw7: ",
    "nice try. isso aqui roda 100% no seu navegador,",
    "não existe root pra pedir. mas valeu a tentativa."
  ],

  clear: () => ({ clear: true }),

  exit: () => ({ exit: true })
};
