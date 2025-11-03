import { Link } from "react-router";
import type { Route } from "./+types/home";
import db from "../database";
import Header from "../components/header";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export const loader = async () => {

 const items = await db.query.items.findMany({
    orderBy: (items, { desc }) => [desc(items.createdAt)],
 });

 return items
}

export default function Home({ loaderData: items }: Route.ComponentProps) {
  return (
    <div>

      <div className="mt-6 grid gap-4">
        {items.map((item, index) => (
          <div key={index} className="card bg-base-100 shadow-md p-4 flex items-center gap-4">
            <div key={index} className="p-4 border-b">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-gray-600">Quantity: {item.amountInStock}</p>
              {item.image && (
                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover mt-2 rounded-lg border border-base-300" />
              )}

              <Link to={`/edit-item/${item.id}`} className="btn btn-sm btn-primary mt-2">Edit Item</Link>
              <Link to={`/item/${item.id}`} className="btn btn-sm btn-primary mt-2">View Item</Link>
              <Link to={`/entry/${item.id}`} className="btn btn-sm btn-primary mt-2">New Entry</Link>
            </div>
          </div>
        ))}
      </div>

      <Link to={'/add-item'}>
        Add Item
      </Link>

      <Link to={'/transactions'}>
        View Transactions
      </Link>
    </div>
  )
}
