import fs from "fs";
import path from "path";
import sharp from "sharp";

// Папка с исходными изображениями (включая подпапки)
const rawDir = "./raw/img";
// Папка для сохранения обработанных изображений
const outputDir = "./public/img";

// Создаем папку для вывода, если она не существует
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Функция для рекурсивного чтения всех файлов в директории и её поддиректориях
function getAllFiles(dir) {
  const files = [];
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

// Функция для обработки одного изображения
async function processImage(inputPath, outputPathBase, suffix) {
  try {
    const outputPath = `${outputPathBase}${suffix}.webp`;
    await sharp(inputPath)
      .resize({ width: suffix === "@1x" ? 800 : 1600 }) // Пример размеров
      .webp({ quality: 80 }) // Оптимизация в формат WebP
      .toFile(outputPath);
    console.log(`Processed: ${outputPath}`);
  } catch (error) {
    console.error(`Error processing image: ${inputPath}`, error);
  }
}

// Главная функция для обработки всех изображений
async function processImages() {
  try {
    // Получаем список всех файлов в директории и её поддиректориях
    const allFiles = getAllFiles(rawDir);

    for (const filePath of allFiles) {
      const extname = path.extname(filePath).toLowerCase();
      if ([".jpg", ".jpeg", ".png"].includes(extname)) {
        // Генерируем относительный путь файла относительно rawDir
        const relativePath = path.relative(rawDir, filePath);

        // Создаем полный путь для выходного файла, сохраняя структуру каталогов
        const outputFilePathBase = path.join(
          outputDir,
          path.parse(relativePath).dir,
          path.parse(relativePath).name
        );

        // Создаем необходимые поддиректории для выходного файла
        const outputDirPath = path.dirname(path.join(outputDir, relativePath));
        if (!fs.existsSync(outputDirPath)) {
          fs.mkdirSync(outputDirPath, { recursive: true });
        }

        // Генерируем версии @1x и @2x
        await processImage(filePath, outputFilePathBase, "@1x");
        await processImage(filePath, outputFilePathBase, "@2x");
      }
    }
  } catch (error) {
    console.error("Error reading directory:", error);
  }
}

// Запускаем обработку
processImages();
