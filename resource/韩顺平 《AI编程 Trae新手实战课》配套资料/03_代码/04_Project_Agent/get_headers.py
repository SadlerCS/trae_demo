
import pandas as pd

try:
    df = pd.read_excel("sales_data.xlsx")
    print("Excel文件的列名如下:")
    print(df.columns.tolist())
except FileNotFoundError:
    print("错误: sales_data.xlsx 文件未找到。")
except Exception as e:
    print(f"读取文件时发生错误: {e}")
