## 面向对象-review
最近在看javascript高级程序设计这本书，看到了面向对象这一本部分，感觉很重要，所以再一次复习一遍，总结下知识，篇幅过多，分成了三部分，创建对象，原型和原型链，继承。
### OO-create

#### 面向对象
(Object-Oriented,OO)的语言有一个标志，那就是它们都有类的的概念，而通过类可以创建任意个多个具有相同属性和方法的对象。而javascript在es6出来之前没有类的概念。所以javascript的对象和其他语言的对象有很大的不同。

#### 什么是对象
简单来说，对象就是没有顺序的并且有属性和对应属性值的集合（对象的每个属性或方法都有名字，而且映射到一种值，这个值可以数据或者函数）。

#### 对象的定义
##### __字面量__
在大括号内部声明属性和对应的属性值，声明方法和其对应的方法名，可多次声明，没有顺序。
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

##### __工厂模式__
使用简单的函数创建对象，为对象添加属性或方法，然后返回这个对象
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

##### __构造函数模式__
通过创建函数，将属性和方法赋给this对象。通过new实例一个对象，进而调用该函数，this指向该对象
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

##### __原型模式__
创建一个构造函数,将属性和方法放到该函数的原型上，实现实例调用其原型上的所有属性和方法。
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

##### __混合模式（组合使用构造函数模式和原型模式）__
利用构造函数写对象的属性，利用原型模式写对象的方法。
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

##### __动态原型模式__
在构造函数模式上，将所有信息都写在构造函数里，包括原型上的方法。
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

##### __寄生构造函数模式__
在工厂模式（有参数）的基础上，new出一个实例
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

##### __稳妥构造函数模式__
在一些安全的环境中(禁止使用this和new)，或者防止数据被其他应用程序改动时使用。在寄生构造函数的基础上，构造函数内部不使用this，外部不使用new
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


### OO-inherit

#### 面向对象继承
许多语言都支持两种继承方式: __接口继承__ 和 __实现继承__ 。
接口继承只继承方法签名（方法签名由方法名称和一个参数列表（方法的参数的顺序和类型）组成，java所属）。
而js中的函数没有签名，所以无法实现接口继承，只能实现实现继承，而 __实现继承主要依靠原型以及原型链实现的__。

高程中写到：__假如我们让原型对象等于另一个类型的实例，结果会怎么样呢？显然，此时的原型对象将包含一个指向另一个原型的指针，相应地，另一个原型中也包含着一个指向另一个构造函数的指针。假如另一个原型又是另一个类型的实例，那么上述关系依然成立，如此层层递进，就构成了实例与原型的链条。这就是所谓原型链的基本概念__

js的继承是依据原型以及原型链来实现的，回顾前几节的知识，可以得知，一个构造函数创建出来的实例，都可以访问到该构造函数的的属性，方法，还有构造函数的原型的属性以及方法。

首先 先了解构造函数、原型和实例的关系：每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数的指针，而实例都包含一个指向原型对象的内部指针。通俗的说：__实例通过内部指针可以访问到原型对象，原型对象通过constructor指针，找到其构造函数__。
那么js中的继承的基本思路就是利用原型以及原型链的特性，改变内部指针的指向，进而实现继承。

##### __原型链继承__
js所有继承都基于原型链继承。
```javascript
function Animal(){
    this.type = 'animal';
}
Animal.prototype.feature = function(){
    alert(this.type);
}
function Cat(name,color){
    this.name = name;
    this.color = color;
}  
Cat.prototype = new Animal();

var tom = new Cat('tom','blue');
console.log(tom.name);  // 'tom'
console.log(tom.color); // 'blue'
console.log(tom.type);  // 'animal'
tom.feature()    // 'animal'
```
这个例子中有创建了两个构造函数，Animal构造函数有一个type属性和feature方法。Cat构造函数有两个属性：name和color。实例化了一个Animal对象，并且挂载到了Cat函数的原型上，相当于重写了Cat的原型，所以Cat函数拥有Animal函数的所有属性和方法。
然后又Cat函数new出一个tom对象，tom对象拥有Cat函数的属性和方法，因此也拥有Animal的属性和方法。
通过上面的例子，可以总结：__通过改变构造函数的原型，进而实现继承。__
ps:
1. 如果在继承原型对象之前，产生的实例，其内部指针还是指向最初的原型对象。
    ```javascript
    function Animal(){
        this.type = 'animal';
    }
    Animal.prototype.feature = function(){
        alert(this.type);
    }
    function Cat(name,color){
        this.name = name;
        this.color = color;
    }
    Cat.prototype.type = 'cat';
    Cat.prototype.feature = function(){
        alert(this.type);
    }    
    var tom = new Cat('tom','blue');
    Cat.prototype = new Animal();// 先实例化对象，再重写原型,结果指针还是指向最初的原型
    console.log(tom.name);  // 'tom'
    console.log(tom.color); // 'blue'
    console.log(tom.type);  // 'cat'  ----- 是最初的type
    tom.feature()    // 'cat'
    ```
