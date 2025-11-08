import { Link } from "react-router";
import type { Route } from "./+types/transactions";
import db from "../database";
import Header from "../components/header";
import { useSearchParams } from 'react-router'

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

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return await db.query.transactions.findMany({
      where: (transactions, { and, gte, lt }) =>
        and(
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
};

export default function TransactionsPage({ loaderData: transactions }: Route.ComponentProps) {
  const [ searchParams , setSearchParams ] = useSearchParams()
  return (
    <div className="p-6 space-y-6">

      <Header />
      <div className="form-control w-full max-w-xs">
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="date"
                        className="grow"
                        defaultValue={searchParams.get("date") || ""}
                        onChange={e => setSearchParams({ date: e.target.value })}
                    />
                </label>
            </div>

      <Link to="/" className="btn btn-secondary w-full">Back</Link>
      <h1 className="text-3xl font-bold mt-4">Recent Transactions</h1>

      <div className="grid gap-4">
        {transactions.map((transaction, index) => (
          <div 
            key={index} 
            className="card bg-base-100 shadow-lg border border-base-300 p-4"
          >
            <div className="space-y-2">
              <p><span className="font-semibold">Item:</span> {transaction.item.name}</p>
              <p><span className="font-semibold">Info:</span> {transaction.reason}</p>
              <p><span className="font-semibold">Type:</span> {transaction.type}</p>
              <p><span className="font-semibold">Quantity:</span> {transaction.quantity}</p>
              <p>
                <span className="font-semibold">Date:</span> 
                {" "}{new Date(transaction.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
        <Link to="/" className="btn btn-secondary w-full">Back</Link>
    </div>
  );
}
