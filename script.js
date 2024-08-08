document.addEventListener("DOMContentLoaded", () => {
    const eventForm = document.getElementById("eventForm");
    const eventDate = document.getElementById("eventDate");
    const eventTime = document.getElementById("eventTime");
    const alertContainer = document.getElementById("alertContainer");

    // Flatpickr initialisieren
    flatpickr(eventDate, {
        dateFormat: "d.m.Y",
        disable: [
            function (date) {
                // Sonntage deaktivieren
                return (date.getDay() === 0);
            }
        ],
        locale: {
            firstDayOfWeek: 1 // Montag als erster Tag der Woche
        },
        onChange: function (selectedDates, dateStr, instance) {
            populateTimeSlots();
        }
    });

    function populateTimeSlots() {
        const times = [];
        for (let i = 8; i <= 16; i++) {
            times.push(`${i}:00`);
        }
        eventTime.innerHTML = '<option value="">Bitte Zeit auswählen</option>';
        times.forEach(time => {
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            eventTime.appendChild(option);
        });
    }

    eventForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("eventName").value;
        const service = document.getElementById("service").value;
        const date = document.getElementById("eventDate").value;
        const time = document.getElementById("eventTime").value;
        addEvent(name, service, date, time);
        eventForm.reset();
        eventTime.innerHTML = '<option value="">Bitte Zeit auswählen</option>'; // Reset time slots
    });

    function addEvent(name, service, date, time) {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('service', service);
        formData.append('date', date);
        formData.append('time', time);

        fetch('add_termin.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                if (data === 'success') {
                    showAlert("Der Termin wurde für Sie gebucht, vielen Dank!", "success");
                    bootstrap.Modal.getInstance(document.getElementById('terminModal')).hide();
                } else {
                    showAlert("Es gab ein Problem bei der Buchung des Termins. Bitte versuchen Sie es erneut.", "danger");
                }
            })
            .catch(error => {
                showAlert("Es gab ein Problem bei der Buchung des Termins. Bitte versuchen Sie es erneut.", "danger");
            });
    }

    function showAlert(message, type) {
        const alert = document.createElement("div");
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.role = "alert";
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        alertContainer.appendChild(alert);
        setTimeout(() => {
            alert.classList.remove("show");
            setTimeout(() => {
                alert.remove();
            }, 150); // Zeit für das Ausblenden
        }, 3000);
    }
});
