import { timeSlotMock } from "../utils/mockData.js";

function createAppointment(
    barbershop_id: number, 
    haircut_id: number, 
    time_slot_id: number, 
    customer_name: string, 
    customer_phone: string
) {

    const timeSlot = timeSlotMock.find(slot => slot.id === time_slot_id);
    if(!timeSlot) {
        throw new Error("Time slot not found");
    }

    if(!timeSlot.available) {
        throw new Error("Time slot not available");
    }

    const appointment = {
        id: Date.now(),
        barbershop_id,
        haircut_id,
        time_slot_id,
        customer_name,
        customer_phone,
        created_at: new Date().toISOString()
    };

    return appointment;
}

export { createAppointment }