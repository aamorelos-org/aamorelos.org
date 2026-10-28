<?php
require_once __DIR__ . '/../../config.php';

$breadcrumb_title = '16 Aniversario - Grupo Hoy Volvemos a Empezar';

$bloquesItinerario = [
    1 => [
        'titulo' => 'Del 8 al 15 de diciembre',
        'etiqueta' => 'Primera semana de unidad',
    ],
    2 => [
        'titulo' => 'Del 16 al 20 de diciembre',
        'etiqueta' => 'Segunda semana de unidad',
    ],
];

$diasUnidad = [
    [
        'bloque' => 1,
        'dia' => 'Martes',
        'numero' => '08',
        'fecha' => '2026-12-08',
        'grupos' => ['Mis Amigos', 'Compañeros y Amigos', 'Tejalpa'],
        'tema' => '1.° Capítulo L-Azul',
    ],
    [
        'bloque' => 1,
        'dia' => 'Miércoles',
        'numero' => '09',
        'fecha' => '2026-12-09',
        'grupos' => ['Trabajando con Otros', 'Estrella', 'Akron 82'],
        'tema' => '2.° Capítulo L-Azul',
    ],
    [
        'bloque' => 1,
        'dia' => 'Jueves',
        'numero' => '10',
        'fecha' => '2026-12-10',
        'grupos' => ['Atlacomulco', '12 de Enero', 'Loma Bonita'],
        'tema' => '3.° Capítulo L-Azul',
    ],
    [
        'bloque' => 1,
        'dia' => 'Viernes',
        'numero' => '11',
        'fecha' => '2026-12-11',
        'grupos' => ['Satélite', 'Revolución', 'Jiutepec'],
        'tema' => '4.° Capítulo L-Azul',
    ],
    [
        'bloque' => 1,
        'dia' => 'Sábado',
        'numero' => '12',
        'fecha' => '2026-12-12',
        'grupos' => ['Mesa del 3° Distrito', 'Generación 94', 'Barona Bugambilias'],
        'tema' => '5.° Capítulo L-Azul',
    ],
    [
        'bloque' => 1,
        'dia' => 'Domingo',
        'numero' => '13',
        'fecha' => '2026-12-13',
        'grupos' => ['Fuerza de Vida', 'Nvo. Milenio', 'Poder Superior'],
        'tema' => '6.° Capítulo L-Azul',
    ],
    [
        'bloque' => 1,
        'dia' => 'Lunes',
        'numero' => '14',
        'fecha' => '2026-12-14',
        'grupos' => ['Amatitlán', 'Lenguaje del Corazón', 'Nva. Vida'],
        'tema' => '7.° Capítulo L-Azul',
    ],
    [
        'bloque' => 1,
        'dia' => 'Martes',
        'numero' => '15',
        'fecha' => '2026-12-15',
        'grupos' => ['Volver a Vivir', 'Dr. Bob', 'Mesa del 7° Distrito', 'Mesa del 5° Distrito'],
        'tema' => '8.° Capítulo L-Azul',
    ],
    [
        'bloque' => 2,
        'dia' => 'Miércoles',
        'numero' => '16',
        'fecha' => '2026-12-16',
        'grupos' => ['Paraíso', 'Libertad', 'Mesa del 4° Distrito'],
        'tema' => '9.° Capítulo L-Azul',
    ],
    [
        'bloque' => 2,
        'dia' => 'Jueves',
        'numero' => '17',
        'fecha' => '2026-12-17',
        'grupos' => ['1ra. Tradición', 'San Gaspar', 'El Mensaje'],
        'tema' => '10.° Capítulo L-Azul',
    ],
    [
        'bloque' => 2,
        'dia' => 'Viernes',
        'numero' => '18',
        'fecha' => '2026-12-18',
        'grupos' => ['Viviendo Sobrio', 'Mesa del 2° Distrito', 'Valle', 'Mesa del 6° Distrito'],
        'tema' => '11.° Capítulo L-Azul',
    ],
    [
        'bloque' => 2,
        'dia' => 'Sábado',
        'numero' => '19',
        'fecha' => '2026-12-19',
        'grupos' => ['Mesa del 1° Distrito', 'Campestre', 'Mesa del Área y Delg.'],
        'tema' => '1.° Concepto',
    ],
    [
        'bloque' => 2,
        'dia' => 'Domingo',
        'numero' => '20',
        'fecha' => '2026-12-20',
        'grupos' => ['Junta Pública de Información'],
        'tema' => '12:00 hrs · Explanada del grupo',
        'junta' => true,
    ],
];

