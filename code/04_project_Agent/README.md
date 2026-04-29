# 销售数据分类拆分工具 (Sales Data Splitter)

本工具旨在自动化处理 Excel 销售数据，根据“商品分类”字段将数据拆分为独立的 Excel 或 CSV 文件，并生成处理日志和汇总统计。

## 🚀 主要功能
- **多工作表支持**：自动读取 Excel 内所有工作表。
- **智能列识别**：自动寻找“商品分类”、“分类”、“类别”等字段。
- **格式保留**：保留原始数据格式，并将公式计算结果导出。
- **自动汇总**：为每个分类文件添加记录条数、销售额合计、平均单价。
- **异常处理**：自动处理非法文件名字符，缺失分类归类至“未分类”。
- **性能优化**：支持大文件（10万行+）处理，内存控制在 200MB 以内（净增），耗时低于 60 秒。

## 📦 依赖安装
在使用前，请确保已安装 Python 3.8+，并运行以下命令安装依赖：

```bash
pip install -r requirements.txt
```

## 🛠️ 使用说明

### 1. 生成样例数据 (可选)
如果您没有现成的测试文件，可以运行以下脚本生成 1000 行包含多种情况的 `sales_data.xlsx`：

```bash
python generate_sample_data.py
```

### 2. 运行拆分脚本
使用默认参数运行（读取 `sales_data.xlsx` 并输出至 `./classified_output/`）：

```bash
python sales_splitter.py
```

**命令行参数支持：**
- `--input`: 指定输入 Excel 文件路径（默认: `sales_data.xlsx`）。
- `--output_dir`: 指定输出目录（默认: `./classified_output/`）。
- `--format`: 输出文件格式，可选 `xlsx` 或 `csv`（默认: `xlsx`）。
- `--no_summary`: 若添加此参数，则不生成汇总行。

示例：
```bash
python sales_splitter.py --input my_data.xlsx --format csv --output_dir ./my_output/
```

## 🧪 单元测试
运行单元测试（包括正常、空分类、特殊字符、大文件性能测试）：

```bash
pytest test_sales_splitter.py -s
```

## 📄 日志与输出
- **输出文件**：保存在指定的输出目录下，命名规则为 `分类名称_YYYYMMDD_HHMMSS.xlsx`。
- **日志文件**：保存在输出目录下的 `split_log_YYYYMMDD.txt`。
