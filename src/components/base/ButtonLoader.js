import React from 'react'
import { Button, Spinner } from 'react-bootstrap'

export default function ButtonLoader({ loading, children, ...props }) {
  return (
    <Button disabled={loading} {...props}>
      {loading ? (
        <>
          <Spinner
            as="span"
            animation="border"
            role="status"
            aria-hidden="true"
          />
          <span className="sr-only">Loading...</span>
        </>
      ) : (
        children
      )}
    </Button>
  )
}