$itinerario = [];
foreach ($diasUnidad as $dia) {
    $itinerario[$dia['bloque']][] = $dia;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($breadcrumb_title, ENT_QUOTES, 'UTF-8') ?> - Área Morelos</title>
    <meta name="description" content="Invitación e itinerario del 16 Aniversario del Grupo Hoy Volvemos a Empezar de Alcohólicos Anónimos. Días de Unidad del 8 al 19 de diciembre y Junta Pública el 20 de diciembre de 2026.">
    <link rel="icon" type="image/x-icon" href="<?= url('favicon.ico') ?>">
    <link rel="stylesheet" href="<?= url('styles/styles.css') ?>">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100">

    <?php require ROOT_PATH . '/header.php'; ?>

    <?php require ROOT_PATH . '/nav.php'; ?>

    <div class="container mx-auto px-4 py-8">

        <?php require ROOT_PATH . '/breadcrumb.php'; ?>

        <main class="inv-page">
            <section class="inv-hero" aria-labelledby="inv-title">
                <figure class="inv-hero-media">
                    <img src="<?= url('images/aniversarios/grupo_37178/invitacion.jpg') ?>"
                         alt="Cartel oficial del 16 Aniversario del Grupo Hoy Volvemos a Empezar"
                         loading="eager">
                </figure>

                <div class="inv-hero-body">
                    <p class="inv-eyebrow">
                        Central Mexicana de Servicios Generales de A.A., A.C.
                        <span>6° Distrito · Área Morelos</span>
                    </p>

                    <h1 class="inv-title" id="inv-title">
                        <span class="inv-script">Grupo</span>
                        <span class="inv-title-name">Hoy Volvemos a Empezar</span>
                        <span class="inv-title-number"><strong>16</strong> Aniversario</span>
                    </h1>

                    <p class="inv-kicker">Atenta invitación</p>

                    <div class="inv-dates">
                        <div class="inv-date-block">
                            <span class="inv-date-label">Días de Unidad</span>
                            <strong>Del 8 al 19 de diciembre de 2026</strong>
                        </div>
                        <div class="inv-date-block inv-date-block--highlight">
                            <span class="inv-date-label">Junta Pública</span>
                            <strong>Domingo 20 de diciembre · 12:00 hrs</strong>
                        </div>
                    </div>

                    <a class="inv-cta" href="#itinerario">Consultar itinerario</a>
                </div>
            </section>

            <section class="inv-quote" aria-label="Pensamiento">
                <p>
                    «La verdad puede compararse con una piedra preciosa. Si la lanzamos contra el rostro de alguien,
                    puede herir; pero si la envolvemos en un delicado papel y la ofrecemos con ternura,
                    ciertamente será aceptada con agrado.»
                </p>
            </section>

            <section class="inv-section scroll-mt-24" id="itinerario" aria-labelledby="itinerario-title">
                <header class="inv-section-head">
                    <p class="inv-section-script">Días de Unidad</p>
                    <h2 id="itinerario-title">Itinerario</h2>
                    <p class="inv-section-sub">Del 8 al 20 de diciembre de 2026 · Grupos y mesas participantes</p>
                </header>

                <?php foreach ($bloquesItinerario as $bloqueId => $bloque): ?>
                    <?php if (empty($itinerario[$bloqueId])) { continue; } ?>
                    <div class="inv-block">
                        <div class="inv-block-head">
                            <h3><?= htmlspecialchars($bloque['titulo'], ENT_QUOTES, 'UTF-8') ?></h3>
                            <span><?= htmlspecialchars($bloque['etiqueta'], ENT_QUOTES, 'UTF-8') ?></span>
                        </div>

                        <div class="inv-days">
                            <?php foreach ($itinerario[$bloqueId] as $dia): ?>
                                <article class="inv-day<?= !empty($dia['junta']) ? ' inv-day--junta' : '' ?>">
                                    <time class="inv-day-date" datetime="<?= htmlspecialchars($dia['fecha'], ENT_QUOTES, 'UTF-8') ?>">
                                        <span class="inv-day-weekday"><?= htmlspecialchars($dia['dia'], ENT_QUOTES, 'UTF-8') ?></span>
                                        <span class="inv-day-number"><?= htmlspecialchars($dia['numero'], ENT_QUOTES, 'UTF-8') ?></span>
                                        <span class="inv-day-month">Dic</span>
                                    </time>

                                    <div class="inv-day-body">
                                        <ul class="inv-day-groups">
                                            <?php foreach ($dia['grupos'] as $grupo): ?>
                                                <li><?= htmlspecialchars($grupo, ENT_QUOTES, 'UTF-8') ?></li>
                                            <?php endforeach; ?>
                                        </ul>
                                        <span class="inv-day-topic"><?= htmlspecialchars($dia['tema'], ENT_QUOTES, 'UTF-8') ?></span>
                                    </div>
                                </article>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </section>

            <section class="inv-closing" aria-labelledby="junta-title">
                <div class="inv-closing-main">
                    <p class="inv-closing-script">Cierre de aniversario</p>
                    <h2 id="junta-title">Junta Pública de Información</h2>
                    <p class="inv-closing-date">
                        <time datetime="2026-12-20">Domingo 20 de diciembre de 2026</time> · 12:00 hrs
                    </p>
                    <p class="inv-closing-place">Explanada del grupo</p>
                    <p class="inv-closing-text">
                        La Conciencia del Grupo agradece de corazón a los grupos, mesas, servidores y familias
                        que hacen posibles estos días de unidad, y extiende una cordial invitación a acompañarnos
                        en la Junta Pública de Información.
                    </p>
                </div>

                <div class="inv-closing-contact">
                    <span class="inv-contact-label">Informes</span>
                    <p class="inv-contact-name">Ana Lilia</p>
                    <a class="inv-contact-phone" href="tel:+527774973233">777 497 32 33</a>
                </div>
            </section>

            <p class="inv-footer-note">Unidad · Servicio · Recuperación</p>
        </main>

    </div>
</body>
</html>
