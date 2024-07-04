// Selectores
const fechaInput = document.querySelector('#fecha');
const tareaInput = document.querySelector('#tarea');
const formulario = document.querySelector('#formulario-tarea');
const formularioInput = document.querySelector('#formulario-tarea button[type="submit"]');
const contenedorTareas = document.querySelector('#tareas');
const fraseMotivacional = document.querySelector('#frase-motivacional');

// Eventos
fechaInput.addEventListener('change', datosTarea);
tareaInput.addEventListener('change', datosTarea);
formulario.addEventListener('submit', submitTarea);

let editando = false;
let tareaEditadaIndex = -1;

// Objeto de Tarea
const tareaObj = {
    fecha: '',
    tarea: ''
};

class Notificacion {
    constructor({texto, tipo}) {
        this.texto = texto;
        this.tipo = tipo;
        this.mostrar();
    }

    mostrar() {
        Swal.fire({
            position: "top-end",
            icon: this.tipo === 'error' ? 'error' : 'success',
            title: this.texto,
            showConfirmButton: false,
            timer: 1500
        });
    }
}

class AdminTareas {
    constructor() {
        this.tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        this.mostrar();
    }

    agregar(tarea) {
        this.tareas.push(tarea);
        this.sincronizarStorage();
        this.mostrar();
    }

    editar(tarea, index) {
        this.tareas[index] = tarea;
        this.sincronizarStorage();
        this.mostrar();
    }

    eliminar(index) {
        this.tareas.splice(index, 1);
        this.sincronizarStorage();
        this.mostrar();
    }

    sincronizarStorage() {
        localStorage.setItem('tareas', JSON.stringify(this.tareas));
    }

    mostrar() {
        while (contenedorTareas.firstChild) {
            contenedorTareas.removeChild(contenedorTareas.firstChild);
        }
        if (this.tareas.length === 0) {
            contenedorTareas.innerHTML = '<p class="text-center">No Hay Tareas</p>';
            return;
        }
        this.tareas.forEach((tarea, index) => {
            const divTarea = document.createElement('div');
            divTarea.classList.add('card', 'mb-3');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const fecha = document.createElement('p');
            fecha.classList.add('card-text');
            fecha.innerHTML = `<strong>Fecha:</strong> ${tarea.fecha}`;

            const descripcion = document.createElement('p');
            descripcion.classList.add('card-text');
            descripcion.innerHTML = `<strong>Tarea:</strong> ${tarea.tarea}`;

            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-primary', 'mr-2', 'btn-editar');
            btnEditar.innerHTML = 'Editar';
            btnEditar.onclick = () => cargarEdicion(tarea, index);

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger');
            btnEliminar.innerHTML = 'Eliminar';
            btnEliminar.onclick = () => this.eliminar(index);

            cardBody.appendChild(fecha);
            cardBody.appendChild(descripcion);
            cardBody.appendChild(btnEditar);
            cardBody.appendChild(btnEliminar);
            divTarea.appendChild(cardBody);
            contenedorTareas.appendChild(divTarea);
        });
    }
}

function datosTarea(e) {
    tareaObj[e.target.name] = e.target.value;
}

const tareas = new AdminTareas();

function submitTarea(e) {
    e.preventDefault();
    if (Object.values(tareaObj).some(valor => valor.trim() === '')) {
        new Notificacion({
            texto: 'Rellena todos los campos',
            tipo: 'error'
        });
        return;
    }
    if (editando) {
        tareas.editar({...tareaObj}, tareaEditadaIndex);
        new Notificacion({
            texto: 'Guardado Correctamente',
            tipo: 'success'
        });
    } else {
        tareas.agregar({...tareaObj});
        new Notificacion({
            texto: 'Tarea Registrada',
            tipo: 'success'
        });
    }
    formulario.reset();
    reiniciarObjetoTarea();
    formularioInput.textContent = 'Agregar Tarea';
    editando = false;
}

function reiniciarObjetoTarea() {
    Object.assign(tareaObj, {
        fecha: '',
        tarea: ''
    });
}

function cargarEdicion(tarea, index) {
    Object.assign(tareaObj, tarea);
    fechaInput.value = tarea.fecha;
    tareaInput.value = tarea.tarea;
    editando = true;
    tareaEditadaIndex = index;
    formularioInput.textContent = 'Guardar Cambios';
}

async function obtenerFrasesMotivacionales() {
    try {
        const response = await fetch('frases.json');
        const frases = await response.json();
        mostrarFraseAleatoria(frases);
    } catch (error) {
        console.error('Error al obtener frases motivacionales:', error);
    }
}

function mostrarFraseAleatoria(frases) {
    const indiceAleatorio = Math.floor(Math.random() * frases.length);
    const frase = frases[indiceAleatorio];
    fraseMotivacional.textContent = frase.text;
}

document.addEventListener('DOMContentLoaded', obtenerFrasesMotivacionales);
