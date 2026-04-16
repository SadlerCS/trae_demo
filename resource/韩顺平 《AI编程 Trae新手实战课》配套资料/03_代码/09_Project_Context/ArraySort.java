public class ArraySort {
    public static void bubbleSort(int[] arr) {
        if (arr == null || arr.length < 2) return;
        boolean swapped;
        int n = arr.length;
        do {
            swapped = false;
            for (int i = 1; i < n; i++) {
                if (arr[i - 1] > arr[i]) {
                    int tmp = arr[i];
                    arr[i] = arr[i - 1];
                    arr[i - 1] = tmp;
                    swapped = true;
                }
            }
            n--;
        } while (swapped);
    }

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
