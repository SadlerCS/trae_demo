public class Tab_Settings {
    //请编写一个选择排序，对一个整数数组进行排序，排序使用选择排序，从大到小排序
    public static void selectionSort(int[] arr){
        for(int i=0;i<arr.length-1;i++){
            int maxIndex=i;
            for(int j=i+1;j<arr.length;j++){
                if(arr[j]>arr[maxIndex]){
                    maxIndex=j;
                }
            }
            int temp=arr[i];
            arr[i]=arr[maxIndex];
            arr[maxIndex]=temp;
        }
    }
    //请编写一个冒泡排序，对一个整数数组进行排序，排序使用冒泡排序，从大到小排序
    public static void bubbleSort(int[] arr){
        for(int i=0;i<arr.length-1;i++){
            for(int j=0;j<arr.length-1-i;j++){
                if(arr[j]<arr[j+1]){
                    int temp=arr[j];
                    arr[j]=arr[j+1];
                    arr[j+1]=temp;
                }
            }
        }
    }
}
