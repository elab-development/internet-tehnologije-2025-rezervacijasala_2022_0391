FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev libpq-dev \ 
    && docker-php-ext-install pdo_mysql pdo_pgsql zip mbstring exif pcntl bcmath \
    && rm -rf /var/lib/apt/lists/*

    #Composer
    COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

    WORKDIR /var/www
   
   
    #COPY ./rezervacijeapi /var/www
    COPY . /var/www

    RUN composer install --no-dev --optimize-autoloader


    RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

    CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000

