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
        const date = document.getElementById("eventDate").value;
        const time = document.getElementById("eventTime").value;
        addEvent(name, date, time);
        eventForm.reset();
        eventTime.innerHTML = '<option value="">Bitte Zeit auswählen</option>'; // Reset time slots
    });

    function addEvent(name, date, time) {
		
		const formData = new FormData();
            formData.append('name', 'Max');
		
		fetch('post_example.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
				console.log(data);
            })
            .catch(error => {
                console.error('Fehler:', error);
            });
		
        const request = new XMLHttpRequest();
        request.open("POST", "add_termin.php", true);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    showAlert("Der Termin wurde für Sie gebucht, vielen Dank!", "success");
                    bootstrap.Modal.getInstance(document.getElementById('terminModal')).hide();
                } else {
                    showAlert("Es gab ein Problem bei der Buchung des Termins. Bitte versuchen Sie es erneut.", "danger");
                }
            }
        };
        request.send(`name=${name}&date=${date}&time=${time}`);
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
