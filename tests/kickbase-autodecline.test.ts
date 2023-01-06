import { MarketPlayer, Offer } from '../src/api/interfaces';
import { exportedForTesting } from '../src/kickbase-autodecline';

const { isNotExpiredOffer, hasNonExpiredOffer, hasOffer } = exportedForTesting;

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

describe('Filter: hasNonExpiredOffer', () => {
  test('has no offer and therefore no expired offer', () => {
    const player: MarketPlayer = { ...playerStubWithoutOffer };
    expect(hasNonExpiredOffer(player)).toBe(false);
  });

  test('has only expired offer', () => {
    const player: MarketPlayer = {
      ...playerStubWithoutOffer,
      offers: [getOfferStub(modifyNowHour(-1))],
    };
    expect(hasNonExpiredOffer(player)).toBe(false);
  });

  test('has only a non expired offer', () => {
    const player: MarketPlayer = {
      ...playerStubWithoutOffer,
      offers: [getOfferStub(modifyNowHour(1))],
    };
    expect(hasNonExpiredOffer(player)).toBe(true);
  });

  test('has a non expired and an expired offer => true', () => {
    const player: MarketPlayer = {
      ...playerStubWithoutOffer,
      offers: [getOfferStub(modifyNowHour(1)), getOfferStub(modifyNowHour(-1))],
    };
    expect(hasNonExpiredOffer(player)).toBe(true);
  });
});
