import { callLaravelAPI } from "../utils/api-client.js";

async function getTimeSlot(barbershop_id: number, date: string) {
    if(!barbershop_id) {
        throw new Error("Barbershop is required");
    }
    if(!date) {
        throw new Error("Date is required");
    }
    
    try {
        const timeSlots = await callLaravelAPI(`/timeslots?barbershop_id=${barbershop_id}&date=${date}`)
    } catch (error) {
        throw new Error("Failed to fetch time slots from API");
    }
}

export { getTimeSlot }