// Supply twelve real PC games with local official artwork and illustrative USD demo prices.
import type { Product } from "./products.types.js";

export const products: Product[] = [
  {
    id: "cyberpunk-2077",
    name: "Cyberpunk 2077",
    category: "RPG",
    developer: "CD PROJEKT RED",
    price: 39.99,
    image: "/images/games/cyberpunk-2077.jpg",
    featuredImage: "/images/games/cyberpunk-2077-hero.jpg",
    description:
      "Play as V, a mercenary navigating cybernetic upgrades, dangerous deals, and the streets of Night City.",
  },
  {
    id: "red-dead-redemption-2",
    name: "Red Dead Redemption 2",
    category: "Action-Adventure",
    developer: "Rockstar Games",
    price: 24.99,
    image: "/images/games/red-dead-redemption-2.jpg",
    description:
      "Ride with Arthur Morgan and the Van der Linde gang as their outlaw way of life comes under threat.",
  },
  {
    id: "elden-ring",
    name: "Elden Ring",
    category: "RPG",
    developer: "FromSoftware",
    price: 49.99,
    image: "/images/games/elden-ring.jpg",
    description:
      "Explore the Lands Between as a Tarnished, build your fighting style, and challenge powerful demigods.",
  },
  {
    id: "hogwarts-legacy",
    name: "Hogwarts Legacy",
    category: "RPG",
    developer: "Avalanche Software",
    price: 29.99,
    image: "/images/games/hogwarts-legacy.jpg",
    description:
      "Attend Hogwarts in the 1800s, learn spells, and explore the wizarding world in an open-world action RPG.",
  },
  {
    id: "baldurs-gate-3",
    name: "Baldur's Gate 3",
    category: "RPG",
    developer: "Larian Studios",
    price: 49.99,
    image: "/images/games/baldurs-gate-3.jpg",
    description:
      "Gather a party in the Forgotten Realms and shape a Dungeons & Dragons adventure through choices and turn-based battles.",
  },
  {
    id: "the-witcher-3-wild-hunt",
    name: "The Witcher 3: Wild Hunt",
    category: "RPG",
    developer: "CD PROJEKT RED",
    price: 19.99,
    image: "/images/games/the-witcher-3-wild-hunt.jpg",
    description:
      "Track the missing Ciri as Geralt of Rivia while taking monster contracts across a war-torn fantasy world.",
  },
  {
    id: "grand-theft-auto-v",
    name: "Grand Theft Auto V",
    category: "Action-Adventure",
    developer: "Rockstar North",
    price: 19.99,
    image: "/images/games/grand-theft-auto-v.jpg",
    description:
      "Follow three criminals through connected heists and explore Los Santos and the surrounding countryside.",
  },
  {
    id: "resident-evil-4-2023",
    name: "Resident Evil 4 (2023)",
    category: "Survival Horror",
    developer: "CAPCOM Co., Ltd.",
    price: 34.99,
    image: "/images/games/resident-evil-4-2023.jpg",
    description:
      "Rescue the president’s daughter as Leon S. Kennedy in the 2023 remake of the survival-horror adventure.",
  },
  {
    id: "god-of-war-2018",
    name: "God of War (2018)",
    category: "Action-Adventure",
    developer: "Santa Monica Studio; Jetpack Interactive (PC)",
    price: 29.99,
    image: "/images/games/god-of-war-2018.jpg",
    description:
      "Journey through the Norse realms with Kratos and Atreus in the PC version of the 2018 adventure.",
  },
  {
    id: "marvels-spider-man-remastered",
    name: "Marvel's Spider-Man Remastered",
    category: "Action-Adventure",
    developer: "Insomniac Games; Nixxes Software (PC)",
    price: 39.99,
    image: "/images/games/marvels-spider-man-remastered.jpg",
    description:
      "Swing across Marvel’s New York and balance Peter Parker’s life with Spider-Man’s fight against crime.",
  },
  {
    id: "hollow-knight",
    name: "Hollow Knight",
    category: "Metroidvania",
    developer: "Team Cherry",
    price: 14.99,
    image: "/images/games/hollow-knight.jpg",
    description:
      "Explore the ruined insect kingdom of Hallownest, discover new abilities, and face challenging hand-drawn foes.",
  },
  {
    id: "stray",
    name: "Stray",
    category: "Adventure",
    developer: "BlueTwelve Studio",
    price: 19.99,
    image: "/images/games/stray.jpg",
    description:
      "Guide a lost cat through a robot-inhabited city, solve environmental puzzles, and search for a way home.",
  },
];
