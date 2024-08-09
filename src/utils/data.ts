import React from "react";

type Product = {
  id: string;
  productName: string;
  quantity: number;
  location: string;
  image: string;
  note: string;
}

const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "PRODUCT NAME", uid: "productName", sortable: true},
  {name: "QUANTITY", uid: "quantity", sortable: true},
  {name: "LOCATION", uid: "location", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];

const locationOptions = [
  {name: "Pantry", uid: "pantry"},
  {name: "Fridge", uid: "fridge"},
  {name: "Freezer", uid: "freezer"},
];

export {columns, locationOptions};
export type {Product};