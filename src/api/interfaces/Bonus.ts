export interface BonusCollect {
  err: number;
  errMsg?: string;
}

export interface Bonus {
  isAvailable: boolean;
  amount: number;
  level: number;
  il: boolean;
  is: false;
}
