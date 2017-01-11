#!/bin/bash
openssl req -newkey rsa:2048 -sha256 -nodes -keyout private.key -x509 -days 365 -out public.pem -subj "/C=SP/ST=Barcelona/L=Barcelona/O=OPTC-DB/CN=intervencion.duckdns.org"