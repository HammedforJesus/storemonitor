import { Link } from "react-router";
import type { Route } from "./+types/transactions";
import db from "../database";
import Header from "../components/header";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader = async ({ request }: Route.LoaderArgs) => {

  const searchParams = new URLSearchParams(new URL(request.url).search);

  const filter = searchParams.get("date");


  if (filter) {
    const targetDate = new Date(filter);

    // get start and end of that day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return await db.query.transactions.findMany({
      where: (transactions, { and , gte , lt }) => and(
          gte(transactions.createdAt, startOfDay),
          lt(transactions.createdAt, endOfDay)
      ),
      orderBy: (transactions, { desc }) => [desc(transactions.createdAt)],
      with: { item: true },
    });
  } else {

    return await db.query.transactions.findMany({
      orderBy: (transactions, { desc }) => [desc(transactions.createdAt)],
      with: { item: true },
    });
  }
}

export default function TransactionsPage({ loaderData: transactions }: Route.ComponentProps) {
  return (
    <div>

      <Header />

      <h1 className="text-3xl mb-6">Recent Transactions</h1>

      <div className="mt-6 grid gap-4">
        {transactions.map((transaction, index) => (
          <div key={index} className="card bg-base-100 shadow-md p-4 flex items-center gap-4">
            <div key={index} className="p-4 border-b">
              <p>Item: {transaction.item.name}</p>
              <p>Info: {transaction.reason}</p>
              <p>Type: {transaction.type}</p>
              <p>Quantity: {transaction.quantity}</p>
              <p>Date: {new Date(transaction.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
