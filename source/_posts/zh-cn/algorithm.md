---
title: algorithm
excerpt: algorithm
categories: 
- FE
---

# 查找
## kmp
设： 输入字符串为haystack， 要查找的子串needle
1. 得到needle的回溯特征nextStack：
    * needle第一个字符的回溯位置为-1， 表示needle第2个字符不匹配时，haystack的上个位置需要与needle的-1位置对齐，即下一步要匹配haystack当前位置与needle头部。
    * 得到needle第n个字符的回溯位置：设n-1个字符的回溯位置为k，则查看needle[k + 1]与needle[n]的值是否相等，相等则说明第n个字符的回溯位置直接就是k+1
    * 若不想等，则继续回溯位置k的上个回溯位置j，再次匹配下个字符，以此类推。
2. 匹配haystack：
    * 两个游标代表haystack和needle匹配位置，均从0开始。
    * 游标所在位置字符相等，则同时前进；
    * 不匹配时， 若needle位置为0，则仅haystack向前。
    * 其他情况不匹配时，设当前haystack游标位置为hi, needle游标位置为ni,  查找最后匹配位置ni - 1的回溯位置， 并将ni设为该位置的下一个位置（ni = nextStack[ni - 1] + 1），hi不变，下一步即重新开始匹配needle[ni]和haystack[hi]
    * needle匹配了最后一个位置后停止，计算并返回hi - needle.lenth

### examples
#### js

```js
var strStr = function(haystack, needle) {
    // use kmp
    var needleLenth = needle.length;
    if(needleLenth === 0) {
        return 0;
    }
    var nextStack = {
        0: -1
    };
    var index = 0;
    var hayLength = haystack.length;
    for(var i = 1;i < needleLenth; i++) {
        index = nextStack[i - 1];
        // 回溯到后缀匹配的最近位置，此时，后缀的下个字符与当前位置i的字符匹配或是回溯位置为-1（需要从头开始）
        while(index >=0 && needle[index + 1] !==  needle[i]) {
            index = nextStack[index];
        }
        // 后缀的下个字符与当前位置i的字符匹配， 将当前字符的回溯位置设为元后缀的下个字符位置
        if(needle[index + 1] ===  needle[i]) {
            nextStack[i] = index + 1;
        } else {
            // 无回溯位置
            nextStack[i] = -1;
        }
    }
    var hayIndex = 0;
    var needleIndex = 0;
    while(hayIndex< hayLength && needleIndex < needleLenth) {
        if(haystack[hayIndex] === needle[needleIndex]) {
            hayIndex ++;
            needleIndex++;
        } else if (needleIndex === 0) {
            hayIndex++;
        } else {
            // 若不使用nextStack， 需要从hayIndex = hayIndex - needleIndex + 1 与needleIndex = 0重新匹配
            // 使用nextStack， 则只要从hayIndex = hayIndex与needleIndex = nextStack[needleIndex - 1] + 1匹配
            // 即是自动匹配了hayIndex之前的后缀与needle的前缀
            needleIndex = nextStack[needleIndex - 1] + 1;
        }
    }
    
    if(needleIndex === needleLenth) {
        return hayIndex - needleLenth;
    } else {
        return -1;
    }
};

```

# 排序

## 快排
输入： 数组a， 排序范围start - end

1. 定义比较大小并调换位置的函数compare
2. 数组a仅有一个元素，返回其本身。
3. 数组a有2个元素， 两个元素比较排序后返回。
4. 数组a有3个元素， 两两比较排序后返回。
5. 数组a多于3个元素，在中间位置的元素和两边元素，排序，并选取中间元素为pivot
6. 将pivot和倒数第二个元素（a[end -1]）调换位置。
7. 设置两个j, k游标分别从start + 1，end -2位置开始向中间移动，直到j >= k, 当j移动到大于等于pivot元素，同时k移动到小于等于pivot的元素时，互换元素位置。
8. 循环结束后，将j所在的元素（大于等于pivot）和end-1位置的pivot互换位置，此时j左侧元素都比pivot小，右侧都比pivot大。
9. 递归排序[start, j-1] [j+1, end] 范围的元素。

### examples

#### C++

