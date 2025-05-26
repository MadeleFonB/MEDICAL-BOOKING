//const API_URL = 'http://localhost:5050/graphql';
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5050/graphql' 
  : `https://${window.location.hostname}/graphql`;


    async function fetchDoctors() {

        const query = `
    query {
      doctors {
        id
        name
        email
        specialty
      }
    }
  `;

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            if (!response.ok) {
                return [];
            }

            const { data, errors } = await response.json();

            if (errors) {
                return [];
            }
            return data.doctors;

        } catch (error) {
            return [];
        }
    }


    async function createDoctor(name, email, specialty) {
        const mutation = `
        mutation($name: String!, $email: String!, $specialty: Specialty!) {
          createDoctor(name: $name, email: $email, specialty: $specialty) {
            id
            name
            email
            specialty
          }
        }
      `;
        const variables = { name, email, specialty };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: mutation, variables }),
        });
        console.log('fetchDoctors: Petición enviada, esperando respuesta...');

        const { data, errors } = await response.json();
        if (errors) {
            throw new Error(errors.map(e => e.message).join(', '));
        }
        return data.createDoctor;
    }

    function renderDoctors(doctors) {
        const ul = document.getElementById('doctors-list');
        ul.innerHTML = '';
        doctors.forEach(doc => {
            const li = document.createElement('li');
            li.textContent = `${doc.name} (${doc.specialty}) - ${doc.email}`;

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.onclick = () => openEditDoctorForm(doc);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.onclick = () => deleteDoctor(doc.id);

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            ul.appendChild(li);
        });
    }

    function openEditDoctorForm(doc) {
        const form = document.getElementById('edit-doctor-form');
        document.getElementById('edit-doctor-modal').style.display = 'flex'; 
        document.getElementById('doctor-name').value = doc.name;
        document.getElementById('doctor-email').value = doc.email;
        document.getElementById('doctor-specialty').value = doc.specialty;
        form.dataset.doctorId = doc.id;
    }

    function openEditDoctorModal() {
        document.getElementById('edit-doctor-modal').style.display = 'block';
    }
    function closeEditDoctorModal() {
        document.getElementById('edit-doctor-modal').style.display = 'none';
    }

    async function deleteDoctor(id) {
        const mutation = `
        mutation($id: ID!) {
        deleteDoctor(id: $id)
        }`;
        const variables = { id };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: mutation, variables }),
        });
        const { data, errors } = await response.json();
        if (errors) {
            alert('Error eliminando doctor: ' + errors.map(e => e.message).join(', '));
            return;
        }
        await loadDoctors();
    }

    async function loadDoctors() {
        try {
            const doctors = await fetchDoctors();
            renderDoctors(doctors);
        } catch (err) {
            console.error('Error cargando doctores:', err);
        }
    }


    document.getElementById('create-doctor-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('error-msg');
        errorDiv.textContent = '';

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const specialty = document.getElementById('specialty').value;

        try {
            await createDoctor(name, email, specialty);
            await loadDoctors();
            await fillAppointmentSelects();  
            e.target.reset();
        } catch (err) {
            errorDiv.textContent = err.message;
        }
    });

    document.getElementById('edit-doctor-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const id = form.dataset.doctorId;
        const name = document.getElementById('doctor-name').value.trim();
        const email = document.getElementById('doctor-email').value.trim();
        const specialty = document.getElementById('doctor-specialty').value;

        const mutation = `
    mutation($id: ID!, $name: String!, $email: String!, $specialty: Specialty!) {
      updateDoctor(id: $id, name: $name, email: $email, specialty: $specialty) {
        id
        name
        email
        specialty
      }
    }
  `;
        const variables = { id, name, email, specialty };
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: mutation, variables }),
            });
            const { data, errors } = await response.json();
            if (errors) throw new Error(errors.map(e => e.message).join(', '));
            closeEditDoctorModal();
            loadDoctors();
            await loadDoctors(); 
        } catch (err) {
            alert('Error actualizando doctor: ' + err.message);
        }
    });


    async function fetchPatients() {
        const query = `
        query {
          patients {
            id
            name
            email
            age
          }
        }
      `;
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });
        const { data, errors } = await response.json();
        if (errors) {
            console.error(errors);
            return [];
        }
        return data.patients;
    }

    async function createPatient(name, email, age) {
        const mutation = `
        mutation($name: String!, $email: String!, $age: Int!) {
          createPatient(name: $name, email: $email, age: $age) {
            id
            name
            email
            age
          }
        }
      `;
        const variables = { name, email, age };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: mutation, variables }),
        });
        const { data, errors } = await response.json();
        if (errors) {
            throw new Error(errors.map(e => e.message).join(', '));
        }
        return data.createPatient;
    }

    function renderPatients(patients) {
        const ul = document.getElementById('patients-list');
        ul.innerHTML = '';
        patients.forEach(patient => {
            const li = document.createElement('li');
            li.textContent = `${patient.name} (${patient.age} años) - ${patient.email}`;

            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.onclick = () => openEditPatientForm(patient); 

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.onclick = () => deletePatient(patient.id);  

            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            ul.appendChild(li);
        });
    }


    function openEditPatientForm(patient) {
        const form = document.getElementById('edit-patient-form');
        document.getElementById('edit-patient-modal').style.display = 'flex'; 
    
        document.getElementById('edit-patient-name').value = patient.name;
        document.getElementById('edit-patient-age').value = patient.age;
        document.getElementById('edit-patient-email').value = patient.email;
    
        form.dataset.patientId = patient.id;
    }
    

    async function deletePatient(id) {
        const mutation = `
    mutation($id: ID!) {
      deletePatient(id: $id)
    }
  `;
        const variables = { id };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: mutation, variables }),
        });
        const { data, errors } = await response.json();
        if (errors) {
            alert('Error eliminando paciente: ' + errors.map(e => e.message).join(', '));
            return;
        }
        await loadPatients();
    }



    function openEditPatientModal() {
        document.getElementById('edit-patient-modal').style.display = 'block';
    }
    function closeEditPatientModal() {
        document.getElementById('edit-patient-modal').style.display = 'none';
    }

    async function loadPatients() {
        try {
            const patients = await fetchPatients();
            renderPatients(patients);
        } catch (err) {
            console.error('Error cargando pacientes:', err);
        }
    }

    document.getElementById('create-patient-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('patient-error-msg');
        errorDiv.textContent = '';

        const name = document.getElementById('patient-name').value.trim();
        const email = document.getElementById('patient-email').value.trim();
        const ageValue = document.getElementById('age').value.trim();
        const age = Number.isInteger(Number(ageValue)) ? Number(ageValue) : null;

        if (age === null || age <= 0) {
            errorDiv.textContent = 'Por favor, ingresa una edad válida (entero mayor que 0).';
            return;
        }

        try {
            await createPatient(name, email, age);
            await loadPatients();
            await fillAppointmentSelects(); 
            e.target.reset();
        } catch (err) {
            errorDiv.textContent = err.message;
        }
    });

    async function updatePatient(id, name, email, age) {
        const mutation = `
            mutation($id: ID!, $name: String!, $email: String!, $age: Int!) {
                updatePatient(id: $id, name: $name, email: $email, age: $age) {
                    id
                    name
                    email
                    age
                }
            }
        `;
        const variables = { id, name, email, age };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: mutation, variables }),
        });
        const { data, errors } = await response.json();
        if (errors) {
            throw new Error(errors.map(e => e.message).join(', '));
        }
        return data.updatePatient;
    }

    document.getElementById('edit-patient-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('edit-patient-error-msg');
        if(errorDiv) errorDiv.textContent = '';
    
        const form = e.target;
        const id = form.dataset.patientId;
        const name = document.getElementById('edit-patient-name').value.trim();
        const email = document.getElementById('edit-patient-email').value.trim();
        const ageValue = document.getElementById('edit-patient-age').value.trim();
        const age = Number.isInteger(Number(ageValue)) ? Number(ageValue) : null;
    
        if (age === null || age <= 0) {
            if(errorDiv) errorDiv.textContent = 'Por favor, ingresa una edad válida (entero mayor que 0).';
            return;
        }
    
        try {
            await updatePatient(id, name, email, age);
            await loadPatients();
            await fillAppointmentSelects();
            closeEditPatientModal();
        } catch (err) {
            if(errorDiv) errorDiv.textContent = err.message;
        }
    });
    
    

    // --- CITAS MÉDICAS ---
    async function fetchAppointments() {
        const query = `
        query {
          appointments {
            id
            date
            duration
            notes
            doctor {
              id
              name
            }
            patient {
              id
              name
            }
          }
        }
      `;
      
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });
        const { data, errors } = await response.json();
        if (errors) {
            console.error(errors);
            return [];
        }
        return data.appointments;
    }

    function formatDate(timestamp) {
        const dateObj = new Date(Number(timestamp));
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    
    function renderAppointments(appointments) {
        const ul = document.getElementById('appointments-list');
        ul.innerHTML = '';
        appointments.forEach(app => {
            const li = document.createElement('li');
    
            const dateStr = !isNaN(Number(app.date)) ? formatDate(app.date) : app.date;
    
            li.textContent = `📅 ${dateStr} - 👨‍⚕️ ${app.doctor.name} con 🧑 ${app.patient.name} - Duración: ${app.duration !== undefined ? app.duration + ' min' : 'N/D'} - Notas: ${app.notes ? app.notes : 'Ninguna'}`;
    
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Editar';
            editBtn.onclick = () => openEditAppointmentForm(app);
    
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Eliminar';
            deleteBtn.onclick = () => deleteAppointment(app.id);
    
            li.appendChild(editBtn);
            li.appendChild(deleteBtn);
            ul.appendChild(li);
        });
    }
    

    async function openEditAppointmentForm(app) {
        openEditAppointmentModal();
        await fillDoctorSelect('appointment-doctor-select', app.doctor.id);
        await fillPatientSelect('appointment-patient-select', app.patient.id);
    
        // Aquí agregas el código para manejar y validar la fecha:
        let dateObj;
        if (!isNaN(Number(app.date))) {
            dateObj = new Date(Number(app.date));
        } else {
            dateObj = new Date(app.date);
        }
    
        if (isNaN(dateObj.getTime())) {
            console.error('Fecha inválida:', app.date);
            document.getElementById('appointment-date').value = '';
            document.getElementById('appointment-time').value = '';
        } else {
            document.getElementById('appointment-date').value = dateObj.toISOString().slice(0, 10);
            document.getElementById('appointment-time').value = dateObj.toTimeString().slice(0, 5);
        }
    
        document.getElementById('appointment-duration').value = app.duration || '';
        document.getElementById('appointment-notes-edit').value = app.notes || '';
    
        const form = document.getElementById('edit-appointment-form');
        form.dataset.appointmentId = app.id;
    }
    
    
    

    async function fillDoctorSelect(selectId, selectedDoctorId) {
        const select = document.getElementById(selectId);
        if (!select) return;
            select.innerHTML = '';
            const doctors = await fetchDoctors(); 
        doctors.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = doc.name;
            if (doc.id === selectedDoctorId) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    async function fillPatientSelect(selectId, selectedPatientId) {
        const select = document.getElementById(selectId);
        if (!select) return;
            select.innerHTML = '';
        const patients = await fetchPatients(); 
        patients.forEach(patient => {
            const option = document.createElement('option');
            option.value = patient.id;
            option.textContent = patient.name;
            if (patient.id === selectedPatientId) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }
    
    

    async function deleteAppointment(id) {
        const mutation = `
    mutation($id: ID!) {
      deleteAppointment(id: $id)
    }
  `;
        const variables = { id };
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: mutation, variables }),
        });
                    console.log('response ', response);

        const { errors } = await response.json();
        if (errors) {
            alert('Error eliminando cita: ' + errors.map(e => e.message).join(', '));
        } else {
            loadAppointments();
        }
    }

    document.getElementById('edit-appointment-form').addEventListener('submit', async e => {
        e.preventDefault();
    
        const form = e.target;
        const id = form.dataset.appointmentId;
        const doctorId = document.getElementById('appointment-doctor-select').value;
        const patientId = document.getElementById('appointment-patient-select').value;
        const date = document.getElementById('appointment-date').value; // YYYY-MM-DD
        const time = document.getElementById('appointment-time').value; // HH:mm
        const durationStr = document.getElementById('appointment-duration').value;
        const notes = document.getElementById('appointment-notes-edit').value;
    
        console.log('Fecha:', date);
console.log('Hora:', time);
        if (!date || !time) {
            alert('Por favor, completa la fecha y hora correctamente.');
            return;
          }
          
          const dateTimeISO = new Date(`${date}T${time}:00`).toISOString();    
        const mutation = `
            mutation($id: ID!, $doctorId: ID!, $patientId: ID!, $date: String!, $duration: Int, $notes: String) {
              updateAppointment(id: $id, doctorId: $doctorId, patientId: $patientId, date: $date, duration: $duration, notes: $notes) {
                id
              }
            }
        `;
    
        const variables = {
            id,
            doctorId,
            patientId,
            date: dateTimeISO,
            duration: durationStr ? parseInt(durationStr) : null,
            notes: notes || null,
        };
    
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: mutation, variables }),
            });
            const { errors } = await response.json();
            if (errors) throw new Error(errors.map(e => e.message).join(', '));
    
            closeEditAppointmentModal();
            loadAppointments();
        } catch (err) {
            alert('Error actualizando cita: ' + err.message);
        }
    });
    



    function openEditAppointmentModal() {
        document.getElementById('edit-appointment-modal').style.display = 'block';
    }
    function closeEditAppointmentModal() {
        document.getElementById('edit-appointment-modal').style.display = 'none';
    }
    async function loadAppointments() {
        try {
            const appointments = await fetchAppointments();
            renderAppointments(appointments);
        } catch (err) {
            console.error('Error cargando citas:', err);
        }
    }

    // --- FORMULARIO PARA AGENDAR CITA ---
    async function fillAppointmentSelects() {
        const doctors = await fetchDoctors();
        const patients = await fetchPatients();
        console.log("Doctores ", doctors)

        const doctorSelect = document.getElementById('doctor-select');
        const patientSelect = document.getElementById('patient-select');

        console.log("Doctor seleccionado ", doctorSelect)


        doctorSelect.innerHTML = '<option value="">--Selecciona un doctor--</option>';
        doctors.forEach(doc => {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = `${doc.name} (${doc.specialty})`;
            doctorSelect.appendChild(option);
        });

        patientSelect.innerHTML = '<option value="">--Selecciona un paciente--</option>';
        patients.forEach(pat => {
            const option = document.createElement('option');
            option.value = pat.id;
            option.textContent = `${pat.name} (${pat.age} años)`;
            patientSelect.appendChild(option);
        });
    }

    async function createAppointment(doctorId, patientId, date) {
        const mutation = `
        mutation($doctorId: ID!, $patientId: ID!, $date: String!) {
          createAppointment(doctorId: $doctorId, patientId: $patientId, date: $date) {
            id
            date
            doctor { name }
            patient { name }
          }
        }
      `;
        const variables = { doctorId, patientId, date };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: mutation, variables }),
        });
        const { data, errors } = await response.json();
        if (errors) {
            throw new Error(errors.map(e => e.message).join(', '));
        }
        console.log("data  ", data.createAppointment)
        return data.createAppointment;
    }

    document.getElementById('create-appointment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('appointment-error-msg');
        errorDiv.textContent = '';

        const doctorId = document.getElementById('doctor-select').value;
        const patientId = document.getElementById('patient-select').value;
        const date = document.getElementById('appointment-date-agendar').value;

        if (!doctorId || !patientId || !date) {
            errorDiv.textContent = 'Por favor, completa todos los campos.';
            return;
        }

        try {
            await createAppointment(doctorId, patientId, date);
            await loadAppointments();
            e.target.reset();
        } catch (err) {
            errorDiv.textContent = err.message;
        }
    });

    async function init() {
        await loadDoctors();
        await loadPatients();
        await fillAppointmentSelects();
        await loadAppointments();
    }

    init();

    const modal = document.getElementById('edit-doctor-modal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeEditDoctorModal();
        }
    });