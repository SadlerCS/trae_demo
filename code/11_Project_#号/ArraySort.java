public class ArraySort {
    public static void bubbleSort(int[] arr) { // 冒泡排序：按升序原地排序整型数组
        if (arr == null || arr.length < 2) return; // 输入为空或长度小于2时无需排序
        boolean swapped; // 记录本轮是否发生过交换
        int n = arr.length; // 未排序区间的上界（右边界）
        do { // 至少执行一轮遍历，直到某一轮没有交换为止
            swapped = false; // 每轮开始先重置交换标记
            for (int i = 1; i < n; i++) { // 遍历未排序区间，相邻元素两两比较
                if (arr[i - 1] > arr[i]) { // 若前一个元素大于后一个元素，则需要交换
                    int tmp = arr[i]; // 暂存后一个元素
                    arr[i] = arr[i - 1]; // 将前一个元素移到后一个位置
                    arr[i - 1] = tmp; // 将暂存的值放回前一个位置，完成交换
                    swapped = true; // 标记发生过交换
                } // 条件块结束
            } // 单轮遍历结束
            n--; // 缩小未排序区间，最后一个元素已就位
        } while (swapped); // 若本轮发生交换则继续下一轮，否则结束
    } // 方法结束

    public static void main(String[] args) {
        int[] a = {5, 1, 4, 2, 8, 0, -3, 7};
        bubbleSort(a);
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < a.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(a[i]);
        }
        System.out.println(sb.toString());
    }
}