```cpp
#include "stdafx.h"
#include <vector>
using namespace std;
namespace AlgorithmPractice
{

	//快速排序
	//定义一项操作，使得以pivot为界，将数组分为两组，后一组元素比前一组的每个元素都要大
	//继续对每组进行重复这样的操作，直到分无可分（每组只剩下一个元素），即完成了整个排序
	//将pivot选为两边元素和中间元素的中值
	//使用递归
	void QuickSort(vector<int> & a, int start, int end)
	{
		int diff = end - start;
		//当有0个或1个元素时，直接返回
		if (diff <= 0)
		{
			return;
		}
		else
		{
			//
			if (diff == 1 || diff == 2)
			{
				getPivot(a, start, end);
				return;
			}
		}
		//确定锚点
		//此时锚点已经放置到end-1的位置
		int pivot = getPivot(a, start, end);
		//使用两个游标j,k在[start+1,end-2]范围内分别游走，当j>=k时表示游历完成
		//游标分别寻找大于和小于pivot的位置，然后交换
		//当结束时，jk会分别位于第一个大于/小于pivot的元素上
		int j = start + 1;
		int k = end - 2;
		while (1)
		{
			//找到第一个不符合要求的元素
			//不需要担心越界，因为左右各自有比pivot小/大的数
			while (a[j] < pivot)
			{
				j++;
			}
			//无需考虑等号，留在原地，其会最终靠在一起
			while (a[k] > pivot)
			{
				k--;
			}
			if (j >= k)
			{z
				break;
			}
			else
			{
				swapEle(a, j, k);
			}
		}
		//此时j的位置为第一个大于pivot的元素，把它和右边end-1位置上的pivot交换
		swapEle(a, j, end - 1);
		//这样pivot恰好位于中间位置，把数组分为[start,j-1][j+1,end]两部分
		//使用递归，分别进行同样的操作
		QuickSort(a, start, j - 1);
		QuickSort(a, j + 1, end);
	}
	//交换数组中两个元素的位置
	void swapEle(vector<int> & a, int ia, int ib)
	{
		int tmp = a[ia];
		a[ia] = a[ib];
		a[ib] = tmp;
	}
	//确定pivot
	int getPivot(vector<int> & a, int ia, int ib)
	{
		int midi = (ia + ib) / 2;
		//比较左边和中间，确保左边相对小
		if (a[ia] > a[midi])
		{
			swapEle(a, ia, midi);
		}
		//比较左边和右边，确保左边相对小
		if (a[ia] > a[ib])
		{
			swapEle(a, ia, ib);
		}
		//比较中间和右边，确保中间相对小
		if (a[midi] > a[ib])
		{
			swapEle(a, midi, ib);
		}
		//此时midi处的值选为pivot，但面临的问题是：
		//1. pivot最终索引位置不确定
		//2.可以确定的是ia，ib的元素位置都不需要再变动
		//故先把pivot放于ib-1的位置，待分组完全后，再把其放到最终的中间位置
		swapEle(a, midi, ib - 1);
		return a[ib - 1];
	}
}
```


#### js

```js
function quicksort(mangleArr, left = 0, right = mangleArr.length - 1) {
    if ((right - left) <= 1) {
        switchPos(left, right, mangleArr);
        return mangleArr;
    }
    let _right = right;
    let _left = left;
    let _array = mangleArr;
    // establish two flag
    let mid = Math.ceil((left + right) / 2);
    switchPos(_left, mid, _array);
    switchPos(_left, _right, _array);
    switchPos(mid, _right, _array);
    let pivot = _array[mid];
    switchPos(mid, _right - 1, _array, true);
    _right -= 2;
    _left++;
    while (true) {
        while (_array[_left] < pivot) {
            _left++;
        }

        while (_array[_right] > pivot) {
            _right--;
        }
        if (_left >= _right) {
            break;
        } else {
            switchPos(_left, _right, _array);
        }
    }
    switchPos(_left, right - 1, _array, true);
    quicksort(_array, left, _left - 1);
    quicksort(_array, _left + 1, right);
    return _array;
}


function switchPos(a, b, _array, force = false) {
    if (_array[a] > _array[b] || force) {
        let temp = _array[a];
        _array[a] = _array[b];
        _array[b] = temp;
        return true;
    } else {
        return false;
    }
}
```