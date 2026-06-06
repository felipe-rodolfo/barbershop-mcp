import { hairCutsMock } from "../utils/mockData.js";

function getHaircuts(barbershop_id: number): typeof hairCutsMock {
    if(!barbershop_id){
        throw new Error("Barbershop not found");
    }

    return hairCutsMock;
}

export { getHaircuts }