从打印结果来看：new出来的tom对象，在Cat.prototype重写原型之后，依然还是指向没重写的原型上。

2. 在通过原型链实现继承时，不能使用对象字面量创建原型方法。因为这样做就会重写原型链。
    ```javascript
    function Animal(){
        this.type = 'animal';
        this.size = 'small'
    }
    Animal.prototype.feature = function(){
        alert(this.type);
    }
    function Cat(name,color){
        this.name = name;
        this.color = color;
    }  
    Cat.prototype = new Animal();
    // 使用字面量添加新方法，会导致上一行代码无效
    Cat.prototype = {
        type:'cat',
        feature:function(){
            alert(this.type)
        }
    }
    var tom = new Cat('tom','blue');
    console.log(tom.name);  // 'tom'
    console.log(tom.color); // 'blue'
    console.log(tom.type);  // 'cat'
    tom.feature()    // 'cat'  
    console.log(tom.size)  // undefined   ----- tom拿不到size属性
    ```
由打印结果可知：tom这个对象拿不到将继承的size属性，所以用字面量添加属性或方法，会切断将继承的与实例之间的联系。

原型链继承并不是完美的，用原型链实现继承，有一定的问题存在。
1. 首先 值类型与引用类型在参数传递时，方式是不一样的
    * 值类型 将值本身拷贝一份赋值给其他变量，若该值发生变化，也不会影响到其他变量。
    * 引用类型 将指针（内存中的地址）拷贝一份 赋值给其他变量；若内存中的地址内容发生改变，其他变量内的内容也会发生变化。
    ```javascript
    var a = 11;
    var b = a;

    console.log(a,b) // 11 11
    b = 22;
    console.log(a,b) // 11 22

    var obj ={
        name:'peter',
        age:18
    };
    var m = obj;
    console.log(m) // {name: "peter", age: 18}
    m.name = 'tom';
    m.age = 22;
    console.log(obj) // {name: "tom", age: 22}
    ```
    同样的道理，在原型链继承中，包含引用类型值的原型属性会被所有实例共享，如果某一个实例更改了属性或方法，会影响到原型属性，进而影响所有的实例。
    ```javascript
    function Animal(){
        this.type = 'animal';
        this.size = ['large','small'];
    }
    Animal.prototype.feature = function(){
        alert(this.type);
    }
    function Cat(name,color){
        this.name = name;
        this.color = color;
    }  
    Cat.prototype = new Animal();

    var tom = new Cat('tom','blue');
    var peter = new Cat('peter','yellow')
    console.log(tom.size);  // ["large", "small"]
    tom.size.push('middle');
    console.log(tom.size);  // ["large", "small", "middle"]
    console.log(peter.size);  // ["large", "small", "middle"]
    ```
    通过打印结果可知，在一个实例添加一个size时，同时也影响了其他实例。

2.在高程上说还有个问题，在创建子类型（Cat）的实例时，不能向超类型（Animal）的构造函数中传递参数。意思就是 __没有办法在不影响所有对象实例的情况下，给超类型（Animal）的构造函数传递参数__
```javascript
function Animal(type){
    this.type = type;
    this.size = ['large','small'];
}
Animal.prototype.feature = function(){
    alert(this.type);
}
function Cat(type,name,color){
    this.name = name;
    this.color = color;
}  
Cat.prototype = new Animal();

var tom = new Cat('animal','tom','blue');
console.log(tom.type); // undefined
```
当给被继承的构造函数传参数时，发现为undefined，所以原型链继承无法传参数。
因此原型链继承有这两个问题，所以 __在实践中很少使用原型链继承。__

