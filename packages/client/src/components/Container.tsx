interface Props {
  children?: React.ReactNode
  className?: string
  mobile?: boolean
}

export default function Container({ children, className, mobile }: Props) {
  return (
    <div
      className={
        className +
        ` px-5 w-full ml-auto mr-auto ${mobile ? 'max-w-md' : 'max-w-[1000px]'}`
      }
    >
      {children}
    </div>
  )
}
