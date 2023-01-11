import fs from 'fs';
import { Market, MarketPlayer, Offer } from './api/interfaces';
import { exportedForTesting } from './kickbase-autodecline';
import { OFFER_THRESHOLD } from './settings';
import { getMarketStub, marketStub } from './mocks/marketStub';

const {
  hasOffer,
  isHighOffer,
  hasNoHighOffers,
  isNotExpiredOffer,
  hasOnlyExpiredOffers,
  hasTooLowOfferOrOnlyExpiredOffers,
  getUsersPlayersWithTooLowOrExpiredOffers,
} = exportedForTesting;

const userId = '118426';
const offer_threshold = OFFER_THRESHOLD / 100;

const playerStubWithoutOffer: MarketPlayer = {
  id: '43',
  teamId: '10',
  userId: '118426',
  userProfile:
    'https://kickbase.b-cdn.net/user/62730c23b18c47bbb944c1b4a118b157.jpeg',
  username: 'Ronny Rakete',
  firstName: 'Mitchell',
  lastName: 'Weiser',
  profile: 'https://kickbase.b-cdn.net/pool/players/43.jpg',
  status: 0,
  position: 2,
  number: 8,
  totalPoints: 1506,
  averagePoints: 100,
  marketValue: 18164172,
  price: 18164172,
  date: '2023-01-06T05:02:01Z',
  expiry: 2550463,
  lus: 1,
  marketValueTrend: 1,
};

const offerStubWithoutValidationDate: Offer = {
  id: '1234518516',
  price: 1,
  date: '2022-12-06T16:48:13Z',
};

const getOfferStub = (validUntilDate: string): Offer => {
  return {
    ...offerStubWithoutValidationDate,
    validUntilDate,
  };
};

const modifyNowHour = (hour: number): string => {
  const now = new Date();
  now.setHours(now.getHours() + hour);
  return now.toISOString();
};

describe('Filter: hasOffer', () => {
  test('has no offer', () => {
    expect(hasOffer(playerStubWithoutOffer)).toBeFalsy();
  });

  test('has offer(s)', () => {
    expect(
      hasOffer({
        ...playerStubWithoutOffer,
        offers: [offerStubWithoutValidationDate, getOfferStub(Date())],
      })
    ).toBeTruthy();
  });
});

const getOfferWithPriceOverTreshold = (addToTreshold: number): Offer => {
  return {
    ...offerStubWithoutValidationDate,
    price:
      playerStubWithoutOffer.marketValue *
      (1 + offer_threshold + addToTreshold),
  };
};

describe('Filter: isHighOffer', () => {
  test('offer is high enough', () => {
    expect(
      isHighOffer(offer_threshold)(playerStubWithoutOffer)(
        getOfferWithPriceOverTreshold(0.1)
      )
    ).toBeTruthy();
  });

  test('offer is too low', () => {
    expect(
      isHighOffer(offer_threshold)(playerStubWithoutOffer)(
        getOfferWithPriceOverTreshold(-0.1)
      )
    ).toBeFalsy();
  });
});

describe('Filter: hasNoHighOffers', () => {
  test('one offers is high enough', () => {
    expect(
      hasNoHighOffers(offer_threshold)({
        ...playerStubWithoutOffer,
        offers: [
          getOfferWithPriceOverTreshold(0.1),
          getOfferWithPriceOverTreshold(-0.1),
        ],
      })
    ).toBeFalsy();
  });

  test('all offers are too low', () => {
    expect(
      hasNoHighOffers(offer_threshold)({
        ...playerStubWithoutOffer,
        offers: [
          getOfferWithPriceOverTreshold(-0.1),
          getOfferWithPriceOverTreshold(-0.1),
        ],
      })
    ).toBeTruthy();
  });

  test('Market Stub 2 has a high offer', () => {
    expect(hasNoHighOffers(offer_threshold)(marketStub.players[1])).toBeFalsy();
  });
});

describe('Filter: isNotExpiredOffer', () => {
  const testExpirationDate = (validUntilDate: string): boolean => {
    const offer: Offer = { ...offerStubWithoutValidationDate, validUntilDate };
    return isNotExpiredOffer(offer);
  };

  test('1 hour from now is not expired', () => {
    const offer = getOfferStub(modifyNowHour(1));
    expect(isNotExpiredOffer(offer)).toBeTruthy();
  });
  test('now is already expired', () => {
    const offer = getOfferStub(Date());
    expect(isNotExpiredOffer(offer)).toBeFalsy();
  });
  test('now -1 hour is expired', () => {
    const offer = getOfferStub(modifyNowHour(-1));
    expect(isNotExpiredOffer(offer)).toBeFalsy();
  });
});

