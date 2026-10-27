let indiceActual = 0;
const items = document.querySelectorAll('.carrusel-item');
const dots = document.querySelectorAll('.dot');

function actualizarCarrusel() {
    const track = document.getElementById('carruselTrack');
    if (!track) return;
    track.style.transform = `translateX(-${indiceActual * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === indiceActual);
    });
}

function cambiarSlide(direccion) {
    indiceActual += direccion;
    if (indiceActual < 0) {
        indiceActual = items.length - 1;
    } else if (indiceActual >= items.length) {
        indiceActual = 0;
    }
    actualizarCarrusel();
}

function irASlide(index) {
    indiceActual = index;
    actualizarCarrusel();
}

// Avance automático cada 5 segundos
setInterval(() => {
    cambiarSlide(1);
}, 5000);