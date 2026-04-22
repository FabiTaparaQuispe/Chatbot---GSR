<?php
declare(strict_types=1);

// Cuando se accede a http://ip/<carpeta>/, redirige a la interfaz pública.
header('Location: public/');
exit;
