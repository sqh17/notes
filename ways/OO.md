## 面向对象-review
最近在看javascript高级程序设计这本书，看到了面向对象这一本部分，感觉很重要，所以再一次复习一遍，总结下知识，篇幅过多，分成了三部分，创建对象，原型和原型链，继承。
### OO-create

#### 面向对象
(Object-Oriented,OO)的语言有一个标志，那就是它们都有类的的概念，而通过类可以创建任意个多个具有相同属性和方法的对象。而javascript在es6出来之前没有类的概念。所以javascript的对象和其他语言的对象有很大的不同。

#### 什么是对象
简单来说，对象就是没有顺序的并且有属性和对应属性值的集合（对象的每个属性或方法都有名字，而且映射到一种值，这个值可以数据或者函数）。

#### 对象的定义
1. __字面量__：在大括号内部声明属性和对应的属性值，声明方法和其对应的方法名，可多次声明，没有顺序。
```javascript
var obj = {
    name:'peter',
    age:18,
    sayHi:function(){
        console.log(`Hi`);
    }
};
```
name就是属性，'peter'就是对应的属性值。
__由此可见：字面量声明对象只能用于单方面的声明，无法进行复用。最大的缺点就是重复造轮子，产生大量的重复性代码__

2. __工厂模式__：使用简单的函数创建对象，为对象添加属性或方法，然后返回这个对象
    * 无参数
    ```javascript
    function Obj(){
        var obj = new Object();
        obj.name = 'peter';
        obj.age = 18;
        obj.sayHi = function(){
            console.log(`Hi`);
        }
        return obj;
    }
    var person = Obj();
    ```
    很显然：该声明方式很单一，和字面量差不多，都是单一声明，只能适合同一类型同一属性可以重复调用的对象;同一类型的但不同属性的不能调用，只能重新再次声明。
    * 有参数
    ```javascript
    function Obj(name, age){
        var obj = new Object();
        obj.name = name;
        obj.age = age;
        obj.sayHi = function(){
            console.log(`Hi`);
        }
        return obj;
    }
    var person = Obj('peter', 18);
    ```
    工厂模式的传参数声明方式，可以无数次调用该函数来声明某个对象，解决了创建多个相似对象的问题，但却没有解决对象识别的问题（即怎样知道一个对象的类型）。

3. __构造函数模式__：通过创建函数，将属性和方法赋给this对象。通过new实例一个对象，进而调用该函数，this指向该对象
```javascript
function Person(name,age){
    this.name = name;
    this.age = age;
    this.sayHi = function(){
        console.log(this.name);
    }
}
var peter = new Person('peter',18);
var tom = new Person('tom',22);
```
该声明方式是类似与工厂模式，但和工厂模式有所不同，它把属性和方法都定义给了this，每个创建新的实例，都可以使用该构造函数，实现了复用。  
但是构造函数有个缺点，就是其声明的方法本身是个函数，每个实例调用方法都是一样的，所以把方法定义到构造函数外面，作为全局函数，这样实现了方法的复用，但新问题又来了，如果这个实例要调用很多方法，岂不是写很多方法，这样导致的后果就是内存空间占用，浪费资源。

* tip: new操作符进行了哪些步骤：
    1. 创建一个新对象，
    2. 将构造函数的作用域赋给新对象（this指向新对象)。
    3. 执行构造函数的代码（为新对象添加属性或方法)。

4. __原型模式__：创建一个构造函数,将属性和方法放到该函数的原型上，实现实例调用其原型上的所有属性和方法。
```javascript
function Person(){
}
Person.prototype.name = 'peter';
Person.prototype.age = 18;
Person.prototype.sayHi = function(){
    console.log(this.name);
}
var peter = new Person();
```
每个函数都有prototype属性，这个属性就是一个指针，指向一个对象，这个对象的用途是包含由特定类型的所有实例所共享的属性和方法，使用原型对象就可以让所有实例对象均包含这些属性及方法。
原型模式声明方式是利用构造函数的壳子，将属性和方法写到其原型上，这样避免了占用内存空间，但是从例子上看，如果多个实例的话，都会指向同一个对象，更改该实例所在的原型对象的值，会直接改变原有的值，如下例子：
```javascript
Person.prototype.name = 'tom';
Person.prototype.age = 22;
```
这样的话缺点很明显，写了实例tom的属性和方法，就改变了实例peter的属性和方法。

