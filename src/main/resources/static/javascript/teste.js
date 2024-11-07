document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');

    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'pt-br',
        initialView: 'timeGridWeek',
        headerToolbar: false,
        slotMinTime: '08:00:00',
        slotMaxTime: '20:00:00',
        events: [
            {
                title: 'Consulta com Maria',
                start: '2024-10-23T10:00:00',
                end: '2024-10-23T11:00:00',
            },
            {
                title: 'Consulta com João',
                start: '2024-10-24T14:00:00',
                end: '2024-10-24T15:00:00',
            }
        ],
        allDaySlot: false
    });

    calendar.render();

    // Botões de navegação
    document.getElementById('todayButton').addEventListener('click', function() {
        calendar.today();
    });

    document.getElementById('monthPicker').addEventListener('change', function() {
        const date = new Date(this.value + '-01');
        calendar.gotoDate(date);
    });

    document.getElementById('viewSelector').addEventListener('change', function() {
        calendar.changeView(this.value);
    });
});
