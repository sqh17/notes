# 简介

通过项目中来记录对react的知识点

#### useRef

useRef 是一个 React Hook，它能让你引用一个不需要渲染的值。
``const ref = useRef(initialValue)``
``ref.current // 获取``

和useState的区别在于

1. useState的值更新会导致渲染一次，数据也会发生变化，这样在异步的时候拿到的数据不一致
2. useRef会更新值，但不会导致组件渲染
    1. 你可以在重新渲染之间 存储信息（不像是普通对象，每次渲染都会重置）。
    2. 改变它 不会触发重新渲染（不像是 state 变量，会触发重新渲染）。
    3. 对于你的组件的每个副本来说，这些信息都是本地的（不像是外面的变量，是共享的）

将useRef返回值看作一个组件内部全局共享变量，它会在渲染内部共享一个相同的值。相对state/props他们是独立于不同次render中的内部作用域值。
同时额外需要注意useRef返回值的改变并不会引起组件重新render，这也是和state/props不同的地方

应用场景：

1. 多次渲染之间的纽带

  ```jsx
  import { useRef } from 'react';

  function DebouncedButton({ onClick, children }) {
    const timeoutRef = useRef(null);
    return (
      <button onClick={() => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          onClick();
        }, 1000);
      }}>
        {children}
      </button>
    );
  }

  export default function Dashboard() {
    return (
      <>
        <DebouncedButton
          onClick={() => alert('宇宙飞船已发射！')}
        >
          发射宇宙飞船
        </DebouncedButton>
        <DebouncedButton
          onClick={() => alert('汤煮好了！')}
        >
          煮点儿汤
        </DebouncedButton>
        <DebouncedButton
          onClick={() => alert('摇篮曲唱完了！')}
        >
          唱首摇篮曲
        </DebouncedButton>
      </>
    )
  }

  ```

如例子可知，像 timeoutID 这样的变量是被所有组件共享的。这就是为什么单击第二个按钮会重置第一个按钮未完成的 timeout 的原因。要解决此问题，你可以把 timeout 保存在 ref 中。每个按钮都有自己的 ref，因此它们不会相互冲突。请注意快速单击两个按钮如何显示两个消息。
2. 获取dom元素（和vue3一样）

#### forwardRef

forwardRef实际上就是当父组件需要得到子组件元素时，可以利用forwardRef来实现。该方法接受一个有额外ref参数的react组件函数，不调用该方法，普通的组件函数是不会获得该参数的。

```jsx
import { forwardRef } from 'react';
const MyInput = forwardRef(function MyInput(props, ref) {
  return (
    <label>
      {props.label}
      <input ref={ref} />
    </label>
  );
});
```

```jsx
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
// 点击该按钮将聚焦输入框。Form 组件定义了一个 ref 并将其传递到 MyInput 组件。MyInput 组件将该 ref 转发至浏览器的 <input> 标签，这使得 Form 组件可以聚焦该 <input>。
```

参数就是render函数，React 会调用该函数并传入父组件传递来的参数和 ref。返回的 JSX 将成为组件的输出。
返回一个可以在 JSX 中渲染的 React 组件。与作为纯函数定义的 React 组件不同，forwardRef 返回的组件还能够接收 ref 属性。

#### useImperativeHandle

React 中的一个自定义 Hook，用于自定义父组件通过 ref 获取子组件实例的公开方法。通过使用useImperativeHandle，我们可以选择性地暴露子组件的特定属性或方法给父组件。
``useImperativeHandle(ref, createHandle, [deps]);``
参数解释：

1. ref 是父组件传递给子组件的 ref。
2. createHandle 是一个在组件渲染过程中调用的函数，用于创建需要暴露给父组件的属性和方法。返回值将会作为子组件的实例值。
3. deps 是一个可选的依赖数组，用于指定在 createHandle 中使用的依赖项。

使用场景：

1. 向父组件暴露子组件的方法：通过在 createHandle 中定义子组件的方法，并将其返回，使得父组件可以通过 ref 调用子组件的方法。

```jsx
// 子组件
import React, { forwardRef, useImperativeHandle } from 'react';

const ChildComponent = forwardRef((props, ref) => {
  const handleClick = () => {
    console.log('Button clicked');
  };

  useImperativeHandle(ref, () => ({
    handleClick // 将子组件的 handleClick 方法暴露给父组件
  }));

  return <button onClick={handleClick}>Click me</button>;
});

// 父组件
import React, { useRef } from 'react';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
  const childRef = useRef();

  const handleButtonClick = () => {
    childRef.current.handleClick(); // 调用子组件的 handleClick 方法
  };

  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={handleButtonClick}>Call child's handleClick</button>
    </div>
  );
};

```

