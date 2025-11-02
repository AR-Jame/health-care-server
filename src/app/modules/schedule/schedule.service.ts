import { addDays, addMinutes, format, isBefore, setHours, setMinutes } from "date-fns";
import { prisma } from "../../shared/prisma";

//********** My problemetic solution */ 
// const createSchedule = async (payload: any) => {

//     const startDate = new Date(payload.startDate);
//     const endDate = new Date(payload.endDate)

//     let currentDate = startDate;

//     const slotTime = 30;

//     while (currentDate <= endDate) {
//         const currentStartDateTime = new Date(
//             setMinutes(
//                 setHours(`${format(startDate, "yyyy-MM-dd")}`, Number(payload?.startTime?.split(":")?.[0])),
//                 Number(payload?.startTime?.split(":")?.[1])
//             )
//         )

//         const currentEndDateTime = new Date(
//             setMinutes(
//                 setHours(`${format(startDate, "yyyy-MM-dd")}`, Number(payload?.endTime?.split(":")?.[0])),
//                 Number(payload?.endTime?.split(":")?.[1])
//             )
//         )

//         let currentSlot = currentStartDateTime
//         console.log({ currentSlot: currentSlot.toLocaleString(), currentEndDateTime: currentEndDateTime.toLocaleString() });
//         while (currentSlot < currentEndDateTime) {
//             const currentTimeSlot = {
//                 startDateTime: currentStartDateTime,
//                 endDateTime: addMinutes(currentStartDateTime, slotTime)
//             }

//             console.log(currentTimeSlot);
//             currentSlot = addMinutes(currentStartDateTime, slotTime)
//         }

//         // console.log({ currentStartDateTime: currentStartDateTime.toLocaleString(), currentEndDateTime: currentEndDateTime.toLocaleString() });

//         currentDate = addDays(currentDate, 1);

//         // console.log({ startDateTime: startDateTime.toLocaleString(), endDateTime: endDateTime.toLocaleString() });
//     }


// }

/**  AI's naive solution **/

// const createSchedule = async (payload: any) => {
//     const startDate = new Date(payload.startDate);
//     const endDate = new Date(payload.endDate);
//     const slotTime = 30; // minutes

//     const schedules = []

//     let currentDate = startDate;

//     while (currentDate <= endDate) {
//         const startHour = Number(payload.startTime.split(":")[0]);
//         const startMinute = Number(payload.startTime.split(":")[1]);
//         const endHour = Number(payload.endTime.split(":")[0]);
//         const endMinute = Number(payload.endTime.split(":")[1]);

//         // Build start time
//         const currentStartDateTime = setMinutes(setHours(new Date(currentDate), startHour), startMinute);

//         // Build end time
//         let currentEndDateTime = setMinutes(setHours(new Date(currentDate), endHour), endMinute);

//         // ⚙️ If endTime is earlier than startTime, shift it to the next day
//         if (!isBefore(currentStartDateTime, currentEndDateTime)) {
//             currentEndDateTime = addDays(currentEndDateTime, 1);
//         }

//         let currentSlot = currentStartDateTime;

//         console.log("📅", format(currentDate, "yyyy-MM-dd"));
//         while (currentSlot < currentEndDateTime) {
//             const nextSlot = addMinutes(currentSlot, slotTime);

//             const currentTimeSlot = {
//                 startDateTime: currentSlot,
//                 endDateTime: nextSlot,
//             };



//             const existingSchedule = await prisma.schedule.findFirst({
//                 where: currentTimeSlot
//             })

//             if (!existingSchedule) {
//                 const result = await prisma.schedule.create({
//                     data: currentTimeSlot
//                 })
//                 schedules.push(result)
//             }

//             console.log(currentTimeSlot);

//             currentSlot = nextSlot;
//         }

//         currentDate = addDays(currentDate, 1);
//     }

//     return schedules
// };

/***** Final optimized solution **/


const createSchedule = async (payload: any) => {
    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);
    const slotTime = 30;

    const allSlots = [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
        const [startH, startM] = payload.startTime.split(":").map(Number);
        const [endH, endM] = payload.endTime.split(":").map(Number);

        const start = setMinutes(setHours(new Date(currentDate), startH), startM);
        let end = setMinutes(setHours(new Date(currentDate), endH), endM);
        if (!isBefore(start, end)) end = addDays(end, 1);

        let slot = start;
        while (slot < end) {
            const next = addMinutes(slot, slotTime);
            allSlots.push({ startDateTime: slot, endDateTime: next });
            slot = next;
        }
        currentDate = addDays(currentDate, 1);
    }

    const result = await prisma.schedule.createManyAndReturn({
        data: allSlots,
        skipDuplicates: true
    })

    console.log(result);

    return result;
};


export const scheduleService = {
    createSchedule
}