trainsTag = document.querySelectorAll('#trains');
trains = JSON.parse(trainsTag[0].value)
console.log(trains)

capacityTag = document.querySelectorAll('#capacity');
capacities = JSON.parse(capacityTag[0].value)
console.log(capacities)

function change(obj, i){
    train = JSON.parse(obj);
    console.log(train);
    
    let val = Number(document.getElementsByTagName('select')[i].value);
    console.log(val);

    price = document.querySelector(`#price${i}`);
    pricei = document.querySelector(`#price${i}i`);
    console.log(price);
    price.innerText = val * train.price;
    pricei.value = val * train.price;

    capacity = document.querySelector(`#capacity${i}`);
    capacityi = document.querySelector(`#capacity${i}i`);
    console.log(capacity);

    const ratio1 = 1;
    const ratio2 = 2;
    const ratio3 = 3;
    const ratio4 = 4;
    const ratio5 = 5;
    let booked = 0;

    // Calculate the total sum of the ratios
    const totalRatio = ratio1 + ratio2 + ratio3 + ratio4 + ratio5;

    // Calculate individual values based on the ratios and the total value
    const totalValue = capacities[i].capacity_total; // Total value to distribute based on the ratios
    
    switch(val){
        case 5:
            booked = capacities[i].booked_1A;
            break;
        
        case 4:
            booked = capacities[i].booked_2A;
            break;
        
        case 3:
            booked = capacities[i].booked_3A;
            break;
            
        case 2:
            booked = capacities[i].booked_ac;
            break;
        
        case 1:
            booked = capacities[i].booked_sleeper;
            break;

        default:
            capacity.innerText = '--';
            return;
        
    }

    // console.log(((6-val) / totalRatio) * totalValue);
    // console.log(booked);
    let available = Math.round(((6-val) / totalRatio) * totalValue) - booked;
    capacity.innerText = available;
    capacityi.value = available;
    document.getElementsByClassName('seats')[i].setAttribute("max", available);
}



// document.addEventListener("DOMContentLoaded", function() {
//     const counterContainers = document.querySelectorAll(".counter");

//     // Loop through each counter container
//     counterContainers.forEach(counterContainer => {
//         const decrementButton = counterContainer.querySelector(".decrement");
//         const incrementButton = counterContainer.querySelector(".increment");
//         const seatsInput = counterContainer.querySelector(".seats");
//         const availableSeatsSpan = counterContainer.querySelector(".available-seats");

//         let availableSeats = 100; // Assuming initial available seats

//         // Update available seats count
//         function updateAvailableSeats() {
//             const selectedSeats = parseInt(seatsInput.value);
//             availableSeats = 100 - selectedSeats;
//             availableSeatsSpan.textContent = `Available seats: ${availableSeats}`;
//         }

//         // Event listener for decrement button
//         decrementButton.addEventListener("click", function() {
//             seatsInput.stepDown();
//             updateAvailableSeats();
//         });

//         // Event listener for increment button
//         incrementButton.addEventListener("click", function() {
//             seatsInput.stepUp();
//             updateAvailableSeats();
//         });

//         // Event listener for seats input change
//         seatsInput.addEventListener("change", updateAvailableSeats);
//     });
// });


// function changed(){
//     console.log("changed");
// }