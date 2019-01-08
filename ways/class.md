    前段时间复习了面向对象这一部分，其中提到在es6之前，Javasript是没有类的概念的，只从es6之后出现了类的概念和继承。于是乎，花时间学习一下class。
#### 简介

JavaScript 语言中，生成实例对象的传统方法是通过构造函数来创建的。
```javascript
function Person (name,age){
    this.name = name;
    this.age = age;
}
Person.prototype.say=function(){  // 不能使用箭头函数（我差点忘记）,因为 箭头函数没有prototype属性
    alert(this.name);
}
var peter = new Person('peter',25);
```
es6提出了一个关键字class，把上述例子中简化成了传统的面向对象语言java，c++等创建类的形式。 ps：Javascript 的保留关键字不可以用作变量、标签或者函数名。有些保留关键字是作为 Javascript 以后扩展使用。
##### class定义类简单方式：
```javascript
class Person{
    constructor(name,age){
        this.name = name;
        this.age = age;
    }
    say(){
        alert(this.name)
    }
}
var peter = new Person('peter',25);
```
    这几步骤中：
    1 Person 这是类名，对应就是es5中构造函数名。
    2 里面创建的都是方法。
    3 其中有constructor方法，就叫构造方法，this关键字则代表实例对象，这个方法对应的就是es5的构造函数。
    4 还有个除了constructor方法的其他方法，say方法，对应的就是es5中挂载到其构造函数的prototype属性上的方法。

`ps：1 定义“类”的方法的时候，前面不需要加上function这个关键字，直接把函数定义放进去就行，否则报错。
    2 方法之间不需要逗号分隔，加了会报错。
    3 class定义类名，虽然是对象形式，但不是对象，而是函数。`
```javascript
typeof Person  // "function"
Person.prototype.constructor == Person   // true
```
这说明了类的数据类型就是函数，类本身就指向构造函数。
    类和普通的构造函数的区别：
        类的调用必须用new来实例化。
        类的内部所有定义的方法是不可枚举的。
        类的内部已经采用的是严格模式。
        类的内部不存在变量提升。

##### class表达式

与函数一样，类也可以使用表达式的形式定义。
```javascript
    const Person = class {
        constructor(){}
    }
```
也可以用这样的方式定义。
```javascript
    const MyClass = class Me {
        getClassName() {
            return Me.name;
        }
    };
```
需要注意的是，这个类的名字是`MyClass`而不是Me，Me只在 Class 的内部代码可用，指代当前类。
```javascript
    let inst = new MyClass();
    inst.getClassName() // 'Me'
    console.log(Me.name)  // Uncaught ReferenceError: Me is not defined
```
    tip:
        name 属性
        由于本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被Class继承，包括name属性,name属性总是返回紧跟在class关键字后面的类名。
        class Point {}
        Point.name // "Point"

##### constuctor方法：

每个类中都有默认的construtor方法，通过new命令生成对象实例时，自动调用该方法。即使没有显式定义constructor方法，也会有默认的construtor方法。 constructor方法默认返回实例对象（即this）,也可以指定返回另外一个对象。
```javascript
class Person{
    constructor(name,age){
        this.name = name;
        this.age = age
    }
}
var peter = new Person('peter',25);
peter instanceof Person   // true;
class Person{
    constructor(){
        var child = {
            name:'jerry',
            age:10
        }
        return child
    }
}
var peter = new Person();
peter instanceof Person   // false;
```
上面两个例子说明了，在没有指定返回的对象情况下，默认返回实例对象，有指定返回的对象，则返回该对象，但返回的对象就不是类的实例了。
另外：实例属性的新写法： // `error`
实例属性除了在constructor()方法里面定义，也可以直接写在类的最顶层。
```javascript
class Person{
    name = 'peter';
    say(name){
        console.log(name)
    }
}
```

##### 类的实例对象：

