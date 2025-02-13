import fs from "fs";
import path from "path";
import SVGO from "svgo";
import { ensureDirSync } from "fs-extra";
import svgoConfig from "./../svgo.config.js";

// Папка с исходными SVG-изображениями (включая подпапки)
const rawDir = "./raw/img";
// Папка для сохранения обработанных SVG-изображений
const outputDir = "./public/img";

// Создаем папку для вывода, если она не существует
ensureDirSync(outputDir);

// Загрузка конфигурации SVGO

// Функция для рекурсивного чтения всех файлов в директории и её поддиректориях
function getAllFiles(dir) {
  const files = [];

  // Читаем содержимое директории
  const dirents = fs.readdirSync(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      // Если это директория, рекурсивно читаем её содержимое
      files.push(...getAllFiles(res));
    } else {
      // Если это файл, добавляем его в список
      files.push(res);
    }
  }

  return files;
}

// Функция для обработки одного SVG-файла
async function processSVG(inputPath, outputPath) {
  try {
    const fileContent = fs.readFileSync(inputPath, "utf8");

    // Оптимизация SVG (используем новый API для svgo@3.x)
    const result = await SVGO.optimize(fileContent, {
      path: inputPath,
      ...svgoConfig,
    });

    if (result.data) {
      // Создаем необходимые поддиректории для выходного файла
      ensureDirSync(path.dirname(outputPath));

      // Сохранение оптимизированного SVG
      fs.writeFileSync(outputPath, result.data);
      console.log(`Processed: ${outputPath}`);
    } else {
      console.warn(`No data returned for: ${inputPath}`);
    }
  } catch (error) {
    console.error(`Error processing SVG: ${inputPath}`, error);
  }
}

// Главная функция для обработки всех SVG-файлов
async function processSVGs() {
  try {
    // Получаем список всех файлов в директории и её поддиректориях
    const allFiles = getAllFiles(rawDir);

    for (const filePath of allFiles) {
      const extname = path.extname(filePath).toLowerCase();
      if (extname === ".svg") {
        // Генерируем путь для выходного файла, сохраняя структуру каталогов
        const relativePath = path.relative(rawDir, filePath);
        const outputPath = path.join(outputDir, relativePath);

        await processSVG(filePath, outputPath);
      }
    }
  } catch (error) {
    console.error("Error reading directory:", error);
  }
}

// Запускаем обработку
processSVGs();