describe('Filter: hasOnlyExpiredOffers', () => {
  test('has no offer and therefore no expired offer', () => {
    const player: MarketPlayer = { ...playerStubWithoutOffer };
    expect(hasOnlyExpiredOffers(player)).toBeFalsy();
  });

  test('has only one expired offer', () => {
    const player: MarketPlayer = {
      ...playerStubWithoutOffer,
      offers: [getOfferStub(modifyNowHour(-1))],
    };
    expect(hasOnlyExpiredOffers(player)).toBeTruthy();
  });

  test('has only a non expired offer', () => {
    const player: MarketPlayer = {
      ...playerStubWithoutOffer,
      offers: [getOfferStub(modifyNowHour(1))],
    };
    expect(hasOnlyExpiredOffers(player)).toBeFalsy();
  });

  test('has a non expired and an expired offer => false', () => {
    const player: MarketPlayer = {
      ...playerStubWithoutOffer,
      offers: [getOfferStub(modifyNowHour(1)), getOfferStub(modifyNowHour(-1))],
    };
    expect(hasOnlyExpiredOffers(player)).toBeFalsy();
  });

  test('marketStub No. 2 is not expired', () => {
    let market = { ...marketStub };
    market.players[1].offers![0].validUntilDate = modifyNowHour(+1);
    expect(hasOnlyExpiredOffers(marketStub.players[1])).toBeFalsy();
  });
});

const writeResult = (stub: Market): void => {
  fs.writeFileSync(
    './result.json',
    JSON.stringify(
      getUsersPlayersWithTooLowOrExpiredOffers(stub, userId, offer_threshold)
    )
  );
};

const getMyPlayerPositions = (stub: Market): void => {
  let myPlayerPositions: string[] = [];
  let myPlayerLastnames: string[] = [];
  let i = 0;
  stub.players.forEach((player: MarketPlayer): void => {
    if (player.userId == userId) {
      myPlayerPositions.push(player.id);
      myPlayerLastnames.push(player.lastName);
    }
    i++;
  });
  console.log(myPlayerPositions);
  console.log(myPlayerLastnames);
};

// getMyPlayerPositions(marketStub);

const myPlayerNames = [
  'Weiser',
  'Akpoguma',
  'Hummels',
  'Brandt',
  'Aránguiz',
  'Sabitzer',
  'Gikiewicz',
  'Diallo',
  'Lukébakio',
  'Raum',
  'Diaby',
  'Coulibaly',
  'Mavropanos',
  'Lacroix',
  'Hlozek',
  'Kanga',
  'Dolberg',
];

const myPlayerIds = [
  '43',
  '96',
  '304',
  '1192',
  '1766',
  '1856',
  '1936',
  '2115',
  '2308',
  '2522',
  '2661',
  '2824',
  '2838',
  '2878',
  '3471',
  '4336',
  '4429',
];

const validUntilDates = [
  modifyNowHour(-7),
  modifyNowHour(-6),
  modifyNowHour(-5),
  modifyNowHour(-4),
  modifyNowHour(-3),
  modifyNowHour(-2),
  modifyNowHour(-1),
  modifyNowHour(1),
  modifyNowHour(2),
  modifyNowHour(3),
  modifyNowHour(2),
  modifyNowHour(3),
  modifyNowHour(1),
  modifyNowHour(-2),
  modifyNowHour(1),
  modifyNowHour(1),
  modifyNowHour(-2),
];

// writeResult(getMarketStub(validUntilDates, marketStub));

const result = getUsersPlayersWithTooLowOrExpiredOffers(
  getMarketStub(validUntilDates, marketStub),
  userId,
  offer_threshold
);

describe('Test getUsersPlayersWithTooLowOrExpiredOffers function', () => {
  test('empty market', () => {
    expect(
      getUsersPlayersWithTooLowOrExpiredOffers(
        { c: true, players: [] },
        userId,
        offer_threshold
      )
    ).toEqual([]);
  });

  test('are all my players', () => {
    expect(
      result.length ==
        result.filter(
          (player: MarketPlayer): Boolean => player.userId == userId
        ).length
    ).toBeTruthy();
  });

  test('have all offers', () => {
    expect(result.length == result.filter(hasOffer).length).toBeTruthy();
  });

  test(`have all offers below treshold ${offer_threshold} % or are expired`, () => {
    const result = getUsersPlayersWithTooLowOrExpiredOffers(
      getMarketStub(validUntilDates, marketStub),
      userId,
      offer_threshold
    );
    const local_result = [...result];
    const expiredOffers = local_result
      .filter(hasOnlyExpiredOffers)
      .map((player): string => player.id);
    const tooLowOffers = local_result
      .filter(hasNoHighOffers(offer_threshold))
      .map((player): string => player.id);

    const both = local_result
      .filter(hasTooLowOfferOrOnlyExpiredOffers(offer_threshold))
      .map((player) => player.id);

    const resultIds = new Set(expiredOffers.concat(tooLowOffers));

    expect(result.length == resultIds.size).toBeTruthy();
  });

  test('have offers below treshold or are expired', () => {
    expect(result.length).toEqual(9);
  });
});
