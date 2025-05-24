export interface IGasto extends IGastoCreation {
  id: number;
}

export interface IGastoCreation {
  expense: number;
  category: string;
  description: string;
  date: Date;
}
