import { is } from 'cheerio/lib/api/traversing';
import { Offer } from '../src/api/interfaces';
import { exportedForTesting } from '../src/kickbase-autodecline';

const { isNotExpiredOffer, hasNonExpiredOffer } = exportedForTesting;

describe('Filter: isNotExpiredOffer', () => {
  const offerStub: Offer = {
    id: '1234518516',
    price: 1,
    date: '2022-12-06T16:48:13Z',
  };

  const testExpirationDate = (validUntilDate: string): boolean => {
    const offer: Offer = { ...offerStub, validUntilDate };
    return isNotExpiredOffer(offer)(offer);
  };

  const modifyNowHour = (hour: number): string => {
    const now = new Date();
    now.setHours(now.getHours() + hour);
    return now.toISOString();
  };

  test('1 hour from now is not expired', () => {
    expect(testExpirationDate(modifyNowHour(1))).toBe(true);
  });
  test('now is already expired', () => {
    expect(testExpirationDate(Date())).toBe(false);
  });
  test('now -1 hour is expired', () => {
    expect(testExpirationDate(modifyNowHour(-1))).toBe(false);
  });
});
