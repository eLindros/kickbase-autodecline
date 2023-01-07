import fs from 'fs';
import { MarketPlayer, Offer } from '../src/api/interfaces';
import { exportedForTesting } from '../src/kickbase-autodecline';
import { OFFER_THRESHOLD } from '../src/settings';
import { marketStub } from './marketStub';

const {
  hasOffer,
  isHighOffer,
  hasNoHighOffers,
  isNotExpiredOffer,
  hasOnlyExpiredOffers,
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
    expect(hasOffer(playerStubWithoutOffer)).toBe(false);
  });

  test('has offer(s)', () => {
    expect(
      hasOffer({
        ...playerStubWithoutOffer,
        offers: [offerStubWithoutValidationDate, getOfferStub(Date())],
      })
    ).toBe(true);
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
    ).toBe(true);
  });

  test('offer is too low', () => {
    expect(
      isHighOffer(offer_threshold)(playerStubWithoutOffer)(
        getOfferWithPriceOverTreshold(-0.1)
      )
    ).toBe(false);
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
    ).toBe(false);
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
    ).toBe(true);
  });

  test('Market Stub 2 has a high offer', () => {
    expect(hasNoHighOffers(offer_threshold)(marketStub.players[1])).toBe(false);
  });
});

describe('Filter: isNotExpiredOffer', () => {
  const testExpirationDate = (validUntilDate: string): boolean => {
    const offer: Offer = { ...offerStubWithoutValidationDate, validUntilDate };
    return isNotExpiredOffer(offer);
  };

  test('1 hour from now is not expired', () => {
    const offer = getOfferStub(modifyNowHour(1));
    expect(isNotExpiredOffer(offer)).toBe(true);
  });
  test('now is already expired', () => {
    const offer = getOfferStub(Date());
    expect(isNotExpiredOffer(offer)).toBe(false);
  });
  test('now -1 hour is expired', () => {
    const offer = getOfferStub(modifyNowHour(-1));
    expect(isNotExpiredOffer(offer)).toBe(false);
  });
});

describe('Filter: hasOnlyExpiredOffers', () => {
  test('has no offer and therefore no expired offer', () => {
    const player: MarketPlayer = { ...playerStubWithoutOffer };
    expect(hasOnlyExpiredOffers(player)).toBe(false);
  });

  test('has only one expired offer', () => {
    const player: MarketPlayer = {
      ...playerStubWithoutOffer,
      offers: [getOfferStub(modifyNowHour(-1))],
    };
    expect(hasOnlyExpiredOffers(player)).toBe(true);
  });

  test('has only a non expired offer', () => {
    const player: MarketPlayer = {
      ...playerStubWithoutOffer,
      offers: [getOfferStub(modifyNowHour(1))],
    };
    expect(hasOnlyExpiredOffers(player)).toBe(false);
  });

  test('has a non expired and an expired offer => false', () => {
    const player: MarketPlayer = {
      ...playerStubWithoutOffer,
      offers: [getOfferStub(modifyNowHour(1)), getOfferStub(modifyNowHour(-1))],
    };
    expect(hasOnlyExpiredOffers(player)).toBe(false);
  });

  test('marketStub No. 2 is not expired', () => {
    expect(hasOnlyExpiredOffers(marketStub.players[1])).toBe(false);
  });
});

const writeResult = (): void => {
  fs.writeFileSync(
    './result.json',
    JSON.stringify(
      getUsersPlayersWithTooLowOrExpiredOffers(
        marketStub,
        userId,
        offer_threshold
      )
    )
  );
};

// writeResult();

describe('Test getUsersPlayersWithTooLowOrExpiredOffers function', () => {
  const result = getUsersPlayersWithTooLowOrExpiredOffers(
    marketStub,
    userId,
    offer_threshold
  );
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
    ).toBe(true);
  });

  test('have all offers', () => {
    expect(result.length == result.filter(hasOffer).length).toBe(true);
  });

  test(`have all offers below treshold ${offer_threshold} % or are expired`, () => {
    expect(
      result.length ==
        result.filter(hasOnlyExpiredOffers).length +
          result.filter(hasNoHighOffers(offer_threshold)).length
    ).toBe(true);
  });
});
