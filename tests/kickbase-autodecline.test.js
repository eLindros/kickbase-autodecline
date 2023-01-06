"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kickbase_autodecline_1 = require("../src/kickbase-autodecline");
const { isNotExpiredOffer, hasNonExpiredOffer } = kickbase_autodecline_1.exportedForTesting;
describe('Filter: isNotExpiredOffer', () => {
    const offerStub = {
        id: '1234518516',
        price: 1,
        date: '2022-12-06T16:48:13Z',
    };
    const testExpirationDate = (validUntilDate) => {
        const offer = Object.assign(Object.assign({}, offerStub), { validUntilDate });
        return isNotExpiredOffer(offer)(offer);
    };
    const modifyNowHour = (hour) => {
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