2. 封装原生 DOM 元素的方法：通过在 createHandle 中定义与 DOM 元素相关的方法，例如滚动到指定位置等操作，使得父组件可以直接调用这些方法。

```jsx
// 子组件
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const ChildComponent = forwardRef((props, ref) => {
  const scrollContainerRef = useRef();

  const scrollToTop = () => {
    scrollContainerRef.current.scrollTop = 0; // 滚动到顶部
  };

  useImperativeHandle(ref, () => ({
    scrollToTop // 将滚动方法暴露给父组件
  }));

  return (
    <div ref={scrollContainerRef} style={{ height: '200px', overflowY: 'scroll' }}>
      {/* 子组件内容 */}
    </div>
  );
});

// 父组件
import React, { useRef } from 'react';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
  const childRef = useRef();

  const handleScrollToTop = () => {
    childRef.current.scrollToTop(); // 调用子组件的滚动方法
  };

  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={handleScrollToTop}>Scroll to Top</button>
    </div>
  );
};

```

3. 集成第三方库的方法：如果子组件集成了某个第三方库，并且需要将该库的方法暴露给父组件使用，可以在 createHandle 中调用该库的方法并返回。

```jsx
// 子组件
import React, { forwardRef, useImperativeHandle } from 'react';
import Draggable from 'react-draggable'; // 第三方库

const DraggableComponent = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    resetPosition: () => {
      // 使用第三方库的方法进行重置位置
      // 例如：Draggable.resetPosition();
    }
  }));

  return <Draggable>{/* 子组件内容 */}</Draggable>;
});

// 父组件
import React, { useRef } from 'react';
import DraggableComponent from './DraggableComponent';

const ParentComponent = () => {
  const draggableRef = useRef();

  const handleResetPosition = () => {
    draggableRef.current.resetPosition(); // 调用子组件集成的第三方库方法
  };

  return (
    <div>
      <DraggableComponent ref={draggableRef} />
      <button onClick={handleResetPosition}>Reset Position</button>
    </div>
  );
};

```

4. 控制子组件的动画或转换效果：可以在 createHandle 中定义一些接口，使得父组件可以通过调用这些接口来触发动画或转换效果。

```jsx
// 子组件
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

const AnimatedComponent = forwardRef((props, ref) => {
  const elementRef = useRef();

  const fadeIn = () => {
    elementRef.current.style.opacity = 1; // 渐入动画
  };

  const fadeOut = () => {
    elementRef.current.style.opacity = 0; // 渐出动画
  };

  useImperativeHandle(ref, () => ({
    fadeIn,
    fadeOut
  }));

  return <div ref={elementRef}>{/* 子组件内容 */}</div>;
});

// 父组件
import React, { useRef } from 'react';
import AnimatedComponent from './AnimatedComponent';

const ParentComponent = () => {
  const animatedRef = useRef();

  const handleFadeIn = () => {
    animatedRef.current.fadeIn(); // 调用子组件的渐入动画方法
  };

  const handleFadeOut = () => {
    animatedRef.current.fadeOut(); // 调用子组件的渐出动画方法
  };

  return (
    <div>
      <AnimatedComponent ref={animatedRef} />
      <button onClick={handleFadeIn}>Fade In</button>
      <button onClick={handleFadeOut}>Fade Out</button>
    </div>
  );
};

```

#### useSelector

#### useContext

可以让你读取和订阅组件中的 context，类似于vue的provide和inject？当前组件下所有的子组件以及孙组件都能拿到这个context
和createContext搭配使用,通过cerateContext创建一个context，然后使用ImageSizeContext.Provider包裹组件，传递value值，这样子组件中，再通过useContext(ImageSizeContext)拿到对应vulue值

```jsx
// 声明一个context
import { createContext } from 'react';
export const ImageSizeContext = createContext(500);
```

```jsx
import { ImageSizeContext } from './Context.js';
export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext.Provider
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext.Provider>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

#### Provider

Provider代表将Redux store包裹在应用中，以便整个应用都可以访问到Redux store

```jsx
const store = createStore()
<Provider store={store}>
  <Route path="/" component={PageLayout} />
</Provider>
```
