FROM php:8.2-apache

RUN apt-get update && apt-get install -y libyaml-dev

# PECL update
RUN pecl channel-update pecl.php.net

# Ext yaml
RUN pecl install yaml && docker-php-ext-enable yaml

EXPOSE 80
