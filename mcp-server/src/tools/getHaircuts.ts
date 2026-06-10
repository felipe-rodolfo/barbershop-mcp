import { callLaravelAPI } from "../utils/api-client.js";


async function getHaircuts(barbershop_id: number) {
    if(!barbershop_id){
        throw new Error("Barbershop not found");
    }

    try {
        const haircuts = await callLaravelAPI(`/haircuts?babershop_id=${barbershop_id}`);
        return haircuts;
    } catch(error) {
        throw new Error("Failed to fetch haircuts from API");
    }
}

export { getHaircuts }