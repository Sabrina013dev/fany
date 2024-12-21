document.getElementById('date').addEventListener('change', async function () {
    const date = this.value;
    const response = await fetch(`/available-times?date=${date}`);
    const times = await response.json();
    const timeSelect = document.getElementById('time');
    timeSelect.innerHTML = '';
  
    if (times.length > 0) {
      times.forEach(time => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeSelect.appendChild(option);
      });
    } else {
      const option = document.createElement('option');
      option.textContent = 'Nenhum horário disponível';
      timeSelect.appendChild(option);
    }
  });
  
  document.getElementById('appointment-form').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    data.services = formData.getAll('service');
  
    const response = await fetch('/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    if (response.ok) {
      alert('Agendamento realizado com sucesso!');
      this.reset();
    } else {
      alert('Erro ao agendar.');
    }
  });
  