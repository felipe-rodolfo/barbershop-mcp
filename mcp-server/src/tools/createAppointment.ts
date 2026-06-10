import { callLaravelAPI } from "../utils/api-client.js";

async function createAppointment(
    barbershop_id: number, 
    haircut_id: number, 
    time_slot_id: number, 
    customer_name: string, 
    customer_phone: string
) {
    if(!barbershop_id || !haircut_id || !time_slot_id || !customer_name || !customer_phone) {
        throw new Error("All fields are required");
    }

    try {
        const appointment = await callLaravelAPI("/appointments", {
            method: "POST",
            body: JSON.stringify({
                barbershop_id,
                haircut_id,
                time_slot_id,
                customer_name,
                customer_phone,
            }),
        });

        return appointment;
    } catch (error) {
        throw new Error("Failed to create appointment");
    }
}

export { createAppointment };