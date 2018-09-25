前段时间复习了面向对象这一部分，其中提到在es6之前，Javasript是没有类的概念的，只从es6之后出现了类的概念和继承。于是乎，花时间学习一下class。

简介
JavaScript 语言中，生成实例对象的传统方法是通过构造函数来创建的。
function Person (name,age){
    this.name = name;
    this.age = age;
}
Person.prototype.say=function(){  // 不能使用箭头函数（我差点忘记）,因为 箭头函数没有prototype属性
    alert(this.name);
}
var peter = new Person('peter',25);

es6提出了一个关键字class，把上述例子中简化成了传统的面向对象语言java，c++等创建类的形式。
ps：Javascript 的保留关键字不可以用作变量、标签或者函数名。有些保留关键字是作为 Javascript 以后扩展使用。
class定义类简单方式：
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
这几步骤中：
    1 Person 这是类名，对应就是es5中构造函数名。
    2 里面创建的都是方法。
    3 其中有constructor方法，就叫构造方法，this关键字则代表实例对象，这个方法对应的就是es5的构造函数。
    4 还有个除了constructor方法的其他方法，say方法，对应的就是es5中挂载到其构造函数的prototype属性上的方法。
ps：1 定义“类”的方法的时候，前面不需要加上function这个关键字，直接把函数定义放进去就行，否则报错。
    2 方法之间不需要逗号分隔，加了会报错。
    3 class定义类名，虽然是对象形式，但不是对象，而是函数。
typeof Person  // "function"
Person.prototype.constructor == Person   // true
这说明了类的数据类型就是函数，类本身就指向构造函数。

类和普通的构造函数的区别：
    类的调用必须用new来实例化。
    类的内部所有定义的方法是不可枚举的。
    类的内部已经采用的是严格模式。
    类的内部不存在变量提升。

class表达式
    与函数一样，类也可以使用表达式的形式定义。
    const Person = class {
        constructor(){}
    }
    也可以用这样的方式定义。
    const MyClass = class Me {
        getClassName() {
            return Me.name;
        }
    };
    需要注意的是，这个类的名字是MyClass而不是Me，Me只在 Class 的内部代码可用，指代当前类。
    let inst = new MyClass();
    inst.getClassName() // 'Me'
    console.log(Me.name)  // Uncaught ReferenceError: Me is not defined
tip:
    name 属性
    由于本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被Class继承，包括name属性,name属性总是返回紧跟在class关键字后面的类名。
    class Point {}
    Point.name // "Point"

constuctor方法：
    每个类中都有默认的construtor方法，通过new命令生成对象实例时，自动调用该方法。即使没有显式定义constructor方法，也会有默认的construtor方法。
    constructor方法默认返回实例对象（即this）,也可以指定返回另外一个对象。
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

上面两个例子说明了，在没有指定返回的对象情况下，默认返回实例对象，有指定返回的对象，则返回该对象，但返回的对象就不是类的实例了。

类的实例对象：
同es5的构造函数的实例一样：实例的属性除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）。
大白话就是：实例的属性如果没有显式定义到constructor上，那么就是定义在除了constructor以外的方法中。

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

同es5一样，类的所有实例共享一个原型对象。
var peter = new Person('peter',25);
var tom = new Person('tom',18);
console.log(tom.__proto__ == peter.__proto__)  // true
这说明了，peter，tom都是一个类的实例化对象，共享这一个类的所有属性和方法。

根据原型共享，如果在一个实例对象上更改原型上的值，会直接影响到其他实例，所以一般不建议使用这种方式更改原型的值。
tom.__proto__.skill = function(){
    alert('running');
}
tom.skill();  // running
peter.skill();  // running