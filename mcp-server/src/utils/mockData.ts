const hairCutsMock = [
    {
        id: 1,
        name: "Corte Clássico",
        price: 50
    },
    {
        id: 2,
        name: "Corte Militar",
        price: 25
    },
    {
        id: 3,
        name: "Corte Fade",
        price: 85
    }
]

const timeSlotMock = [
    {
        id: 1,
        date: "2026-06-06",
        time: "09:00",
        available: true
    },
    {
        id: 2,
        time: "16:00",
        date: "2026-07-01",
        available: true
    },
    {
        id: 3,
        time: "14:30",
        date: "2026-08-27",
        available: false
    },
]

export {hairCutsMock, timeSlotMock};