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
es6提出了一个关键字class，把上述例子中简化成了传统的面向对象语言java，c++等创建类的形式。
    ps：Javascript 的保留关键字不可以用作变量、标签或者函数名。有些保留关键字是作为 Javascript 以后扩展使用。
#### class定义类简单方式：
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
    
    ps：1 定义“类”的方法的时候，前面不需要加上function这个关键字，直接把函数定义放进去就行，否则报错。
        2 方法之间不需要逗号分隔，加了会报错。
        3 class定义类名，虽然是对象形式，但不是对象，而是函数。
```javascript
typeof Person  // "function"
Person.prototype.constructor == Person   // true
```
这说明了```类的数据类型就是函数，类本身就指向构造函数```。

    类和普通的构造函数的区别：
        类的调用必须用new来实例化。
        类的内部所有定义的方法是不可枚举的。
        类的内部已经采用的是严格模式。
        类的内部不存在变量提升。

#### class表达式
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
需要注意的是，这个类的名字是MyClass而不是Me，Me只在 Class 的内部代码可用，指代当前类。
```javascript    
    let inst = new MyClass();
    inst.getClassName() // 'Me'
    console.log(Me.name)  // Uncaught ReferenceError: Me is not defined
```
    tip:
        name 属性
        由于本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被Class继承，包括name属性,name属性总是返回紧跟在class关键字后面的类名。
```javascript    
    class Point {}
    Point.name // "Point"
```

#### constuctor方法：
每个类中都有默认的construtor方法，通过new命令生成对象实例时，自动调用该方法。即使没有显式定义constructor方法，也会有默认的construtor方法。
constructor方法默认返回实例对象（即this）,也可以指定返回另外一个对象。
```javascript
class Person{
    constructor(name,age){
        this.name = name;
        this.age = age
    }
}
var peter = new Person('peter',25);
peter instanceof Person   // true;
```
```javascript
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

#### 类的实例对象：
同es5的构造函数的实例一样：实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）。
大白话就是：```实例的属性如果没有显式定义到constructor上，那么就是定义在除了constructor以外的方法中```。
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
从上述可知：```凡是在constructor方法里的属性都是实例对象中的都返回为true，不在constructor方法里的都是类的原型上的属性。```

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

同es5一样，类的所有实例共享一个原型对象。
```javascript
var peter = new Person('peter',25);
var tom = new Person('tom',18);
console.log(tom.__proto__ == peter.__proto__)  // true
```
这说明了，peter，tom都是一个类的实例化对象，共享这一个类的所有属性和方法。

```根据原型共享，如果在一个实例对象上更改原型上的值，会直接影响到其他实例，所以一般不建议使用这种方式更改原型的值。```
```javascript
tom.__proto__.skill = function(){
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
  ```javascript
    constructor(){
        this.printName = this.printName.bind(this);
    }
  ```
  2 使用箭头函数。
  ```javascript
    printName(name)=>{this.print(name)};
  ```
  3 使用proxy（待学习） 


##### 私有属性和私有方法
所谓的私有方法和私有属性，只能在类中供其他方法使用。
有两种方式可以声明私有方法和私有属性
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
这种方式是把私有方法放到外部，不能被调用，这意思是说的```在类的内部是访问不到print方法的。```
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
当一个属性只有get没有set的时候，我们是无法进行赋值操作的,第一次初始化也不行。
如果把变量定义为私有的(定义在类的外面),就可以只使用get不使用set。

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
```类相当于实例的原型，所有在类中定义的方法，都会被实例继承。```
如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是```直接通过类来调用```，这就称为“静态方法”。
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
```
    如果静态方法包含this关键字，这个this指的是类，而不是实例。
    静态方法可以与非静态方法重名。(就是static的方法是一个，非static的方法是一个，两者无关联)。
    父类的静态方法，可以被子类继承。
```

##### new.target属性
```new是从构造函数生成实例对象的命令```
ES6 为new命令引入了一个new.target属性，该属性一般用在构造函数之中，返回new命令作用于的那个构造函数。如果构造函数不是通过new命令调用的，new.target会返回undefined，因此这个属性可以用来确定构造函数是怎么调用的。
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