同es5的构造函数的实例一样：`实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）`。 大白话就是：实例的属性如果没有显式定义到constructor上，那么就是定义在除了constructor以外的方法中。
```javascript
class Person{
    constructor(name,age){
        this.name = name;
        this.age = age;
        this.skill = function(){
            alert('running')
        }
    }
    say(){
        alert(this.name)
    }
}
var peter = new Person('peter',25);
console.log(peter.hasOwnProperty('name'));   // true
console.log(peter.hasOwnProperty('age'));    // true
console.log(peter.hasOwnProperty('skill'));  // true
console.log(peter.hasOwnProperty('say'));    // false
console.log(peter.__proto__.hasOwnProperty('say'))  // true
```
从上述可知：凡是在constructor方法里的属性都是实例对象中的都返回为true，不在constructor方法里的都是类的原型上的属性。
    tip：
    object.hasOwnProperty(proName) 确定某个对象是否具有带指定名称的属性。
    参数解释：
        object
            必需。对象的实例。
        proName
            必需。一个属性名称的字符串值。（是个字符串!）
    说明：
        如果 object 具有带指定名称的属性，则 hasOwnProperty 方法返回 true，否则返回 false。
        此方法不会检查对象原型链中的属性；该属性必须是对象本身的一个成员。
`同es5一样，类的所有实例共享一个原型对象`。
```javascript
var peter = new Person('peter',25);
var tom = new Person('tom',18);
console.log(tom.__proto__ == peter.__proto__)  // true
```
这说明了，peter，tom都是一个类的实例化对象，共享这一个类的所有属性和方法。
根据原型共享，如果在一个实例对象上更改原型上的值，会直接影响到其他实例，所以一般不建议使用这种方式更改原型的值。
```javascript
tom.\__proto\__.skill = function(){
    alert('running');
}
tom.skill();  // running
peter.skill();  // running
```
因此最好不要通过实例去更改类的值。

##### this的指向 （不懂）

类的方法内部如果含有this，它默认指向类的实例，如果单独提取该方法调用this会报错
```javascript
class Print{
    printName(name){
        this.print(name);
    }
    print(text){
        alert(text);
    }
}
var hello = new Print();
var {printName} = hello;    //对象的解构,printName == hello.printName,为何找不到this的指向？
printName('peter');  // Cannot read property 'print' of undefined
```
解决办法： 
1 在constructor方法中绑定this。
  constructor(){
      this.printName = this.printName.bind(this);
  }
2 使用箭头函数。
  printName(name)=>{this.print(name)};
3 使用proxy（待学习）

##### 私有属性和私有方法

`所谓的私有方法和私有属性，只能在类中供其他方法使用`。 有两种方式可以声明私有方法和私有属性
 1 将要调用的方法放到类的外部，在类的内部，通过call，apply进行调用。
 ```javascript
class Print{
    printName(name){
        print.call(this,name);
    }
}
function print(text){alert(text)}
var hello = new Print();
hello.printName('peter');  // peter
```
这种方式是把私有方法放到外部，不能被调用，这意思是说的在类的内部是访问不到print方法的。 
 2 使用sybmol类型。
```javascript
var print = Symbol('print');
class Print{
    printName(name){
        this[print](name);
    }
    [print] (text){
        alert(text);
    }
}
var hello = new Print();
hello.printName('peter');  // peter
```
symbol类型保证了是独一无二的，导致第三方获取不到,达到了私有的效果。

##### class的取值函数和存值函数

与 ES5 一样，在“类”的内部可以使用get和set关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。
```javascript
class Person{
    constructor(){

    }
    get height(){
        return this._height
    }
    set height(value){
        this._height = value
    }
}
var peter = new Person();
peter.height = 12344;  // 设置身高
console.log(perter.height)   // 12344
```
当一个属性只有get没有set的时候，我们是无法进行赋值操作的,第一次初始化也不行。 如果把变量定义为私有的(定义在类的外面),就可以只使用get不使用set。

##### Class 的 Generator

在类的某个方法的前面加上星号，可以代表这是个generator函数。可以用generator的方式去运用这个方法。
```javascript
class Person{
    *sum(x,y,z){
        yield x + y;
        yield y + z;
        yield x + y +z;
    }
}
var a = new Person();
for(let i of a.sum(1,2,3)){
    console.log(i);
} // 3  5  6
```

##### class的静态方法

类相当于实例的原型，所有在类中定义的方法，都会被实例继承。 如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
```javascript
class Person{
    static print(text){
        alert(text);
    }
    printName(name){
        this.print(name);
    }
}
Person.print('peter')   // peter
var peter = new Person();
peter.print('peter');   //  peter.print is not a function
```
上面的代码表示：可以直接在Person类上调用（Person.print('peter')），而不是在Person类的实例上调用。如果在实例上调用静态方法，会抛出一个错误，表示不存在该方法。
    如果静态方法包含this关键字，这个this指的是类，而不是实例。
    静态方法可以与非静态方法重名。(就是static的方法是一个，非static的方法是一个，两者无关联)。
    父类的静态方法，可以被子类继承。
