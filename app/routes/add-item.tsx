import type { Route } from "./+types/add-item";
import { useState } from "react";
import { Form } from "react-router"

export async function action({ request }: Route.ActionArgs) {

    const data = await request.formData()
}

function AddItemSection() {

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

    // Handle form submission
    function handleSubmit(e: any) {
        e.preventDefault();
        if (!form.name || !form.quantity || !form.image) return alert("Please fill all fields");

        const newItem = {
            name: form.name,
            quantity: form.quantity,
            image: preview
        };


        setForm({ name: "", quantity: "", image: null });
        setPreview(null);
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">Add New Item</h2>

            {/* Form */}
            <Form method='POST' encType="multipart/form-data" className="card bg-base-200 p-4 shadow-md space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Item name"
                    value={form.name}
                    onChange={handleChange}
                    className="input input-bordered w-full"
                />

                <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={form.quantity}
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
                {preview && (
                    <div className="flex justify-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-base-300"
                        />
                    </div>
                )}

                <button type="submit" className="btn btn-primary w-full">Add Item</button>
            </Form>

            {/* Display added items */}
            {/* <div className="mt-6 grid gap-4">
            {items.map((item, index) => (
            <div key={index} className="card bg-base-100 shadow-md p-4 flex items-center gap-4">
                <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
                />
                <div>
                <h3 className="font-bold">{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                </div>
            </div>
            ))}
        </div> */}
        </div>
    );
}

export default AddItemSection;
