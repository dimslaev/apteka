import React from 'react'
import Icon from './Icon'

export default function Warning({
  show = true,
  children,
  className,
  ...props
}) {
  function getClassName() {
    let defaultClassName = 'warning'
    if (className) defaultClassName += ' ' + className
    if (!show) defaultClassName += ' d-none'
    return defaultClassName
  }
  return (
    <div className={getClassName()}>
      <Icon type="warning" color="#666" />
      <span className="font-16-regular text">{children}</span>
    </div>
  )
}
