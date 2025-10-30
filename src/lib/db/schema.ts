import Dexie, { Table } from "dexie";
import { Budget, Transaction } from "@/types/models";

export class BuckwheatDatabase extends Dexie {
  budgets!: Table<Budget>;
  transactions!: Table<Transaction>;

  constructor() {
    super("BuckwheatDB");

    this.version(1).stores({
      budgets: "&id, startDate, endDate, isActive, createdAt",
      transactions: "&id, budgetId, timestamp, amount, createdAt",
    });
  }
}

export const db = new BuckwheatDatabase();
