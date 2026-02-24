export interface Challenge {
  title: string;
  flag: string;
  type: "web" | "misc" | "crypto" | "pwn" | "forensics";
  ctf: string;
  slug?: string;
}

export const challenges: Challenge[] = [
  { title: "Graph Grief", flag: "nite{Th3_Qu4ntum_****}", type: "web", ctf: "NiteCTF 2025", slug: "graph-grief" },
  { title: "Database Reincursion", flag: "nite{neVeR_9Onn4_****}", type: "web", ctf: "NiteCTF 2025", slug: "database-reincursion" },
  { title: "Connection Tester", flag: "PCTF{C0nnection_****}", type: "web", ctf: "PatriotCTF 2025", slug: "connection-tester" },
  { title: "Feedback Fallout", flag: "PCTF{cant_****}", type: "web", ctf: "PatriotCTF 2025", slug: "feedback-fallout" },
  { title: "SecureAuth", flag: "FLAG{py7h0n_****}", type: "web", ctf: "PatriotCTF 2025", slug: "secureauth" },
  { title: "Trust Fall", flag: "PCTF{auth_****}", type: "web", ctf: "PatriotCTF 2025", slug: "trust-fall" },
  { title: "Trust Vault", flag: "PCTF{SQLi_****}", type: "web", ctf: "PatriotCTF 2025", slug: "trust-vault" },
  { title: "Reverse Metadata Part 1", flag: "MASONCC{images_****}", type: "misc", ctf: "PatriotCTF 2025", slug: "reverse-metadata-1" },
  { title: "Reverse Metadata Part 2", flag: "PCTF{hidden_****}", type: "misc", ctf: "PatriotCTF 2025", slug: "reverse-metadata-2" },
];

export interface CTFEvent {
  name: string;
  status: string;
  route: string;
}

export const myCTFs: CTFEvent[] = [
  { name: "PatriotCTF 2025", status: "Ended", route: "/patriotctf2025" },
  { name: "NiteCTF 2025", status: "Ended", route: "/nitectf2025" },
];

export interface LabPlatform {
  platform: string;
  username: string;
  status: string;
  route: string;
}

export const labPlatforms: LabPlatform[] = [
  { platform: "Hack The Box", username: "", status: "Active", route: "/hackthebox" },
  { platform: "TryHackMe", username: "aycoo", status: "Active", route: "/tryhackme" },
];

export interface THMChallenge {
  title: string;
  difficulty: "easy" | "medium" | "hard" | "insane";
  note?: string;
  hasWriteup: boolean;
  slug?: string;
}

export const thmChallenges: THMChallenge[] = [
  { title: "Valley", difficulty: "easy", hasWriteup: true, slug: "valley" },
  { title: "RabbitStore", difficulty: "medium", hasWriteup: true, slug: "rabbitstore" },
  { title: "0day", difficulty: "medium", hasWriteup: true, slug: "0day" },
  { title: "Blueprint", difficulty: "easy", hasWriteup: true, slug: "blueprint" },
  { title: "Bookstore", difficulty: "medium", hasWriteup: true, slug: "bookstore" },
  { title: "Mr Robot", difficulty: "medium", hasWriteup: true, slug: "mr-robot" },
  { title: "Athena", difficulty: "medium", hasWriteup: true, slug: "athena" },
  { title: "Wonderland", difficulty: "medium", hasWriteup: true, slug: "wonderland" },
  { title: "OverPass", difficulty: "easy", hasWriteup: true, slug: "overpass" },
  { title: "Chocolate factory", difficulty: "easy", hasWriteup: true, slug: "chocolate-factory" },
  { title: "Inferno", difficulty: "medium", note: "To be added", hasWriteup: false },
  { title: "Boiler CTF", difficulty: "medium", note: "To be added", hasWriteup: false },
  { title: "U.A. High School", difficulty: "easy", note: "To be added", hasWriteup: false },
  { title: "LazyAdmin", difficulty: "easy", note: "To be added", hasWriteup: false },
  { title: "Billing", difficulty: "easy", note: "To be added", hasWriteup: false },
  { title: "Neighbour", difficulty: "easy", note: "To be added", hasWriteup: false },
  { title: "Year of the rabbit", difficulty: "easy", note: "To be added", hasWriteup: false },
  { title: "Pyrat", difficulty: "easy", note: "To be added", hasWriteup: false },
  { title: "Simple CTF", difficulty: "easy", note: "To be added", hasWriteup: false },
  { title: "Root me", difficulty: "easy", note: "To be added", hasWriteup: false },
  { title: "Bounty hacker", difficulty: "easy", note: "To be added", hasWriteup: false },
  { title: "Startup", difficulty: "easy", note: "To be added", hasWriteup: false },
];

export interface HTBChallenge {
  title: string;
  difficulty: "easy" | "medium" | "hard" | "insane";
  note?: string;
  hasWriteup: boolean;
  slug?: string;
}

export const htbChallenges: HTBChallenge[] = [
  // { title: "SomeMachine", difficulty: "easy", hasWriteup: true, slug: "somemachine" },
];

export interface PatriotChallenge {
  title: string;
  flag: string;
  type: "web" | "misc";
  slug: string;
}

export const patriotChallenges: PatriotChallenge[] = [
  { title: "Reverse Metadata Part 1", flag: "MASONCC{images_****}", type: "misc", slug: "reverse-metadata-1" },
  { title: "Reverse Metadata Part 2", flag: "PCTF{hidden_****}", type: "misc", slug: "reverse-metadata-2" },
  { title: "Connection Tester", flag: "PCTF{C0nnection_****}", type: "web", slug: "connection-tester" },
  { title: "Feedback Fallout", flag: "PCTF{cant_****}", type: "web", slug: "feedback-fallout" },
  { title: "SecureAuth", flag: "FLAG{py7h0n_****}", type: "web", slug: "secureauth" },
  { title: "Trust Fall", flag: "PCTF{auth_****}", type: "web", slug: "trust-fall" },
  { title: "Trust Vault", flag: "PCTF{SQLi_****}", type: "web", slug: "trust-vault" },
];
