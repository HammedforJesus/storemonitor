import type { Route } from "./+types/edit-item";
import { useState } from "react";
import { Form, Link, redirect } from "react-router"
import db from "../database";
import { items } from "../database/schemas";
import { eq } from "drizzle-orm";

export async function loader({ request , params }: Route.LoaderArgs) {

    const itemId = params.id;

    const item = await db.query.items.findFirst({
        where: (items, { eq }) => eq(items.id, itemId)
    });

    return item;
}

export async function action({ request , params }: Route.ActionArgs) {

    const data = await request.formData();

    let uploadDataResult;

    if(data.get("image")) {
        const uploadData = new FormData();
    
        uploadData.append("file", data.get("image") as Blob);
        uploadData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET as string);
    
        const result = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`, {
            method: "POST",
            body: uploadData,
        });

        uploadDataResult = await result.json();
    }


    const newItem = {
        name: String(data.get("name")),
        amountInStock: Number(data.get("quantity")),
    };

    if(uploadDataResult && uploadDataResult.url) {
        (newItem as any).image = uploadDataResult.url;
    }

    await db.update(items).set(newItem).where(eq(items.id, params.id!));

    throw redirect('/')
}

function EditItemPage({ loaderData: item } : Route.ComponentProps) {

    const [form, setForm] = useState({
        name: "",
        quantity: "",
        image: null
    });
    const [preview, setPreview] = useState(null);

    // Handle text and number input
    function handleChange(e: any) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // Handle file input
    function handleFileChange(e: any) {
        const file = e.target.files[0];
        setForm(prev => ({ ...prev, image: file }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as any);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Edit Item</h2>

            {/* Form */}
            <Form method='POST' encType="multipart/form-data" className="card bg-base-200 p-4 shadow-md space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Item name"
                    defaultValue={item?.name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                    />

                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    defaultValue={item?.amountInStock}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                />

                <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full"
                />

                {/* Image preview before adding */}
                {preview || item?.image && (
                    <div className="flex justify-center">
                        <img
                            src={preview || item?.image}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-base-300"
                        />
                    </div>
                )}

                <button type="submit" className="btn btn-primary w-full">Save</button>
                <Link to="/" className="btn btn-secondary w-full">Cancel</Link>
            </Form>
        </div>
    );
}

export default EditItemPage;
