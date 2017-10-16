#!/bin/bash

rsync -av --exclude-from "rsync-exclude.txt" . ubuntu@tesla:/var/www/html/.
