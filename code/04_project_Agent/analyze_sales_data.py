
import pandas as pd
import matplotlib.pyplot as plt
import os

# --- 配置 ---
# 输入的Excel文件名
INPUT_FILE = "sales_data.xlsx"
# 输出的图表文件名
OUTPUT_CHART = "sales_distribution.png"
# 商品类别的列名
CATEGORY_COLUMN = "商品类别"
# 单价的列名
PRICE_COLUMN = "单价"
# 数量的列名
QUANTITY_COLUMN = "销售数量"

def analyze_sales_data(file_path):
    """
    分析销售数据并生成饼状图。

    :param file_path: Excel文件的路径
    """
    try:
        # 1. 读取并解析Excel销售数据文件
        print(f"正在读取文件: {file_path}")
        if not os.path.exists(file_path):
            print(f"错误: 文件未找到 -> {file_path}")
            return

        df = pd.read_excel(file_path)
        print("文件读取成功。")

        # 7. 处理异常数据情况（如空值、格式错误等）
        # 检查必需的列是否存在
        required_columns = [CATEGORY_COLUMN, PRICE_COLUMN, QUANTITY_COLUMN]
        for col in required_columns:
            if col not in df.columns:
                print(f"错误: 文件中缺少必需的列 -> '{col}'")
                return

        # 清理数据：删除包含空值的行
        df.dropna(subset=required_columns, inplace=True)
        
        # 转换数据类型，处理格式错误
        df[PRICE_COLUMN] = pd.to_numeric(df[PRICE_COLUMN], errors='coerce')
        df[QUANTITY_COLUMN] = pd.to_numeric(df[QUANTITY_COLUMN], errors='coerce')
        
        # 再次清理可能因类型转换失败而产生的空值
        df.dropna(subset=[PRICE_COLUMN, QUANTITY_COLUMN], inplace=True)

        print("数据清洗完成。")

        # 3. 计算每个商品类别的总销售额（单价 × 数量）
        df['总销售额'] = df[PRICE_COLUMN] * df[QUANTITY_COLUMN]
        print("总销售额计算完成。")

        # 2. 按照商品类别字段对数据进行分组
        # 4. 将计算结果整理为包含"商品类别"和"总销售额"两列的汇总表格
        category_sales = df.groupby(CATEGORY_COLUMN)['总销售额'].sum().reset_index()
        print("按类别汇总销售额完成。")
        print("\n各商品类别总销售额:")
        print(category_sales)

        # 5. 使用matplotlib生成专业饼状图
        print("\n正在生成饼状图...")
        plt.rcParams['font.sans-serif'] = ['SimHei']  # 用来正常显示中文标签
        plt.rcParams['axes.unicode_minus'] = False  # 用来正常显示负号

        fig, ax = plt.subplots(figsize=(12, 8))
        
        # 使用区分度高的配色方案
        colors = plt.get_cmap('tab20').colors

        wedges, texts, autotexts = ax.pie(
            category_sales['总销售额'],
            autopct='%1.1f%%',  # 显示各分类的百分比
            startangle=90,
            colors=colors,
            pctdistance=0.85,
            wedgeprops=dict(width=0.4) # 创建一个圆环图（甜甜圈图）以获得更好的视觉效果
        )

        # 添加图例
        ax.legend(
            wedges,
            category_sales[CATEGORY_COLUMN],
            title="商品类别",
            loc="center left",
            bbox_to_anchor=(1, 0, 0.5, 1)
        )

        # 设置百分比文本样式
        plt.setp(autotexts, size=10, weight="bold", color="white")

        # 添加标题
        ax.set_title("各商品类别销售额占比", fontsize=16, weight='bold')

        ax.axis('equal')  # 确保饼图是圆的

        # 6. 将生成的图表保存为高分辨率PNG文件
        plt.savefig(OUTPUT_CHART, dpi=300, bbox_inches='tight')
        print(f"图表已成功保存为: {OUTPUT_CHART}")

    except FileNotFoundError:
        print(f"错误: 输入文件 '{file_path}' 未找到。")
    except Exception as e:
        print(f"处理过程中发生未知错误: {e}")

if __name__ == "__main__":
    # 获取当前脚本所在的目录
    current_directory = os.path.dirname(os.path.abspath(__file__))
    # 构建输入文件的完整路径
    input_file_path = os.path.join(current_directory, INPUT_FILE)
    
    analyze_sales_data(input_file_path)