##### new.target属性

new是从构造函数生成实例对象的命令 ES6 为new命令引入了一个new.target属性，该属性一般用在构造函数之中，返回new命令作用于的那个构造函数。如果构造函数不是通过new命令调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。
```javascript
function Person(name) {
  if (new.target === Person) {
    this.name = name;
  } else {
    throw new Error('必须使用 new 命令生成实例');
  }
}
var peter = new Person('peter');
var notAPerson = Person.call(peter, 'peter');  // 报错 必须使用 new 命令生成实例
```
Class 内部调用new.target，返回当前 Class。
子类继承父类时，new.target会返回子类。
用处：可以写出不能独立使用、必须继承后才能使用的类。





#### 继承
在es5时，对象的继承有好几种，原型链继承，借用构造函数继承，组合继承，原型式继承，寄生式继承以及寄生组合式继承，都是按照函数的形式去集成的，现在class也有它的继承方式，简化了操作。

##### extends
关键字extends，直接通过这一个关键字就可以实现继承。

```javascript
class Person{}
class Child extends Person{}
```

上面代码定义了一个Child类，该类通过extends关键字，继承了Person类的所有属性和方法，所以Child就直接复制了一份Person类。简单的开场方式，是不是比es5的继承方式简单多了，哈。。

##### super关键字
在子类中调用super()，说明是表示父类的构造函数，用来新建父类的this对象。

```javascript
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    say(name) {
        console.log(`${name} is saying`)
    }
}
class Child extends Person {
    constructor(name, age, color) {
        super(name, age);
        this.color = color
    }
    jump(name) {
        console.log(`${this.name} is jumping`)
    }
}
var peter = new Child('peter',18,'red');
console.log(peter); // Child {name: "peter", age: 18, color: "red"}
peter.jump()  // peter is jumping
```

    子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工，加上子类自己的实例属性和方法。如果不调用super方法，子类就得不到this对象。

```javascript
class Person{}
class Child extends Person{
    constructor(){}
}
var peter = new Child() // Uncaught ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
```
上面代码中，Child继承了父类Person，但是它的构造函数没有调用super方法，导致新建实例时报错。所以说super()是在继承中重要的一环。
另外,`如果子类中没有显示constructor，即使不加super，也不会报错，因为class中会默认有constructor，同样的道理，也会有super()`

```javascript
class Child extends Child {}
// 等同于
class Child extends Child {
  constructor(...args) {
    super(...args);
  }
}
```
    ps： ES5的继承和ES6的继承的区别：
    ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。
    ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。

另一个需要注意的地方是，`在子类的构造函数中，只有调用super之后，才可以使用this关键字，否则会报错。这是因为子类实例的构建，基于父类实例，只有super方法才能调用父类实例。`

```javascript
class Perosn {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class Child extends Person {
  constructor(name, age, color) {
    this.color = color; // ReferenceError:Person is not defined
    super(name, age);
    this.color = color; // 正确
  }
}
```

super这个关键字，既可以当作函数使用，也可以当作对象使用。在这`两种情况`下，它的用法完全不同。
* 第一种情况，super作为函数调用时，代表父类的构造函数，类似于super()。
    1. ES6 要求，子类的构造函数必须执行一次super函数。

    ```javascript
    class A {
        constructor() {
            console.log(new.target.name);
        }
    }
    class B extends A {
        constructor() {
            super();
        }
    }
    new A() // A
    new B() // B
    ```

    `super虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指的是B，因此super()在这里相当于A.prototype.constructor.call(this)。继承了A的this为B所用。`
        上面代码中，new.target指向当前正在执行的函数。可以看到，在super()执行时，它指向的是子类B的构造函数，而不是父类A的构造函数。也就是说，super()内部的this指向的是B。因此super()在这里相当于A.prototype.constructor.call(this)。
    2. super()只能用在子类的构造函数constructor之中，用在其他地方就会报错。

    ```javascript
    class Person {}
    class Child extends Person {
        jump() {
            super(); // error
        }
    }
    ```

    上面的例子，在Child子类中的constructor之外的方法中用了super()，会报错，因为super函数只能用在构造函数constructor中。