5. __混合模式（组合使用构造函数模式和原型模式）__：利用构造函数写对象的属性，利用原型模式写对象的方法。
```javascript
function Person(name, age){
    this.name = name;
    this.age = age;
}
Person.prototype.sayHi = function(){
    console.log(`Hi,我叫${this.name}`);
}
var peter = new Person('peter', 18);
peter.sayHi();  // Hi，我叫peter
```
混合模式是最常见创建对象的方式，这样的好处是复用了对象的属性，而且方法放到了原型上，不管声明多少个方法，都不占用内存并且互不影响。说缺点吧，emmm，那就是在除js开发人员开发这种模式很另类。。。

6. __动态原型模式__：在构造函数模式上，将所有信息都写在构造函数里，包括原型上的方法。
```javascript
function Person(name,age){
    this.name = name;
    this.age = age;
    if(typeof this.sayHi != 'function'){
        Person.prototype.sayHi = function(){
            console.log(`Hi,我叫${this.name}`);
        }
    }
}
```
它把所有信息都封装到了构造函数内，而通过在构造函数中初始化原型，又保持了同时使用构造函数和原型的优点。通过检查某个应该存在的方法是否有效，来决定是否初始化原型。  
大白话就是：_如果去掉if的话，每new一次（即每当一个实例对象生产时），都会重新定义一个新的函数，然后挂到Person.prototype.say上，而实际上，只需要定义一次就够了，因为所有的实例都会共享此属性的，所以如果去掉if的话，会造成没有必要的时间和空间的浪费，而加上if后，只在new第一次实例化时会定义say方法，之后都不会再定义了。_
这种方式创建对象是最好又最有效的方式，推荐使用。  
ps！__使用动态原型模式，就不能使用字面量重写原型，如果在创建实例的情况下，重写原型，会切断现有实例与新原型的联系。__

7. __寄生构造函数模式__：在工厂模式（有参数）的基础上，new出一个实例
```javascript
function Person(name,age){
    var o = new Object();
    o.name = name;
    o.age = age;
    o.sayHi = function(){
        console.log(this.name);
    }
    return o;
}
var peter = new Person('peter',18);
peter.sayHi();
```
此模式除了new实例外其他的都和工厂模式一样，构造函数在不返回值的情况下，默认会返回新实例，而通过在构造函数的末尾添加一个return语句，可以重写调用构造函数时返回值。  
简单的说，如果没有return，和普通的构造函数一致，如果有return，它就返回想要返回的值。  
ps：__构造函数返回的对象和构造函数外部创建的对象没有什么不同，不能依赖instanceof操作符来确定对象的类型。所以！不提倡用该模式。__

8. __稳妥构造函数模式__：在一些安全的环境中(禁止使用this和new)，或者防止数据被其他应用程序改动时使用。在寄生构造函数的基础上，构造函数内部不使用this，外部不使用new
```javascript
function Person(name,age){
    var o = new Object();
    o.name = name;
    o.age = age;
    o.sayHi = function(){
        console.log(name);
    }
    return o;
}
var peter = Person('peter',18);
peter.sayHi(); // peter
```
该模式是由道格拉斯.克罗克福德发明的稳妥对象，所谓的稳妥对象就是指的没有公共属性，而且其方法也不应用this的对象。  
在上面的例子上，peter保存的就是一个稳妥对象，除了sayHi方法外，没有别的方式能够访问到其数据成员，虽然外部能够给这个对象添加新的方法或数据成员，但也不可能有别的方法传回到构造函数内的原始数据。
所以这个模式适合在安全模式下引用。


### OO-proto

#### 什么是原型
原型有两种形式：prototype和__proto__；对应的呈现方式不同。
* prototype：是函数的一个属性，这个属性的值是一个对象。所以一切的函数都有原型，这个原型就是prototype。
* \_\_proto__：是对象的一个属性，同样的属性值也是一个对象。（但__proto__不是一个规范属性，只是部分浏览器实现了此属性，对应的标准属性是\[\[prototype]]）所以一切对象都有标准属性。

ps: __函数没有\_\_proto__属性，同样的，对象也没有prototype属性__
```javascript
var obj = {name:'peter'};
console.log(obj.__proto__) // {constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, …}

var fn = function(){this.name = 'peter'};
console.log(fn.prototype) // {constructor: ƒ}
```
所有的函数的默认原型都是Object的实例，因此默认原型都会包含一个内部指针，指向Object.prototype，所以所有的自定义类型都含有toString(),valueOf()等默认方法的根本原因。

