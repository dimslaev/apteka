import React from 'react'

export default function FormHelpText({ size = 'default', children }) {
  return (
    <div className={`form-help-text `}>
      <span>{children}</span>
    </div>
  )
}
