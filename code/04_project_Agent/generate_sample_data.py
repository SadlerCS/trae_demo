import pandas as pd
import numpy as np
import os

def generate_sample(filename="sales_data.xlsx", num_rows=1000):
    """生成测试样例数据"""
    categories = ['电子产品', '日用百货', '办公文具', '体育用品', '图书音像', '空', '特殊/字符']
    products = ['产品A', '产品B', '产品C', '产品D', '产品E']
    
    data = {
        '订单号': [f"ORD{i:06d}" for i in range(num_rows)],
        '日期': pd.date_range(start='2024-01-01', periods=num_rows, freq='h'),
        '商品分类': np.random.choice(categories, num_rows),
        '商品名称': np.random.choice(products, num_rows),
        '单价': np.round(np.random.uniform(10, 500, num_rows), 2),
        '数量': np.random.randint(1, 10, num_rows),
    }
    
    # 模拟计算列（销售额）
    df = pd.DataFrame(data)
    df['销售额'] = df['单价'] * df['数量']
    
    # 处理空分类和特殊字符
    df.loc[df['商品分类'] == '空', '商品分类'] = np.nan
    
    # 保存为多 sheet
    with pd.ExcelWriter(filename, engine='xlsxwriter') as writer:
        df.iloc[:num_rows//2].to_excel(writer, index=False, sheet_name='Sheet1')
        df.iloc[num_rows//2:].to_excel(writer, index=False, sheet_name='Sheet2')
        
    print(f"样例数据已生成: {filename}, 总行数: {num_rows}")

if __name__ == "__main__":
    generate_sample()
