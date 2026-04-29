public class ArraySort {
    public static void bubbleSort(int[] arr) {
        if (arr == null || arr.length < 2) return;
        boolean swapped;
        for (int i = 0; i < arr.length - 1; i++) {
            swapped = false;
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int tmp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tmp;
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }

    public static void main(String[] args) {
        int[] a = {5, 1, 4, 2, 8};
        System.out.println("Before: " + java.util.Arrays.toString(a));
        bubbleSort(a);
        System.out.println("After: " + java.util.Arrays.toString(a));
    }
}
