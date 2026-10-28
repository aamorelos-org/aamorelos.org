const CARRUSEL_INTERVALO = 5000;

let indiceActual = 0;
let items = [];
let dots = [];
let intervalo = null;

function actualizarCarrusel() {
    const track = document.getElementById('carruselTrack');
    if (!track || items.length === 0) return;

    track.style.transform = `translateX(-${indiceActual * 100}%)`;

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === indiceActual);
    });
}

function cambiarSlide(direccion) {
    if (items.length === 0) return;

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

function iniciarAuto() {
    if (intervalo) clearInterval(intervalo);
    if (items.length > 1) {
        intervalo = setInterval(() => cambiarSlide(1), CARRUSEL_INTERVALO);
    }
}

function renderEventos(eventos) {
    const track = document.getElementById('carruselTrack');
    const dotsContainer = document.getElementById('carruselDots');
    if (!track || !dotsContainer) return;

    track.innerHTML = '';
    dotsContainer.innerHTML = '';
    items = [];
    dots = [];

    eventos.forEach((evento, index) => {
        const slide = document.createElement('a');
        slide.className = 'carrusel-item';

        const base = window.BASE_URL || '';
        const url = (evento.url || '').trim();
        if (/^https?:\/\//i.test(url)) {
            slide.href = url;
            slide.target = '_blank';
            slide.rel = 'noopener noreferrer';
        } else if (/\.php(\?.*)?$/i.test(url)) {
            slide.href = url.startsWith('/') ? url : base + url;
        } else {
            slide.href = '#';
            slide.addEventListener('click', (e) => e.preventDefault());
        }

        const img = document.createElement('img');
        img.src = /^https?:\/\//i.test(evento.image || '')
            ? evento.image
            : base + (evento.image || '').replace(/^\/+/, '');
        img.alt = evento.alt || evento.title || '';
        img.onerror = () => {
            img.onerror = null;
            img.src = `https://via.placeholder.com/800x350/2b6cb0/ffffff?text=${encodeURIComponent(evento.title || 'Evento')}`;
        };

        const caption = document.createElement('div');
        caption.className = 'carrusel-caption';

        const title = document.createElement('h3');
        title.textContent = evento.title || '';

        const detail = document.createElement('p');
        detail.textContent = evento.detail || '';

        caption.appendChild(title);
        caption.appendChild(detail);
        slide.appendChild(img);
        slide.appendChild(caption);
        track.appendChild(slide);
        items.push(slide);

        const dot = document.createElement('span');
        dot.className = 'dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => irASlide(index));
        dotsContainer.appendChild(dot);
        dots.push(dot);
    });

    indiceActual = 0;
    actualizarCarrusel();
    iniciarAuto();
}

async function cargarEventos() {
    try {
        const respuesta = await fetch((window.BASE_URL || '') + 'js/events.json');
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        const eventos = await respuesta.json();
        renderEventos(eventos);
    } catch (error) {
        console.error('No se pudieron cargar los eventos:', error);
    }
}

document.addEventListener('DOMContentLoaded', cargarEventos);
