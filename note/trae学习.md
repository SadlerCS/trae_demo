# 01-Trae课程介绍



![image-20260416175035767](trae学习.assets/image-20260416175035767.png)



![image-20260416175126637](trae学习.assets/image-20260416175126637.png)



![image-20260416175145703](trae学习.assets/image-20260416175145703.png)





![image-20260416175201766](trae学习.assets/image-20260416175201766.png)

![image-20260416175211479](trae学习.assets/image-20260416175211479.png)

![image-20260416175221018](trae学习.assets/image-20260416175221018.png)

![image-20260416175235302](trae学习.assets/image-20260416175235302.png)

![image-20260416175244397](trae学习.assets/image-20260416175244397.png)

![image-20260416175250434](trae学习.assets/image-20260416175250434.png)

![image-20260416175317785](trae学习.assets/image-20260416175317785.png)



# 02-Trae安装,注册 登录和配置



![image-20260416175343621](trae学习.assets/image-20260416175343621.png)

![image-20260416175355214](trae学习.assets/image-20260416175355214.png)

![image-20260416175437797](trae学习.assets/image-20260416175437797.png)



![image-20260416175609007](trae学习.assets/image-20260416175609007.png)



 ![image-20260416175712521](trae学习.assets/image-20260416175712521.png)

![image-20260416180259101](trae学习.assets/image-20260416180259101.png)

![image-20260416180402473](trae学习.assets/image-20260416180402473.png)

![image-20260416180407975](trae学习.assets/image-20260416180407975.png)





![image-20260416180947673](trae学习.assets/image-20260416180947673.png)

 



# 03-快速体验trae



![image-20260416182831845](trae学习.assets/image-20260416182831845.png)





![image-20260416183312608](trae学习.assets/image-20260416183312608.png)





![image-20260416183333757](trae学习.assets/image-20260416183333757.png)





![image-20260416184207538](trae学习.assets/image-20260416184207538.png)



![image-20260416184157416](trae学习.assets/image-20260416184157416.png)

![image-20260416184500600](trae学习.assets/image-20260416184500600.png)



# 04-Tab-CUE(上下文理解引擎)





![image-20260416184957050](trae学习.assets/image-20260416184957050.png)

![image-20260416185024663](trae学习.assets/image-20260416185024663.png)



![image-20260416185055803](trae学习.assets/image-20260416185055803.png)



![image-20260416185115090](trae学习.assets/image-20260416185115090.png)



![image-20260416185715960](trae学习.assets/image-20260416185715960.png)



```java
public class ArraySort {
    // 编写一个方法, 接受一个数组, 并排序, 排序使用,从冒泡排序
    public static void bubbleSort(int[] arr) {
        for (int i = 0; i < arr.length - 1; i++) {
            for (int j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }

    // 编写一个方法, 接收一个数组, 并打印
    public static void printArray(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }

    // 编写一个 main 方法 测试 bubbleSort 方法 和 printArray方法
    public static void main(String[] args) {
        int[] arr = {1, 3, 2, 4, 5};
        printArray(arr);
        bubbleSort(arr);
        printArray(arr);
    }

}

```





![image-20260417150044774](trae学习.assets/image-20260417150044774.png)



![image-20260417151118793](trae学习.assets/image-20260417151118793.png)





![image-20260417151238094](trae学习.assets/image-20260417151238094.png)



![image-20260417151854643](trae学习.assets/image-20260417151854643.png)



# 05-内置智能体



![image-20260417152019039](trae学习.assets/image-20260417152019039.png)







![image-20260417152204445](trae学习.assets/image-20260417152204445.png)

![image-20260417152249315](trae学习.assets/image-20260417152249315.png)





![image-20260417152955482](trae学习.assets/image-20260417152955482.png)



![image-20260417153319946](trae学习.assets/image-20260417153319946.png)

# 06-SOLO模式(大众点评网)



![image-20260417153505514](trae学习.assets/image-20260417153505514.png)

![image-20260417153643927](trae学习.assets/image-20260417153643927.png)





![image-20260417153736342](trae学习.assets/image-20260417153736342.png)





![image-20260417153756034](trae学习.assets/image-20260417153756034.png)





![image-20260417153808809](trae学习.assets/image-20260417153808809.png)



![image-20260417153830832](trae学习.assets/image-20260417153830832.png)

![image-20260417153901314](trae学习.assets/image-20260417153901314.png)





![image-20260417160457817](trae学习.assets/image-20260417160457817.png)



![image-20260417160842161](trae学习.assets/image-20260417160842161.png)



# 07-自定义智能体



![image-20260417161455851](trae学习.assets/image-20260417161455851.png)







![image-20260417162022325](trae学习.assets/image-20260417162022325.png)





# 11-trae上下文



![image-20260417212019657](trae学习.assets/image-20260417212019657.png)

![image-20260417212031598](trae学习.assets/image-20260417212031598.png)





 



