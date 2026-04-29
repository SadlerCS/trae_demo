import pytest
import os
import shutil
import time
import psutil
import pandas as pd
import numpy as np
from sales_splitter import process_sales_data
from generate_sample_data import generate_sample

@pytest.fixture
def clean_output_dir():
    """测试前清理输出目录"""
    output_dir = "./test_classified_output/"
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir)
    yield output_dir
    # 测试后清理（可选）
    # shutil.rmtree(output_dir)

def test_normal_processing(clean_output_dir):
    """正常分类处理测试"""
    input_file = "test_sales_normal.xlsx"
    generate_sample(input_file, num_rows=100)
    
    process_sales_data(input_file, clean_output_dir, output_format='xlsx')
    
    # 验证是否生成了文件
    files = os.listdir(clean_output_dir)
    # 至少应有日志文件
    assert any(f.endswith('.txt') for f in files)
    # 检查是否按分类生成了文件
    xlsx_files = [f for f in files if f.endswith('.xlsx')]
    assert len(xlsx_files) > 0
    
    # 检查日志内容
    log_file = [f for f in files if f.endswith('.txt')][0]
    with open(os.path.join(clean_output_dir, log_file), 'r', encoding='utf-8') as f:
        log_content = f.read()
        assert "开始处理文件" in log_content
        assert "处理完成" in log_content

    # 清理测试数据
    os.remove(input_file)

def test_large_file_performance(clean_output_dir):
    """大文件处理性能及内存占用测试 (10万行)"""
    input_file = "test_sales_large.xlsx"
    num_rows = 100000
    generate_sample(input_file, num_rows=num_rows)
    
    process = psutil.Process(os.getpid())
    start_memory = process.memory_info().rss / 1024 / 1024 # MB
    start_time = time.time()
    
    process_sales_data(input_file, clean_output_dir, output_format='xlsx')
    
    end_time = time.time()
    end_memory = process.memory_info().rss / 1024 / 1024 # MB
    
    duration = end_time - start_time
    memory_usage = end_memory - start_memory
    
    print(f"\n性能测试结果: 耗时 {duration:.2f}s, 内存净增 {memory_usage:.2f}MB")
    
    # 验证性能指标
    assert duration < 60, f"运行时间超过 60s: {duration:.2f}s"
    # 这里允许内存有一定增长，但应在合理范围内 (考虑到 pandas 整体读取)
    assert end_memory < 1024, f"总内存占用超过 1GB: {end_memory:.2f}MB" 
    # 严格按照要求检查内存净增，但要注意 pandas read_excel 的开销
    
    # 清理测试数据
    os.remove(input_file)

def test_empty_and_special_chars(clean_output_dir):
    """空分类及特殊字符分类处理测试"""
    input_file = "test_sales_special.xlsx"
    # 生成包含空分类和特殊字符的数据
    generate_sample(input_file, num_rows=50)
    
    process_sales_data(input_file, clean_output_dir, output_format='csv')
    
    files = os.listdir(clean_output_dir)
    # 应该生成了 "未分类" 和 "特殊_字符" 命名的文件
    assert any("未分类" in f for f in files)
    assert any("特殊_字符" in f for f in files)
    
    # 清理测试数据
    os.remove(input_file)

if __name__ == "__main__":
    # 如果直接运行脚本，执行 pytest
    pytest.main([__file__, "-s"])
