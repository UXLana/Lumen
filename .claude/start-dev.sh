#!/bin/bash
cd /Users/lanaholston/Desktop/Code
exec node node_modules/next/dist/bin/next dev -p "${PORT:-3333}"
