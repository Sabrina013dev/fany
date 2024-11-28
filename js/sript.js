document.addEventListener('DOMContentLoaded', function () {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').setAttribute('min', today);
  document.getElementById('date').value = today;
});


document.getElementById('date').addEventListener('change', function () {
  const selectedDate = this.value;
  updateAvailableTimes(selectedDate);
});


function updateAvailableTimes(date) {
  const timeSelect = document.getElementById('time');
  timeSelect.innerHTML = ''; 

  if (!date) return;

  
  const availableTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];


  availableTimes.forEach(time => {
    const option = document.createElement('option');
    option.value = time;
    option.textContent = time;
    timeSelect.appendChild(option);
  });
}