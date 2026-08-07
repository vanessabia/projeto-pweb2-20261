import { http, HttpResponse } from "msw";

const goals = [
  {
    id: 1,
    name: "Comprar Notebook",
    targetAmount: 5000,
    startDate: "2026-07-22",
    deadline: "2026-12-31",
    categoryId: 1,
  },
];

const categories = [
  {
    id: 1,
    name: "Alimentação",
  },
  {
    id: 2,
    name: "Transporte",
  },
];

export const handlers = [
  http.get("http://localhost:8080/goals", () => {
    return HttpResponse.json(goals);
  }),

  http.get("http://localhost:8080/transactions", () => {
    return HttpResponse.json({ content: [],});
  }),

  http.get("http://localhost:8080/categories", () => {
    return HttpResponse.json(categories);
  }),
];