#### 理解原型对象
在高程中，有句原话：__无论什么时候，只要创建了一个函数，就会根据一组特定的规则为该函数创建一个prototype属性，这个属性指向函数的原型对象。在默认情况下，所有的原型对象都会自动获得一个constructor（构造函数）属性，这个属性包含一个指向prototype属性所在函数的指针。__
简单来说：__只要创建了一个函数，都会有一个prototype属性，属性值就是一个对象，这个对象里有一个属性constructor，这个值就是该函数。__
constructor是一个构造器。一般指向的是其构造函数。
```javascript
var fn = function(){this.name = 'peter'};
console.log(fn.prototype) // {constructor: ƒ}   
console.log(fn.prototype.constructor == fn)  // true
```
对于__proto__，只要是对象，都有constructor属性。在创建的方式中，constructor所指向的构造函数不一样。
1. 字面量创建对象
字面量创建对象，其中__proto__的constructor属性指向的构造函数是原始对象函数Object()。
```javascript
var obj = {name:'peter'}
console.log(obj.__proto__.constructor) // ƒ Object() { [native code] }

console.log(obj.__proto__.constructor == Object);  // true
console.log(obj.constructor == Object )  // true
console.log(obj.__proto__.constructor == obj.constructor) // true
```
2. 构造函数创建对象
所谓的构造函数：就是先创建一个函数，new实例化一个对象，函数里的this指向这个对象。
构造函数是个函数，有prototpe属性，值是个对象，对象里有个constructor属性，指向这个函数Preson。
实例化的对象peter是一个对象，有__proto__属性，值是个对象，对象里constructor属性，指向这个构造函数Person。
两个constructor所对应的构造函数是相等的,因此实例化的__proto__ 和 构造函数的prototype是相等的。
```javascript
function Person(name,age){
    this.name = name;
    this.age = age;
    this.sayHi = function (){
        console.log(this.name);
    }
}
var peter = new Person('peter','male');
console.log(Person.prototype.constructor == peter.__proto__.constructor)  // true
console.log(Person.prototype == peter.__proto__) // true
```
3. Object.create() 创建对象
Object.create()是es5新增的一个方法，创建一个新对象，使用现有的对象来提供新创建的对象的__proto__。
ps:__这个创建的对象的\_\_proto__和原对象的\_\_proto__不一样，这说明了新创建的对象只是复制愿对象的原型，但是是一个独立的原型。__
```javascript
var obj = {};
var male = Object.create(obj);
console.log(male.__proto__.constructor) // ƒ Object() { [native code] }
male.name = 'tom';
console.log(male); //  {name:'tom'}
console.log(obj); //  {name:'peter'}
console.log(male.__proto__ == obj.__proto__);  // false
```

#### 原型链
其基本思想是：__利用原型让一个引用类型继承另一个引用类型的属性和方法。__
当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的__proto__（即它的构造函数的prototype）中寻找，如果该__proto__上没有这个属性，就去__proto__的属性上去找（\_\_proto__.\_\_proto__),依次往下找，找到就使用，找不到就继续往下找，到最上层都没有找到就返回null。
这样的形式就叫原型链。 总结如下：__由于\_\_proto__是任何对象都有的属性，所以会形成一条\_\_proto__连起来的链条，递归访问__proto__，到最后若没有找到，则返回一个null。__
例子如下：(为了强调原型链，所以采用了混合模式创建对象)
```javascript
function Person(name,age){
    this.name = name;
    this.age = age;
}
Person.prototype.sayHi = function(){
    console.log(this.name);
}
var peter = new Person('peter','male');
peter.sayName = function(){
    console.log('我叫17号')
}
peter.sayName();
peter.sayHi();
peter.toString();
peter.toGo();
```
这个例子要调用四个方法。先描述怎么拿到该方法：
1. peter.sayName(); // 我叫17号
对象本身写的方法，是挂载了对象的属性上，所以不用通过原型链的方式直接就能拿到该方法。

2. peter.sayHi(); // peter
该对象上没有sayHi的方法，=> 该对象的\_\_proto__去找 => peter.\_\_proto__(由于peter.\_\_proto__ = Person.prototype) => 该prototype上有sayHi属性，调用，查找结束。

3. peter.toString(); // "[object Object]"
该对象上没有toString的方法，=> 该对象的__proto__去找 => peter.__proto__ => 该__proto__上没有该属性 => peter.__proto__.__proto__ => 在该原型上找到toString(),调用，结束。

4. peter.toGo();
该对象上没有toGo的方法，=> 该对象的\_\_proto__去找 => peter.\_\_proto__ => 该\_\_proto__上没有该属性 => peter.\_\_proto__.\_\_proto__ => 在该原型上没有该属性 => peter.\_\_proto__.\_\_proto__.\_\_proto__ => 返回null => 没有该属性，直接报错。

从上面的例子就可以得知，__原型链就是通过\_\_proto__连起来的链子，可以依次查找，找到就调用，找不到直接undefined或报错。这就是原型链。__

