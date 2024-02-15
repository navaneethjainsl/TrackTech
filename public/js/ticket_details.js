let data = `body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-image: url(../pics/Untitled\ design.png);
        background-size: cover; /* Optional: Adjust background size */
        background-attachment: fixed;
    }

    .ticket-details-container {
        max-width: 400px;
        margin: 50px auto;
        padding: 20px;
        background-color: #f4f4f4;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    h2 {
        margin-bottom: 20px;
    }

    .ticket-details {
        text-align: left;
        margin-bottom: 20px;
    }

    .ticket-details p {
        margin: 5px 0;
    }

    button {
        padding: 10px;
        background-color: #333;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    button:hover {
        background-color: #555;
    }
`

function printInfo(ele) {
    var openWindow = window.open("", "title", "attributes");
    console.log(ele.parentNode.parentNode);
    openWindow.document.write('<html><head><title>Ticket Details</title><style>');
    openWindow.document.write(data);
    openWindow.document.write('</style></head><body><div class="ticket-details-container"><h2>Ticket Details</h2></div>');
    openWindow.document.write(ele.parentNode.parentNode.innerHTML);
    openWindow.document.write('</body></html>');

    openWindow.document.close();
    openWindow.focus();
    openWindow.print();
    openWindow.close();
}