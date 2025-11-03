import React from 'react'
import db from '../database';
import type { Route } from './+types/view-item';

export const loader = async ({ request , params }: Route.LoaderArgs) => {
    const itemId = params.id;
    // Fetch item details from the database using itemId
    const items = await db.query.items.findFirst({
        where: (items, { eq }) => eq(items.id, itemId),
        with: { transactions: true }
    });

    console.log(items);

    return items;
}

function ViewItemPage({ loaderData: data } : Route.ComponentProps) {
  return (
    <div>
        <h1 className='text-3xl'>{data?.name}</h1>

        <p className='mt-4'>Amount in Stock: {data?.amountInStock}</p>

        <img src={data?.image} alt={data?.name} className="w-32 h-32 object-cover rounded mt-4" />
        <h2 className='text-2xl mt-6'>Transactions</h2>
        <div className='mt-4'>
            {data?.transactions.map((transaction, index) => (
                <div key={index} className="p-4 border-b">
                    <p>Info: {transaction.reason}</p>
                    <p>Type: {transaction.type}</p>
                    <p>Quantity: {transaction.quantity}</p>
                    <p>Date: {new Date(transaction.createdAt).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default ViewItemPage