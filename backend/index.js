const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const exceljs = require('exceljs');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// 读取单个 XLSX 文件并提取题目数据
const readQuestionsFromXlsx = async (filePath) => {
  const workbook = new exceljs.Workbook();
  await workbook.xlsx.readFile(filePath); // 读取xlsx文件
  const worksheet = workbook.getWorksheet('Sheet1'); // 获取第一个工作表

  const questions = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // 跳过表头行

    const question = row.getCell(1).value; // 题目列
    const options = row.getCell(2).value;  // 选项列
    const answer = row.getCell(3).value;   // 答案列

    // 将选项分割成数组
    const optionsArray = options.split('\n').map(opt => opt.trim());  

    questions.push({ question, options: optionsArray, answer });
  });

  return questions;
};

// 读取目录下所有的 xlsx 文件
const readAllQuestionsFromDirectory = async (directoryPath) => {
  const files = fs.readdirSync(directoryPath); // 读取目录中的所有文件
  const xlsxFiles = files.filter(file => file.endsWith('.xlsx')); // 只筛选 xlsx 文件

  const allQuestions = [];

  for (const file of xlsxFiles) {
    const filePath = path.join(directoryPath, file);  // 拼接文件路径
    console.log(`Reading file: ${filePath}`);  // 输出当前正在读取的文件路径

    try {
      const questions = await readQuestionsFromXlsx(filePath); // 读取题目
      allQuestions.push({ file, questions });  // 将题目数据保存
      console.log(`Questions from ${file}:`, questions);  // 打印当前文件的题目内容
    } catch (error) {
      console.error(`Error reading ${file}:`, error);  // 输出读取错误信息
    }
  }

  return allQuestions; // 返回所有题目数据
};

// 后端 API: 获取所有题库数据
app.get('/questions', async (req, res) => {
  try {
    const directoryPath = path.join(__dirname, 'questions');  // 获取题库目录路径
    const allQuestions = await readAllQuestionsFromDirectory(directoryPath);
    res.json(allQuestions);  // 返回所有读取到的题目数据
  } catch (error) {
    console.error('Error reading all XLSX files:', error);
    res.status(500).send('Error reading XLSX files');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