##### __借用构造函数继承__
借用构造函数继承的基本思想：就是在子类型构造函数的内部使用 apply() 和 call() 方法调用超类型构造函数里的属性或方法。
ps： __函数只不过是在特定环境中执行代码的对象，因此通过使用 apply() 和 call() 方法也可以在（将来）新创建的对象上执行构造函数。__
```javascript
function Animal(name){
    this.name = name;
    this.size = ["large", "small"];
}
Animal.prototype.say = function(){
    alert(this.name);
}
function Cat(name,age){
    Animal.call(this,name);
    this.age = age;

}
var tom = new Cat('tom',18);
var peter = new Cat('peter',22);
console.log(tom); // {name: "tom", size: Array[2], age: 18};
console.log(peter); // {name: "peter", size: Array[2], age: 22};

tom.size.push('middle');
console.log(tom.size);  // ["large", "small", "middle"]
console.log(peter.size); // ["large", "small"]

tom.say();  // Uncaught TypeError: tom.say is not a function
```
由上述打印的结果，我们可以得出以下结论：
1. 可以往超类型（Animal）传参数，Animal可以接受一个参数，将参数赋值给一个属性，所以在Cat构造函数内部调用Animal时，就是给Cat的实例设置该属性。
ps：为了确保Animal 构造函数不会重写Cat的属性，可以在调用超类型构造函数后，再添加应该在子类型中。
```javascript
function Cat(name,age){
    Animal.call(this,name);
    this.age=age;
    this.name = 'jerry'; // 如果该属性写在Animal.call(this,name);之前的话，没有作用，还是被调用的给覆盖了
}
```
2. 因为是子类型调用超类型，所以每个子类型调用的都是超类型的初始化的属性或内部方法。每个实例都互不影响。
3. 超类型的原型上的方法对子类型不可见，不可被调用。
借用构造函数继承最主要的就是子类型利用call或apply调用超类型的方式去使用该方法或属性。但是很显然也有缺点：
1. 由于每个子类型声明自己属性或方法，而且别人不能使用，所以不能复用。
2. 无法调用超类型的原型上的方法。

##### __组合继承__
组合继承是采用了原型链继承和借用构造函数继承的方式。
其基本思想就是： __原型链继承实现对原型属性和方法的继承，借用构造函数继承实现对实例属性的继承。__
```javascript
function Animal(name){
    this.name = name;
    this.size = ["large", "small"];
}
Animal.prototype.say = function(){
    alert(this.name);
}
function Cat(name,age){
    Animal.call(this,name); // 调用Animal的属性
    this.age = age;

}
Cat.prototype = new Animal(name); // 调用Ainaml的原型上的方法。
Cat.prototype.constructor = Cat;  // 保证Cat的原型上的构造器对象还是指向Cat。
Cat.prototype.skill = function(){
    alert('running');
}
var tom = new Cat('tom',18);
var peter = new Cat('peter',22);
console.log(tom); // {name: "tom", size: Array[2], age: 18};
console.log(peter); // {name: "peter", size: Array[2], age: 22};

tom.size.push('middle');
console.log(tom.size);  // ["large", "small", "middle"]
console.log(peter.size); // ["large", "small"]

tom.say(); // tom
peter.say(); // peter
```
上面的例子：在Cat构造函数里使用call调用Animal里属性，并且在Cat的原型上实例化Animal，进而调用Animal原型上的方法。
ps:子类型扩展方法时要放在原型链继承之后，因为原型链继承后，重写了其constructor属性，导致没继承前的属性或方法失效。
```javascript
Cat.prototype = new Animal(name); // 调用Ainaml的原型上的方法。
Cat.prototype.constructor = Cat;  // 保证Cat的原型上的构造器对象还是指向Cat。
Cat.prototype.skill = function(){   // 该一步要放在调用Animal原型方法之后，如果放在前面，会导致其skill方法失效。
    alert('running');
}
```
这样融合两者的优点，摒弃了缺点。成为最常用的继承方式。但是也有一个不足：无论什么情况下都会调用两次超类型构造函数：1 在创建子类型原型的时候，2 在子类型构造函数内部。

