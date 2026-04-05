#!/bin/bash
cd "$(dirname "$0")"
npx vite --host --port ${PORT:-5173}
