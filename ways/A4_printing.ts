const A4_HEIGHT = 1123
// 分割视图 传入一个需要分页的元素
export function splitPage(renderCV: HTMLElement) {
  handlerWhiteBoundary(renderCV)
  let page = 0,
    realHeight = 0
  const target = renderCV.clientHeight,
    reRender = document.querySelector('.re-render') as HTMLElement
  reRender.innerHTML = ''

  while (target - realHeight > 0) {
    const wrapper = createDIV(),
      resumeNode = renderCV.cloneNode(true) as HTMLElement
    wrapper.classList.add('jufe-wrapper-page')
    // 创建A4纸里面真正需要渲染的内容 且最小化高度
    const realRenderHeight = Math.min(target - realHeight, A4_HEIGHT)
    const wrapperItem = createDIV()
    wrapperItem.classList.add('jufe-wrapper-page-item')
    wrapperItem.style.height = realRenderHeight + 'px'

    resumeNode.style.position = 'absolute'
    // 计算当前偏移位
    resumeNode.style.top = -page * A4_HEIGHT + 'px'
    resumeNode.style.left = 0 + 'px'

    wrapperItem.appendChild(resumeNode)
    wrapper.appendChild(wrapperItem)

    realHeight += A4_HEIGHT
    page++
    reRender?.appendChild(wrapper) // 将当前生成的 A4 纸添加到容器中
  }
}
// 处理边界内容截断
export function handlerWhiteBoundary(renderCV: HTMLElement) {
// 首先我们获取到当前页面的边距，方便后续新页也保持这个边距大小
  const pt = +getComputedStyle(renderCV).getPropertyValue('padding-top').slice(0, -2)
  const pb = +getComputedStyle(renderCV).getPropertyValue('padding-bottom').slice(0, -2)
  const children = Array.from(renderCV.children) as HTMLElement[]
  // 记录页码 必须为引用 因为该变量涉及参数传递
  const pageSize = { value: 1 }
  for (const child of children) {
    // 子元素的外边距也需要参与计算
    const height = calculateElementHeight(child)
    // 当前元素距离最外层容器的高度 通过actualTop可以判断元素是否处于容器的边界
    const actualTop = getElementTop(child, renderCV)
    // 如果总长度已经超出了一页A4纸的高度（除去底部边距的高度） 那么需要找到边界元素
    if (actualTop + height > A4_HEIGHT * pageSize.value - pb) {
      if (child.children.length) {
        // 有子节点 继续往深度查找 最小化空白元素的高度
        findBoundaryElement(child, renderCV, pt, pb, pageSize)
      } else {
        // 没有子节点 计算空白占位符的高度 插入到边界元素的前面
        renderCV.insertBefore(
          createBoundaryWhiteSpace(A4_HEIGHT * pageSize.value - actualTop + pt),
          child
        )
        // A4 纸页数增加
        ++pageSize.value
      }
    }
  }
  return renderCV
}

// 最小化空白占位符的高度，深度优先查找
function findBoundaryElement(
  node: HTMLElement,
  target: HTMLElement,
  paddingTop: number,
  paddingBottom: number,
  pageSize: { value: number }
) {
  const children = Array.from(node.children) as HTMLElement[]
  for (const child of children) {
    const totalHeight = calculateElementHeight(child)
    const actualTop = getElementTop(child, target)
    if (actualTop + totalHeight > A4_HEIGHT * pageSize.value - paddingBottom) {
      // 直接排除一行段落文字 因为在一段普通文本中没必要再进行深入，它们内嵌不了什么其他元素
      if (child.children.length && !['p', 'li'].includes(child.tagName.toLocaleLowerCase())) {
        findBoundaryElement(child, target, paddingTop, paddingBottom, pageSize)
      } else {
        // 找到了边界 给边界元素前插入空白元素 将内容挤压至下一页
        node.insertBefore(
          createBoundaryWhiteSpace(A4_HEIGHT * pageSize.value - actualTop + paddingTop),
          child
        )
        pageSize.value++
      }
    }
  }
}
// 创建空白占位符
function createBoundaryWhiteSpace(h: number) {
  const whiteSpace = createDIV()
  whiteSpace.setAttribute(WHITE_SPACE, 'true')
  // 创建边界空白占位符 加上顶部边距
  whiteSpace.style.height = h + 'px'
  return whiteSpace
}


// 获取元素高度
function calculateElementHeight(element: HTMLElement) {
  // 获取样式对象
  const styles = getComputedStyle(element)
  // 获取元素的内容高度
  // const contentHeight = element.getBoundingClientRect().height
  const contentHeight = element.clientHeight
  // 获取元素的外边距高度
  const marginHeight =
    +styles.getPropertyValue('margin-top').slice(0, -2) +
    +styles.getPropertyValue('margin-bottom').slice(0, -2)
  // 计算元素的总高度
  const totalHeight = contentHeight + marginHeight
  return totalHeight
}

// 获取元素距离目标元素顶部偏移位
function getElementTop(element: HTMLElement, target: HTMLElement) {
  let actualTop = element.offsetTop
  let current = element.offsetParent as HTMLElement

  while (current !== target) {
    actualTop += current.offsetTop
    current = current.offsetParent as HTMLElement
  }
  return actualTop
}
