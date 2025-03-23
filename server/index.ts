import express, { Request, Response } from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

interface FileUploadResponse {
  url: string
  name: string
  type: string
  size: number
}

const app = express()
const port = 3000

// 配置 CORS
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Content-Disposition', 'Content-Type'],
  }),
)

// 添加预检请求处理
app.options('*', cors())

// 创建上传目录
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) => {
    cb(null, uploadDir)
  },
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

// 处理文件上传
app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: '没有文件被上传' })
  }

  // 返回文件信息
  const response: FileUploadResponse = {
    url: `http://localhost:${port}/uploads/${req.file.filename}`,
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  }

  res.json(response)
})

// 配置静态文件访问
app.use(
  '/uploads',
  (req, res, next) => {
    // 允许跨域访问
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', '*')

    // 允许在iframe中加载
    res.setHeader('X-Frame-Options', 'ALLOWALL')
    res.setHeader('Content-Security-Policy', 'frame-ancestors *')

    // 设置文档预览所需的响应头
    const filePath = req.path.toLowerCase()
    if (filePath.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf')
    } else if (filePath.match(/\.(doc|docx)$/)) {
      res.setHeader('Content-Type', 'application/msword')
    } else if (filePath.match(/\.(xls|xlsx)$/)) {
      res.setHeader('Content-Type', 'application/vnd.ms-excel')
    }

    // 设置内联显示
    res.setHeader('Content-Disposition', 'inline')

    // 禁用缓存
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')

    next()
  },
  express.static(path.join(__dirname, 'uploads')),
)

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
})
