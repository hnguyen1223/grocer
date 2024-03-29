import { AIDurabilities, Stuff, StuffLocation } from ".";

export const salmonDurabilies = [
  {
    location: StuffLocation.FRIDGE,
    min: 1,
    max: 2,
    description:
      "Raw salmon lasts 1-2 days, cooked salmon lasts 3-4 days in the fridge.",
  },
];

export const bananaDurabilities: AIDurabilities = {
  durabilities: [
    {
      location: StuffLocation.FRIDGE,
      min: 14,
      max: 21,
    },
    {
      location: StuffLocation.OUTSIDE,
      min: 5,
      max: 7,
    },
  ],
  description:
    "Bananas' peel darkens as they ripen, but the fruit stays edible.",
  recommendedLocation: StuffLocation.FRIDGE,
};

export const mockedBanana: Stuff = {
  id: "1",
  dateAdded: "2021-10-01",
  name: "Banana",
  location: StuffLocation.FRIDGE,
  expiryDate: "2021-10-21",
  ai: bananaDurabilities,
};

export const mockedStuffs = [mockedBanana];
