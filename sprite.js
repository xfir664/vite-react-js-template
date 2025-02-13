import fs from "fs";
import path from "path";
import { ensureDirSync } from "fs-extra";

// Папка с исходными SVG-иконками
const iconsDir = "./public/img/icons";
// Путь для сохранения результирующего sprite.svg
const outputFilePath = "./public/sprite/sprite.svg";

// Создаем папку для вывода, если она не существует
ensureDirSync(path.dirname(outputFilePath));

// Функция для рекурсивного чтения всех SVG-файлов в директории и её поддиректориях
function getAllSVGFiles(dir) {
  const files = [];
  const dirents = fs.readdirSync(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      // Если это директория, рекурсивно читаем её содержимое
      files.push(...getAllSVGFiles(res));
    } else if (path.extname(dirent.name).toLowerCase() === ".svg") {
      // Если это SVG-файл, добавляем его в список
      files.push(res);
    }
  }

  return files;
}

// Функция для очистки SVG-файла от лишних тегов <svg>
function cleanSVGContent(content, id) {
  // Извлекаем содержимое между <svg>...</svg>
  const svgContent = content
    .replace(/<\?xml.*?\?>/g, "") // Удаляем <?xml ... ?>宣言
    .replace(/<!DOCTYPE.*?>/g, "") // Удаляем <!DOCTYPE ... >
    .replace(/<svg[^>]*>/, `<symbol id="${id}" viewBox="0 0 24 24">`) // Заменяем <svg> на <symbol>
    .replace("</svg>", "</symbol>"); // Заменяем </svg> на </symbol>

  return svgContent;
}

// Главная функция для создания stack.svg
async function createSprite() {
  try {
    // Получаем список всех SVG-файлов в директории и её поддиректориях
    const svgFiles = getAllSVGFiles(iconsDir);

    if (svgFiles.length === 0) {
      console.error("No SVG files found in the specified directory.");
      return;
    }

    // Создаем начальный шаблон для stack.svg
    let spriteContent =
      '<svg xmlns="http://www.w3.org/2000/svg" style="display:none;">\n';

    // Обрабатываем каждый SVG-файл
    for (const filePath of svgFiles) {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const fileName = path.basename(filePath, ".svg"); // Имя файла без расширения
      const cleanedContent = cleanSVGContent(fileContent, fileName); // Очищаем содержимое SVG
      spriteContent += cleanedContent + "\n";
    }

    // Закрываем тег <svg>
    spriteContent += "</svg>";

    // Сохраняем stack.svg
    fs.writeFileSync(outputFilePath, spriteContent);
    console.log(`Stack SVG created successfully: ${outputFilePath}`);
  } catch (error) {
    console.error("Error creating stack SVG:", error);
  }
}

// Запускаем создание спрайта
createSprite();
