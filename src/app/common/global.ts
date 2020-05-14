import { } from '@angular/core';

export class GlobalConstants {
  public constructor() { }

  public static truckItems: any[] = [];
  public static allImgs: any[] = [];
  public static clickedItem: boolean = false;

  /*
    truckItems should look like this:

    [
      {
        id: 12345,
        time: 10:25,
        imgs: [],
      }
    ]

    create an object with id of the shipment, a timestamp and imgs then push to the 
    truck items arr
  */
}