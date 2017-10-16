#!/bin/bash

rsync -avn --exclude-from "rsync-exclude.txt" . ubuntu@tesla:/var/www/html/.