* 第二种情况，super作为对象时，
    * 在普通方法中，指向父类的原型对象

    ```javascript
    class Person {
        constructor(name,age) {
            this.name = name;
            this.age = age;
        }
        say(){
            console.log(this.age)
        }
        p(){
            return 2
        }
    }
    class Child extends Person {
        constructor(name,age, color) {
            super(name,age);   //该super代表的是用函数的形式
            this.age = 25;
            this.color = color; 
            console.log(super)//使用super的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。如果只写super，没法判断是对象还是方法
            console.log(super.p());
        }
        say1(){
            super.say()
        }
    }
    var peter = new Child('peter',18,'red')
    peter.p()  // 2
    peter.say1()   // 25
    ```

    1. 子类Child当中的super.p()，就是将super当作一个对象使用。这时，super在普通方法之中，指向Person.prototype，所以super.p()就相当于Person.prototype.p()。`super.p() == Person.prototype.p()` 如上
    2. 在子类普通方法中通过super调用父类的方法时，`方法内部的this指向当前的子类实例`。super.say()虽然调用的是Person.prototype.say()，但是Person.prototype.say()内部的this指向子类Child的实例，导致输出的是25，而不是2。也就是说，实际上执行的是`super.say.call(this)`。如上
    `由于this指向子类实例，所以如果通过super对某个属性赋值，这时super就是this，赋值的属性会变成子类实例的属性。`

    ```javascript
    class A {
        constructor() {
            this.x = 1;
        }
    }
    class B extends A {
        constructor() {
            super();
            this.x = 2;
            super.x = 3;
            console.log(super.x); // undefined
            console.log(this.x); // 3
        }
    }

    let b = new B();
    ```

    super.x赋值为3，这时等同于对this.x赋值为3。而当读取super.x的时候，读的是A.prototype.x，所以返回undefined。
    大白话：就是A.prototype中没有x，从A类的中看到，只有构造函数constructor，没有其他方法了。
    3. 由于super指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过super调用的。如下：

    ```javascript
    class A {
        constructor() {
            this.p = 2;
        }
    }
    A.prototype.q = 4
    class B extends A {
        m() {
            return super.p;
        }
        n(){
            return super.q
        }
    }
    let b = new B();
    b.m() // undefined
    b.q // 4
    ```

    p是父类A实例的属性，但super.p就引用不到它。属性q是定义在A.prototype上面的，所以super.q可以取到它的值。
    * super用在静态方法之中，这时super将指向父类。在普通方法之中指向父类的原型对象。**********

    ```javascript
    class Parent {
        static myMethod(msg) {
            console.log('static', msg);
        }
        myMethod(msg) {
            console.log('instance', msg);
        }
    }
    class Child extends Parent {
        static myMethod(msg) {
            super.myMethod(msg);
        }
        myMethod(msg) {
            super.myMethod(msg);
        }
    }
    Child.myMethod(1); // static 1
    var child = new Child();
    child.myMethod(2); // instance 2
    ```

    在子类的静态方法中通过super调用父类的方法时，方法内部的this指向当前的子类，而不是子类的实例。

##### Object.getPrototypeOf()
用来判断一个类是否继承了另一个类。

```javascript
class A {
  static hello() {
    console.log('hello world');
  }
}
class B extends A {
    constructor(color){
        super();
        this.color = color
    }
}
var red = new B('red');
red instanceof B  // true
red instanceod A  // true
Object.getPrototypeOf(B) === A  // true
B.hello()  // hello world
```

由上面的例子可知：red既是A的实例又是B的实例，通过Object.getPrototypeOf(B)判断了是继承A的，同样的`静态方法也可以继承的`

##### 类的 prototype 属性和__proto__属性
大多数浏览器的 ES5 实现之中，每一个对象都有__proto__属性，指向对应的构造函数的prototype属性。Class作为构造函数的语法糖，同时有prototype属性和__proto__属性，因此同时存在两条继承链。
* 子类的__proto__属性，表示构造函数的继承，总是指向父类。
* 子类prototype属性的__proto__属性，表示方法的继承，总是指向父类的prototype属性。

