export class Harvest {
  constructor(
    public id: string,
    public date: string,
    public farm: string,
    public plant: string,
    public quantity: number,
    public comment?: string
  ) {  }
}
