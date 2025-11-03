import { Form, Link, redirect } from "react-router"
import type { Route } from "./+types/entry";
import db from "../database";
import { items, transactions } from "../database/schemas";
import { eq } from "drizzle-orm";

export async function action({ request, params }: Route.ActionArgs) {

    const data = await request.formData();
    const quantity = Number(data.get("quantity"));
    const reason = String(data.get("reason"));
    const type = String(data.get("type"));
    console.log("Quantity:", quantity);

    const [item] = await db.select().from(items).where(eq(items.id, params.id));

    if (item && type == "decrement" && item.amountInStock < quantity) {
        return {
            success: false,
            message: "Insufficient stock available."
        }
    }

    const [transaction] = await db.insert(transactions).values({
        quantity,
        reason,
        type,
        itemId: params.id
    }).returning()

    if (transaction) {
        await db.update(items).set({
            amountInStock: type == "increment" ? item.amountInStock + quantity : item.amountInStock - quantity
        }).where(eq(items.id, params.id!));
    } else {
        return {
            success: false,
            message: "Something went wrong creating the transaction."
        }
    }

    throw redirect(`/`);

    return null;
}

function EntryPage({ actionData }: Route.ComponentProps) {
    return (
        <main>
            <Form method="post" className="flex flex-col gap-4 max-w-md mx-auto mt-8">
                {
                    actionData?.message && !actionData.success && (
                        <p className="text-red-500 mb-4">{actionData.message}</p>
                    )
                }
                <div>
                   <input id="increment" type="radio" name="type" value={"increment"} placeholder="Increment"/> 
                   <label htmlFor="increment">Increment</label>
                   <input id="decrement" type="radio" name="type" value={"decrement"} placeholder="Decrement"/>
                   <label htmlFor="decrement">Decrement</label>
                </div>
                <input type="text" name="reason" placeholder="Reason" />
                <input type="number" name="quantity" placeholder="Quantity" />
                <button>Create</button>
                <Link to={'/'}>Cancel</Link>
            </Form>
        </main>
    )
}

export default EntryPage