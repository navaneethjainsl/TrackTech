document.addEventListener("DOMContentLoaded", function() {
    const counterContainers = document.querySelectorAll(".counter");

    // Loop through each counter container
    counterContainers.forEach(counterContainer => {
        const decrementButton = counterContainer.querySelector(".decrement");
        const incrementButton = counterContainer.querySelector(".increment");
        const seatsInput = counterContainer.querySelector(".seats");
        const availableSeatsSpan = counterContainer.querySelector(".available-seats");

        let availableSeats = 100; // Assuming initial available seats

        // Update available seats count
        function updateAvailableSeats() {
            const selectedSeats = parseInt(seatsInput.value);
            availableSeats = 100 - selectedSeats;
            availableSeatsSpan.textContent = `Available seats: ${availableSeats}`;
        }

        // Event listener for decrement button
        decrementButton.addEventListener("click", function() {
            seatsInput.stepDown();
            updateAvailableSeats();
        });

        // Event listener for increment button
        incrementButton.addEventListener("click", function() {
            seatsInput.stepUp();
            updateAvailableSeats();
        });

        // Event listener for seats input change
        seatsInput.addEventListener("change", updateAvailableSeats);
    });
});


function changed(){
    console.log("changed");
}