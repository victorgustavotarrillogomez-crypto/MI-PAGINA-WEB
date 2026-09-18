const botonSi = document.getElementById("botonSi");
const botonNo = document.getElementById("botonNo");
const respuestas = document.getElementById("respuestas");
const modalAceptacion = document.getElementById("modalAceptacion");
const cerrarModal = document.getElementById("cerrarModal");
const botonRegalo = document.getElementById("botonRegalo");
const modalFavoritos = document.getElementById("modalFavoritos");
const cerrarFavoritos = document.getElementById("cerrarFavoritos");
const formularioFavoritos = document.getElementById("formularioFavoritos");
const respuestaGuardada = document.getElementById("respuestaGuardada");

let retrocesoBloqueado = true;


// ======================================================
// URL DE GOOGLE APPS SCRIPT
// ======================================================

const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/AKfycbz3oqHvfdmT-OHyVjiuciyYgTRhF82OnswtKoBJSNlavk13sDycIBkKjx2mmGXuab4Y/exec";


// ======================================================
// BLOQUEAR RETROCESO
// ======================================================

history.replaceState(
    { pantalla: "inicio" },
    "",
    window.location.href
);

history.pushState(
    { pantalla: "bloqueada" },
    "",
    window.location.href
);

function bloquearRetroceso() {
    retrocesoBloqueado = true;
}


// ======================================================
// BOTÓN "NO"
// ======================================================

function moverBotonNo() {
    const limiteX = Math.max(
        0,
        respuestas.clientWidth - botonNo.offsetWidth
    );

    const limiteY = Math.max(
        0,
        respuestas.clientHeight - botonNo.offsetHeight
    );

    const nuevaX =
        Math.random() * limiteX - limiteX / 2;

    const nuevaY =
        Math.random() * Math.max(24, limiteY) -
        Math.max(24, limiteY) / 2;

    botonNo.style.transform =
        `translate(${nuevaX}px, ${nuevaY}px)`;
}


// ======================================================
// MODAL DE ACEPTACIÓN
// ======================================================

function abrirMensaje() {
    bloquearRetroceso();

    modalAceptacion.classList.add("visible");

    modalAceptacion.setAttribute(
        "aria-hidden",
        "false"
    );

    cerrarModal.focus();
}

function cerrarMensaje() {
    modalAceptacion.classList.remove("visible");

    modalAceptacion.setAttribute(
        "aria-hidden",
        "true"
    );

    botonSi.focus();
}


// ======================================================
// MODAL DE FAVORITOS
// ======================================================

function abrirFavoritos() {
    bloquearRetroceso();

    modalFavoritos.classList.add("visible");

    modalFavoritos.setAttribute(
        "aria-hidden",
        "false"
    );

    document.getElementById("nombre").focus();
}

function cerrarFavoritosModal() {
    modalFavoritos.classList.remove("visible");

    modalFavoritos.setAttribute(
        "aria-hidden",
        "true"
    );

    botonRegalo.focus();
}


// ======================================================
// EVENTOS DE LOS BOTONES
// ======================================================

botonNo.addEventListener(
    "click",
    moverBotonNo
);

botonSi.addEventListener(
    "click",
    abrirMensaje
);

cerrarModal.addEventListener(
    "click",
    cerrarMensaje
);

botonRegalo.addEventListener(
    "click",
    abrirFavoritos
);

cerrarFavoritos.addEventListener(
    "click",
    cerrarFavoritosModal
);


// ======================================================
// GUARDAR FAVORITOS EN GOOGLE SHEETS
// ======================================================

formularioFavoritos.addEventListener(
    "submit",
    async (evento) => {

        evento.preventDefault();


        // Obtener los datos del formulario
        const datos = {

            // NUEVO CAMPO: NOMBRE
            nombre: document.getElementById("nombre").value,

            comida: document.getElementById("comida").value,

            bebida: document.getElementById("bebida").value,

            fruta: document.getElementById("fruta").value,

            color: document.getElementById("color").value,

            musica: document.getElementById("musica").value,

            cantante: document.getElementById("cantante").value,

            cancion: document.getElementById("cancion").value,

            pelicula: document.getElementById("pelicula").value,

            serie: document.getElementById("serie").value,

            tipoPeliculas:
                document.getElementById("tipoPeliculas").value,

            animal: document.getElementById("animal").value,

            lugar: document.getElementById("lugar").value,

            flor: document.getElementById("flor").value
        };


        // Mostrar mensaje mientras se guarda
        respuestaGuardada.textContent =
            "Guardando tus respuestas... 💕";


        try {

            await fetch(URL_GOOGLE_SHEETS, {

                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify(datos)

            });


            // Mensaje de confirmación
            respuestaGuardada.textContent =
                "Tus respuestas se guardaron correctamente. 💕";


            // Limpiar formulario
            formularioFavoritos.reset();


        } catch (error) {

            console.error(
                "Error al guardar:",
                error
            );

            respuestaGuardada.textContent =
                "No se pudieron guardar las respuestas. 😔";
        }
    }
);


// ======================================================
// EVITAR CIERRE DE LOS MODALES AL HACER CLIC DENTRO
// ======================================================

modalAceptacion.addEventListener(
    "click",
    (evento) => {
        evento.stopPropagation();
    }
);

modalFavoritos.addEventListener(
    "click",
    (evento) => {
        evento.stopPropagation();
    }
);


// ======================================================
// TECLA ESCAPE
// ======================================================

document.addEventListener(
    "keydown",
    (evento) => {

        if (
            evento.key === "Escape" &&
            modalAceptacion.classList.contains("visible")
        ) {
            cerrarMensaje();
        }

        if (
            evento.key === "Escape" &&
            modalFavoritos.classList.contains("visible")
        ) {
            cerrarFavoritosModal();
        }
    }
);


// ======================================================
// BLOQUEAR BOTÓN ATRÁS DEL NAVEGADOR
// ======================================================

window.addEventListener(
    "popstate",
    () => {

        if (retrocesoBloqueado) {

            history.pushState(
                { pantalla: "avanzada" },
                "",
                window.location.href
            );
        }
    }
);