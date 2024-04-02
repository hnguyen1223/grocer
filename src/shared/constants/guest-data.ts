import dayjs from "dayjs";
import { Stuff } from "../interfaces";

const GUEST_DATA = [
  {
    location: "fridge",
    category: "Produce",
    durabilities: {
      freezer: {
        description: "Best to consume within 1 month for optimal freshness.",
        isRecommended: true,
        days: 30,
        hours: 12,
      },
      outside: {
        days: 3,
        description: "Best to consume within 3 days for optimal freshness.",
        isRecommended: true,
        hours: 24,
      },
      fridge: {
        hours: 2,
        description: "Best to consume within a week for optimal freshness.",
        isRecommended: true,
        days: 7,
      },
    },
    status: "Spoiled",
    name: "orange",
    emoji: "🍊",
    id: "0896b22f-5f86-47a0-9fd4-2fb1cf499815",
    dateAdded: "Mon Apr 01 2024 18:17:57 GMT-0700 (Pacific Daylight Time)",
  },
  {
    name: "tomato",
    id: "12280373-ee08-4380-a7f8-2905e90cad93",
    category: "Produce",
    durabilities: {
      freezer: {
        description: "Best to use within 6 months for optimal taste.",
        days: 6,
        hours: 12,
        isRecommended: true,
      },
      fridge: {
        isRecommended: true,
        description: "Best to consume within 5 days for optimal freshness.",
        hours: 1,
        days: 5,
      },
      outside: {
        hours: 48,
        description: "Not recommended, will spoil quickly.",
        isRecommended: false,
        days: 2,
      },
    },
    location: "fridge",
    emoji: "🍅",
    dateAdded: "Mon Mar 23 2024 18:17:57 GMT-0700 (Pacific Daylight Time)",
  },
  {
    category: "Sauces",
    name: "gochujang",
    durabilities: {
      outside: {
        isRecommended: false,
        hours: 24,
        days: 7,
        description: "Not recommended, may spoil quickly outside of fridge.",
      },
      fridge: {
        description:
          "Best consumed within 1 month after opening. Keep refrigerated.",
        hours: 24,
        isRecommended: true,
        days: 30,
      },
      freezer: {
        days: 30,
        description:
          "Best consumed within 12 hours after thawing. Can be stored for up to 30 days in the freezer. Recommended to consume within 30 days for best quality.",
        hours: 12,
        isRecommended: true,
      },
    },
    id: "5bcb40ed-7a3b-4a2d-a597-7ed87a562c69",
    location: "fridge",
    emoji: "🌶️",
  },
  {
    category: "Others",
    emoji: "🥡",
    location: "fridge",
    durabilities: {
      fridge: {
        days: 5,
        hours: 3,
        isRecommended: true,
        description:
          "Best consumed within 3 hours of refrigeration. Can last up to 5 days if stored properly.",
      },
      freezer: {
        isRecommended: true,
        days: 30,
        description:
          "Best consumed within 6 hours or frozen for up to 30 days. Recommended to freeze for longer shelf life.",
        hours: 6,
      },
      outside: {
        hours: 4,
        days: 0,
        description:
          "Not recommended to leave outside of fridge for more than 4 hours.",
        isRecommended: false,
      },
    },
    id: "5da9aca9-0e77-4518-889a-be0116d95afb",
    name: "chow mein",
    dateAdded: "Mon Apr 01 2024 18:17:57 GMT-0700 (Pacific Daylight Time)",
  },
  {
    category: "Produce",
    location: "outside",
    emoji: "🍎",
    durabilities: {
      freezer: {
        isRecommended: true,
        hours: 12,
        days: 6,
        description: "Best to consume within 6 months for optimal taste.",
      },
      outside: {
        hours: 24,
        isRecommended: true,
        description: "Best to consume within 3 days for optimal freshness.",
        days: 3,
      },
      fridge: {
        hours: 2,
        isRecommended: true,
        description: "Best to consume within a week for optimal freshness.",
        days: 7,
      },
    },
    id: "9966f00a-6247-4490-8794-b7649e582472",
    name: "apple",
    dateAdded: "Mon Apr 01 2024 18:17:57 GMT-0700 (Pacific Daylight Time)",
  },
  {
    id: "9994fbf4-bbb6-4dfc-ba5f-95516fe3cf99",
    durabilities: {
      fridge: {
        isRecommended: true,
        description: "Keep raw salmon refrigerated, consume within 2 days.",
        days: 2,
        hours: 48,
      },
      freezer: {
        days: 365,
        isRecommended: true,
        hours: 0,
        description: "Properly frozen salmon lasts up to a year.",
      },
      outside: {
        hours: 2,
        description: "Unsafe after 2 hours. Bacteria grow rapidly.",
        isRecommended: false,
        days: 0,
      },
    },
    emoji: "🐟",
    name: "salmon",
    location: "fridge",
    category: "Seafood",
    dateAdded: "Mon Apr 01 2024 18:17:57 GMT-0700 (Pacific Daylight Time)",
  },
];

export function getGuessData(): Stuff[] {
  return GUEST_DATA.map((stuff) => ({
    ...stuff,
    dateAdded: dayjs().subtract(3, "d").toString(),
  })) as Stuff[];
}
