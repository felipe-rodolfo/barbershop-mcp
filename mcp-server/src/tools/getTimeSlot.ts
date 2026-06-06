import { timeSlotMock } from "../utils/mockData.js";

function getTimeSlot(barbershop_id: number, date: string): typeof timeSlotMock {
    if(!barbershop_id) {
        throw new Error("Barbershop not found");
    }
    if(!date) {
        throw new Error("Date not available");
    }
    return timeSlotMock.filter(slot => slot.date === date);
}

export { getTimeSlot }