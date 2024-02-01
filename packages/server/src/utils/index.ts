interface Errors {
  code: string
  message: string
  path: string[] | string
}

interface ExportedError {
  code: string
  message: string
  path: string[]
}

export function createErrors(errors: Errors[]) {
  const exportedErrors: ExportedError[] = []

  errors.forEach((error) => {
    exportedErrors.push({
      code: error.code,
      message: error.message,
      path: typeof error.path === 'string' ? [error.path] : error.path,
    })
  })

  return {
    error: {
      issues: exportedErrors,
    },
  }
}
