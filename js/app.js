// Selectores
const fechaInput = document.querySelector('#fecha')
const tareaInput = document.querySelector('#tarea')

const formulario = document.querySelector('#formulario-tarea')
const formularioInput = document.querySelector('#formulario-tarea button[type="submit"]')
const contenedorTareas = document.querySelector('#tareas')

// Eventos
fechaInput.addEventListener('change', datosTarea)
tareaInput.addEventListener('change', datosTarea)

formulario.addEventListener('submit', submitTarea)

let editando = false

// Objeto de Tarea
const tareaObj = {
    id: generarId(),
    fecha: '',
    tarea: ''
}

class Notificacion {

    constructor({texto, tipo}) {
        this.texto = texto
        this.tipo = tipo
        this.mostrar()
    }

    mostrar() {
        
        const alerta = document.createElement('div')
        alerta.classList.add('text-center', 'w-100', 'p-3',  'my-3', 'alert', 'font-weight-bold')

        
        const alertaPrevia = document.querySelector('.alert')
        alertaPrevia?.remove()

        
        this.tipo === 'error' ? alerta.classList.add('alert-danger') : alerta.classList.add('alert-success')

        
        alerta.textContent = this.texto

        
        formulario.parentElement.insertBefore(alerta, formulario)

        
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

class AdminTareas {
    constructor() {
        this.tareas = []
    }

    agregar(tarea) {
        this.tareas = [...this.tareas, tarea]
        this.mostrar()
    }

    editar(tareaActualizada) {
        this.tareas = this.tareas.map(tarea => tarea.id === tareaActualizada.id ? tareaActualizada : tarea)
        this.mostrar()
    }

    eliminar(id) {
        this.tareas = this.tareas.filter(tarea => tarea.id !== id)
        this.mostrar()
    }

    mostrar() {
        
        while (contenedorTareas.firstChild) {
            contenedorTareas.removeChild(contenedorTareas.firstChild)
        }

        
        if (this.tareas.length === 0) {
            contenedorTareas.innerHTML = '<p class="text-center">No Hay Tareas</p>'
            return
        }

        
        this.tareas.forEach(tarea => {
            const divTarea = document.createElement('div')
            divTarea.classList.add('card', 'mb-3')

            const cardBody = document.createElement('div')
            cardBody.classList.add('card-body')

            const fecha = document.createElement('p')
            fecha.classList.add('card-text')
            fecha.innerHTML = `<strong>Fecha:</strong> ${tarea.fecha}`

            const descripcion = document.createElement('p')
            descripcion.classList.add('card-text')
            descripcion.innerHTML = `<strong>Tarea:</strong> ${tarea.tarea}`

            
            const btnEditar = document.createElement('button')
            btnEditar.classList.add('btn', 'btn-primary', 'mr-2', 'btn-editar')
            btnEditar.innerHTML = 'Editar'
            btnEditar.onclick = () => cargarEdicion(tarea)

            const btnEliminar = document.createElement('button')
            btnEliminar.classList.add('btn', 'btn-danger')
            btnEliminar.innerHTML = 'Eliminar'
            btnEliminar.onclick = () => this.eliminar(tarea.id)

            
            cardBody.appendChild(fecha)
            cardBody.appendChild(descripcion)
            cardBody.appendChild(btnEditar)
            cardBody.appendChild(btnEliminar)
            divTarea.appendChild(cardBody)
            contenedorTareas.appendChild(divTarea)
        })
    }
}

function datosTarea(e) {
    tareaObj[e.target.name] = e.target.value
}

const tareas = new AdminTareas()

function submitTarea(e) {
    e.preventDefault()

    if (Object.values(tareaObj).some(valor => valor.trim() === '')) {
        new Notificacion({
            texto: 'Rellena todos los campos',
            tipo: 'error'
        })
        return
    }

    if (editando) {
        tareas.editar({...tareaObj})
        new Notificacion({
            texto: 'Guardado Correctamente',
            tipo: 'success'
        })
    } else {
        tareas.agregar({...tareaObj})
        new Notificacion({
            texto: 'Tarea Registrada',
            tipo: 'success'
        })
    }

    formulario.reset()
    reiniciarObjetoTarea()
    formularioInput.textContent = 'Agregar Tarea'
    editando = false
}

function reiniciarObjetoTarea() {
    Object.assign(tareaObj, {
        id: generarId(),
        fecha: '',
        tarea: ''
    })
}

function generarId() {
    return Math.random().toString(36).substring(2) + Date.now()
}

function cargarEdicion(tarea) {
    Object.assign(tareaObj, tarea)

    fechaInput.value = tarea.fecha
    tareaInput.value = tarea.tarea

    editando = true

    formularioInput.textContent = 'Guardar Cambios'
}
