import React from 'react'
import db from '../database';
import type { Route } from './+types/view-item';
import { Link } from 'react-router';

export const loader = async ({ request , params }: Route.LoaderArgs) => {
  const itemId = params.id;

  const items = await db.query.items.findFirst({
    where: (items, { eq }) => eq(items.id, itemId),
    with: { transactions: true }
  });

  return items;
}

function ViewItemPage({ loaderData: data } : Route.ComponentProps) {
  return (
    <div className="p-6 space-y-8">

      {/* Item Header */}
      <div className="flex items-center gap-6">
        <img 
          src={data?.image} 
          alt={data?.name} 
          className="w-32 h-32 object-cover rounded-xl shadow-md"
        />

        <div>
          <h1 className="text-4xl font-bold">{data?.name}</h1>
          <p className="text-lg mt-2">
            <span className="font-semibold">Amount in Stock:</span> {data?.amountInStock}
          </p>
        </div>
      </div>

      <Link to="/" className="btn btn-secondary w-full">Back</Link>
      <div className="divider">Transactions</div>

      {/* Transactions List */}
      <div className="space-y-4">
        {data?.transactions.length === 0 ? (
          <div className="alert shadow bg-base-200">
            <span>No transactions found for this item.</span>
          </div>
        ) : (
          data?.transactions.map((transaction, index) => (
            <div 
              key={index} 
              className="card bg-base-100 shadow-md border border-base-300 p-4"
            >
              <div className="space-y-2">

                <p>
                  <span className="font-semibold">Info:</span> {transaction.reason}
                </p>

                <p>
                  <span className="font-semibold">Type:</span>
                  {" "}
                  <span 
                    className={`badge ${
                      transaction.type === "add" 
                        ? "badge-success" 
                        : transaction.type === "remove" 
                        ? "badge-error" 
                        : "badge-neutral"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </p>

                <p>
                  <span className="font-semibold">Quantity:</span> {transaction.quantity}
                </p>

                <p>
                  <span className="font-semibold">Date:</span>
                  {" "}
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </p>

              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

export default ViewItemPage