##### __原型式继承__
原型式继承是道格拉斯.克罗克福德提出的继承方式，其基本思想是： __借助原型可以基于已有的对象创建新对象，同时不必因此创建自定义类型。__ 主要函数如下：
```javascript
function object(o){
    function F(){};
    F.prototype = o;
    return new F();
}
```
这个函数主要是在内部创建了一个构造函数，该构造函数的原型就是传来的对象（继承），并且返回这个构造函数的实例。
这种方式的 __要求__ 是必须有一个对象，作为另一个对象的基础，通过对象的浅拷贝的方式，创建这个对象的副本作为新对象使用，在该基础上进行修改。
```javascript
var peter = {
    name:'peter',
    age:18,
    say:function(){
        alert(this.name);
    }
}
var tom = object(peter);
console.log(tom);  // F {}
tom.say();  // peter

tom.name = 'tom';
tom.age = 22;
console.log(tom);  // F {name: "tom", age: 22}
tom.say();  // tom
```
由上述结果可知，新创建的对象，返回的是对象，但是打印tom.say()，出现的是peter，说明新对象调用了原型上的属性和方法。随后在修改后新对象的属性时，会返回新的属性和方法。
但是显然易见：此模式就是新对象是利用原要继承的对象挂载到原型上的原理，去使用原型上的属性和方法，然后修改其属性和方法。同样如果不修改属性值，会被所有实例共享。
主要适用于：在没必要兴师动众的创建构造函数，而只想让一个对象与另一个对象保持类似的情况下，可以使用原型式继承。
在es5出来一个新方法，可以替代克罗克福德创建的函数: __Object.create()__，前提条件只传一个参数情况下。
```javascript
var tom = Object.create(peter);
console.log(tom);  // F {}
tom.say();  // peter

tom.name = 'tom';
tom.age = 22;
console.log(tom);  // F {name: "tom", age: 22}
tom.say();  // tom
```
tip: __Object.create()__
接受两个参数：
1. 必需。 要用作原型的对象。可以为 null。
2. 可选。 包含一个或多个属性描述符的 JavaScript 对象。“数据属性”是可获取且可设置值的属性。数据属性描述符包含 value 特性，以及 writable、enumerable 和 configurable 特性。如果未指定最后三个特性，则它们默认为 false。
* 返回值：一个具有指定的内部原型且包含指定的属性（如果有的话）的新对象。

##### __寄生式继承__
寄生式继承也是克罗克福德提出的，并在原型式继承上进行推广的。其基本思想就是： __即创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象，最后返回这个对象。__
该继承方式最大的特点就是 __封装成一个函数，在内部扩展对象的属性或方法。__
```javascript
function inherit(o){
    var clone = Object.create(o);  // 通过调用函数创建一个对象
    clone.type = 'people';    // 扩展对象属性或方法
    clone.say=function(){
        alert(this.name);
    }
    return clone;
}
var peter = {
    name:'peter'
}
var perterSon = inherit(peter);
console.log(perterSon.type);    // people
perterSon.say();  // peter
```
inherit函数中返回一个新创建的对象，这个对象有扩展的方法和属性，另一个对象在调用这个方法时会继承扩展属性和方法。
由此可见，扩展方法已经写死了，所以不能不复用，进而降低效率。
使用情况： __在主要考虑对象而不是自定义类型和构造函数的情况下，可以采用寄生式继承。__

##### __寄生组合式继承__
在组合继承的方式中，有一个不足，就是多次调用超类型构造函数，为了避免这个情况，寄生组合式继承就出现了。
其基本思路是： __通过借用构造函数来继承属性，用原型链的混成形式来继承方法。不必为了指定子类型的原型而调用超类型的构造函数。__
最简单的说法：__使用寄生式继承来继承超类型的原型，然后将结果指定给子类型的原型。__
```javascript
function inheritPrototype(sub,supers){
    var clone = Object.create(supers.prototype);
    clone.constructor = sub;
    sub.prototype = clone;
}
```
这个函数实现了三个步骤：（先传两个参数，一个子类型构造函数sub，一个超类型构造函数supers。）
1. 创建超类型原型的一个副本。
2. 为创建的副本添加constructor属性，从而弥补重写原型而失去的默认的constructor属性。
3. 将新创建的对象（副本）赋值给子类型的原型。
```javascript
function Animal(name){
    this.name = name;
    this.size = ["large", "small"];
}
Animal.prototype.say = function(){
    alert(this.name);
}
function Cat(name,age){
    Animal.call(this,name); 
    this.age = age;

}
inheritPrototype(Cat,Animal);
Cat.prototype.skill = function(){
    alert('running')
}
var tom = new Cat('tom',18);
console.log(tom); // Cat {name: "tom", size: Array(2), age: 18}
tom.say();   // tom
tom.skill();  // running
```
由上述可以得知：也能实现组合继承所实现的方案，只不过只调用了一次超类型构造函数，提高了效率，同时原型链也能保持不变，能够使用instanceof和isPrototypeOf()方法,组合继承也是一样的。
```javascript
console.log(tom instanceof Cat) // true;
console.log(tom instanceof Animal) // true
```

tip：
1. instanceof
该运算符用来检测 constructor.prototype 是否存在于参数 object 的原型链上。返回值是一个Boolean。
```javascript
obj instanceof Object // 实例obj在不在Object构造函数中
```
2. isPrototypeOf()
该函数用于指示对象是否存在于另一个对象的原型链中。如果存在，返回true，否则返回false。
该方法属于Object对象，由于所有的对象都"继承"了Object的对象实例，因此几乎所有的实例对象都可以使用该方法。

#### 参考资料
Javascript高级程序设计（第三版）