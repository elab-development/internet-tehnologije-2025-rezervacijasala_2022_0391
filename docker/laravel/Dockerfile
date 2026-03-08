FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev libpq-dev \ 
    && docker-php-ext-install pdo_mysql pdo_pgsql zip mbstring exif pcntl bcmath \
    && rm -rf /var/lib/apt/lists/*

    #Composer
    COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

    WORKDIR /var/www
   
    # DODAJ OVO:
    # Kopiramo ceo folder rezervacijeapi u /var/www
    COPY ./rezervacijeapi /var/www

    # Instaliramo zavisnosti (bez dev paketa radi brzine)
    RUN composer install --no-dev --optimize-autoloader

    # Podešavamo dozvole za Laravel foldere

    #ovde sam sad dodala /bootstrap u liniji ispod
    RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache


    # Pokrećemo ugrađeni PHP server (za Render port 10000 je standard)
    CMD php artisan serve --host=0.0.0.0 --port=10000


    # dodala sam libpq-dev u ovom RUN-u prvom i pdo_pgsql u redu ispod