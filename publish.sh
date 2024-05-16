#!/bin/bash

# Проверка версии WSL
wsl_version=$(wsl -l -v | grep -oP '(?<=WSL ).*' | head -n 1)
echo "Current WSL version: $wsl_version"

# Установка WSL 2 по умолчанию, если необходимо
if [ "$wsl_version" != "2" ]; then
  echo "Setting WSL 2 as default version..."
  wsl --set-default-version 2
  echo "Restarting WSL to apply changes..."
  wsl --shutdown
fi

# Загрузка переменных окружения из файла .env
if [ -f "./.env" ]; then
  echo "Loading environment variables from .env file..."
  export "$(grep -v '^#' .env | xargs)"
else
  echo "Error: .env file not found!"
  exit 1
fi

# Проверка наличия /usr/local/bin в PATH и добавление, если отсутствует
if [[ ":$PATH:" != *":/usr/local/bin:"* ]]; then
  echo "Adding /usr/local/bin to PATH..."
  export PATH=$PATH:/usr/local/bin
fi

# Запуск Node.js скрипта
echo "Running Node.js script..."
node ./publish.pact.js
