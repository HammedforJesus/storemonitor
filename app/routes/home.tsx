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

  return items;
};

export default function Home({ loaderData: items }: Route.ComponentProps) {
  return (
    <div className="p-6 space-y-8">

      <Header />

      {/* Top Buttons */}
      <div className="flex justify-end gap-4 mt-4">
        <Link to="/add-item" className="btn btn-primary">
          Add Item
        </Link>

        <Link to="/transactions" className="btn btn-outline">
          View Transactions
        </Link>
      </div>

      {/* Items Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="card bg-base-100 shadow-lg border border-base-300 p-4"
          >
            <div className="space-y-3">

              <h3 className="text-xl font-semibold">{item.name}</h3>

              <p className="text-sm text-gray-600">
                Amount in Stock: <span className="font-medium">{item.amountInStock}</span>
              </p>

              {item.image && (
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-40 object-cover rounded-lg border border-base-300"
                />
              )}

              {/* Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Link 
                  to={`/edit-item/${item.id}`} 
                  className="btn btn-primary btn-sm w-full"
                >
                  Edit Item
                </Link>

                <Link 
                  to={`/item/${item.id}`} 
                  className="btn btn-info btn-sm w-full"
                >
                  View Item
                </Link>

                <Link 
                  to={`/entry/${item.id}`} 
                  className="btn btn-success btn-sm w-full"
                >
                  New Entry
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
