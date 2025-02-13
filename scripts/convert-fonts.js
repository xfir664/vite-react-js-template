// Импортируем необходимые модули
import fs from "fs/promises";
import path from "path";
import ttf2woff from "ttf2woff";
import ttf2woff2 from "ttf2woff2";

// Функция для рекурсивного чтения всех файлов в директории
async function readDirectory(dir) {
  const files = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await readDirectory(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

// Функция для создания целевой директории, если она не существует
async function ensureDirectory(targetDir) {
  try {
    await fs.mkdir(targetDir, { recursive: true });
  } catch (error) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

// Основная функция для конвертации
async function convertFonts() {
  const inputDir = path.resolve("./raw/fonts");
  const outputDir = path.resolve("./public/fonts");

  // Читаем все файлы из входной директории
  const allFiles = await readDirectory(inputDir);

  for (const file of allFiles) {
    // Проверяем, является ли файл TTF
    if (path.extname(file).toLowerCase() === ".ttf") {
      const relativePath = path.relative(inputDir, file);
      const targetDir = path.join(outputDir, path.dirname(relativePath));

      // Создаем целевую директорию, если она не существует
      await ensureDirectory(targetDir);

      // Генерируем пути для выходных файлов
      const woffFile = path.join(
        targetDir,
        `${path.basename(file, ".ttf")}.woff`
      );
      const woff2File = path.join(
        targetDir,
        `${path.basename(file, ".ttf")}.woff2`
      );

      console.log(`Processing: ${file}`);

      // Читаем содержимое файла в буфер
      const fontBuffer = await fs.readFile(file);

      // Конвертируем в WOFF
      try {
        const woffData = ttf2woff(fontBuffer);
        await fs.writeFile(woffFile, woffData);
        console.log(`Converted to WOFF: ${woffFile}`);
      } catch (error) {
        console.error(`Error converting to WOFF: ${file}`, error);
      }

      // Конвертируем в WOFF2
      try {
        const woff2Data = ttf2woff2(fontBuffer);
        await fs.writeFile(woff2File, woff2Data);
        console.log(`Converted to WOFF2: ${woff2File}`);
      } catch (error) {
        console.error(`Error converting to WOFF2: ${file}`, error);
      }
    }
  }
}

// Запускаем процесс конвертации
convertFonts().catch((error) => {
  console.error("An error occurred during font conversion:", error);
});
