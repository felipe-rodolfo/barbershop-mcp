import "dotenv/config";
import { callLaravelAPI } from "../utils/api-client.js";

async function getTimeSlot(barbershop_id: number, date: string) {
    if(!barbershop_id || !date) {
        throw new Error("Barbershop ID and date are required");
    }

    try {
        const timeSlots = await callLaravelAPI(`/timeslots?barbershop_id=${barbershop_id}&date=${date}`);
        return timeSlots;
    } catch (error) {
        throw new Error("Failed to fetch time slots from API");
    }
}

export { getTimeSlot };