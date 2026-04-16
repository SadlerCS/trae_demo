#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
处理销售数据 Excel 文件，按商品分类拆分数据。
将每个分类的数据保存为独立的 Excel 文件。
"""
import os
import sys
import pandas as pd
from pathlib import Path

# 设置输入文件路径
INPUT_FILE = r"d:\Trea_Learning\04_Project_Agent\sales_data.xlsx"
# 设置输出目录（与输入文件相同目录）
OUTPUT_DIR = Path(INPUT_FILE).parent


def main():
    """主函数：读取、拆分、保存数据。"""
    print(f"开始处理文件：{INPUT_FILE}")

    # 1. 读取 Excel 文件
    try:
        df = pd.read_excel(INPUT_FILE)
    except FileNotFoundError:
        print(f"错误：文件 {INPUT_FILE} 不存在。请检查路径。")
        sys.exit(1)
    except Exception as e:
        print(f"错误：读取 Excel 文件失败。{e}")
        sys.exit(1)

    # 2. 检查数据
    if df.empty:
        print("警告：Excel 文件为空。")
        sys.exit(0)

    # 假设商品分类列名为 '商品分类' (可根据实际情况修改)
    # 如果列名不同，请替换为正确的列名
    category_column = "商品类别"
    if category_column not in df.columns:
        print(f"错误：未找到列 '{category_column}'。请确认 Excel 文件中的列名。")
        print("可用的列名：")
        for col in df.columns:
            print(f"  - {col}")
        sys.exit(1)

    # 3. 获取所有唯一的商品分类
    unique_categories = df[category_column].unique()
    print(f"发现 {len(unique_categories)} 个商品分类：")
    for cat in unique_categories:
        print(f"  - {cat}")

    # 4. 为每个分类创建独立的 Excel 文件
    generated_files = []
    for category in unique_categories:
        # 筛选当前分类的数据
        category_df = df[df[category_column] == category].copy()

        # 生成输出文件名
        safe_category = str(category).replace("/", "_").replace("\\", "_").replace(":", "_").replace("*", "_").replace("?", "_").replace("\"", "_").replace("<", "_").replace(">", "_").replace("|", "_")
        output_filename = f"{safe_category}_sales_data.xlsx"
        output_path = OUTPUT_DIR / output_filename

        # 保存为新的 Excel 文件
        try:
            category_df.to_excel(output_path, index=False)
            generated_files.append({
                "category": category,
                "filename": output_filename,
                "path": output_path,
                "count": len(category_df)
            })
            print(f"已生成文件：{output_filename} (包含 {len(category_df)} 条记录)")
        except Exception as e:
            print(f"错误：保存文件 {output_filename} 失败。{e}")

    # 5. 报告结果
    print("\n" + "="*60)
    print("处理完成！生成的文件清单：")
    print("="*60)
    for file_info in generated_files:
        print(f"分类: {file_info['category']}")
        print(f"  文件: {file_info['filename']}")
        print(f"  路径: {file_info['path']}")
        print(f"  商品数量: {file_info['count']}")
        print("-" * 40)

    print(f"\n总计生成了 {len(generated_files)} 个文件。")
    print(f"所有文件已保存到目录：{OUTPUT_DIR}")


if __name__ == "__main__":
    main()