```javascript
class A {}
class B extends A {}
B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

原因如下：

```javascript
Object.setPrototypeOf = function (obj, proto) {
  obj.__proto__ = proto;
  return obj;
}
class A {}
class B {}
// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype);
// 等同于
B.prototype.__proto__ = A.prototype;
// B 继承 A 的静态属性
Object.setPrototypeOf(B, A);
// 等同于
B.__proto__ = A;
```

这两条继承链，可以这样理解：作为一个对象，子类（B）的原型（__proto__属性）是父类（A）；作为一个构造函数，子类（B）的原型对象（prototype属性）是父类的原型对象（prototype属性）的实例。
另外还有两种情况：
1. 子类继承Object类。

```javascript
class A extends Object {}
A.__proto__ === Object // true
A.prototype.__proto__ === Object.prototype // true
```

2. 不存在任何继承。

```javascript
class A {}
A.__proto__ === Function.prototype // true
A.prototype.__proto__ === Object.prototype // true
```

A作为一个基类（即不存在任何继承），就是一个普通函数，所以直接继承Function.prototype。但是，A调用后返回一个空对象（即Object实例），所以A.prototype.__proto__指向构造函数（Object）的prototype属性。

###### 实例的 __proto__ 属性
子类实例的__proto__属性的__proto__属性，指向父类实例的__proto__属性。也就是说，`子类实例的原型的原型，是父类的原型`。

```javascript
class Point{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    printName(){
        console.log('hahahah')
    }
}
class ColorPoint extends Point{
    constructor(x,y,color){
        super(x,y);
        this.color = color
    }
    printName(){
        super.printName()
    }
}
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true
p2.__proto__.__proto__.printName = function () {
  console.log('Ha');
};
p1.printName() // "Ha"
```

由例子可知：
* ColorPoint继承了Point，导致前者原型的原型是后者的原型。
* 在ColorPoint的实例p2上向Point类添加方法，结果影响到了Point的实例p1。

##### 原生构造函数的继承
原生构造函数是指语言内置的构造函数，通常用来生成数据结构。ECMAScript 的原生构造函数大致有下面这些。

* Boolean()
* Number()
* String()
* Array()
* Date()
* Function()
* RegExp()
* Error()
* Object()

    ES5 是先新建子类的实例对象this，再将父类的属性添加到子类上，由于父类的内部属性无法获取，导致无法继承原生的构造函数。比如，Array构造函数有一个内部属性[[DefineOwnProperty]]，用来定义新属性时，更新length属性，这个内部属性无法在子类获取，导致子类的length属性行为不正常。
    ES6 允许继承原生构造函数定义子类，因为 ES6 是先新建父类的实例对象this，然后再用子类的构造函数修饰this，使得父类的所有行为都可以继承。
```javascript
class MyArray extends Array {
  constructor(...args) {
    super(...args);
  }
}

var arr = new MyArray();
arr[0] = 12;
arr.length // 1

arr.length = 0;
arr[0] // undefined
```
上面代码定义了一个MyArray类，继承了Array构造函数，因此就可以从MyArray生成数组的实例。这意味着，ES6 可以自定义原生数据结构（比如Array、String等）的子类，这是 ES5 无法做到的。

上面这个例子也说明，extends关键字不仅可以用来继承类，还可以用来继承原生的构造函数。因此可以在原生数据结构的基础上，定义自己的数据结构。下面就是定义了一个带版本功能的数组。
```javascript
class VersionedArray extends Array {
  constructor() {
    super();
    this.history = [[]];
  }
  commit() {
    this.history.push(this.slice());
  }
  revert() {
    this.splice(0, this.length, ...this.history[this.history.length - 1]);
  }
}

var x = new VersionedArray();

x.push(1);
x.push(2);
x // [1, 2]
x.history // [[]]

x.commit();
x.history // [[], [1, 2]]

x.push(3);
x // [1, 2, 3]
x.history // [[], [1, 2]]

x.revert();
x // [1, 2]
```

##### Mixin 模式的实现
Mixin 指的是多个对象合成一个新的对象，新对象具有各个组成成员的接口。它的最简单实现如下。
```javascript
const a = {
  a: 'a'
};
const b = {
  b: 'b'
};
const c = {...a, ...b}; // {a: 'a', b: 'b'}
```
将多个类的接口“混入”（mix in）另一个类 例子：
```javascript
function mix(...mixins) {
  class Mix {}

  for (let mixin of mixins) {
    copyProperties(Mix.prototype, mixin); // 拷贝实例属性
    copyProperties(Mix.prototype, Reflect.getPrototypeOf(mixin)); // 拷贝原型属性
  }

  return Mix;
}

function copyProperties(target, source) {
  for (let key of Reflect.ownKeys(source)) {
    if ( key !== "constructor"
      && key !== "prototype"
      && key !== "name"
    ) {
      let desc = Object.getOwnPropertyDescriptor(source, key);
      Object.defineProperty(target, key, desc);
    }
  }
}
```
上面代码的mix函数，可以将多个对象合成为一个类。使用的时候，只要继承这个类即可。
```javascript
class DistributedEdit extends mix(Loggable, Serializable) {
  // ...
}
```