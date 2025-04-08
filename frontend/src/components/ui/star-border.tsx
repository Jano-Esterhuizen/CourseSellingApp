import { cn } from "../../lib/utils"
import { ElementType, ComponentPropsWithoutRef } from "react"

interface StarBorderProps<T extends ElementType> {
  as?: T
  color?: string
  speed?: string
  className?: string
  children: React.ReactNode
}

export function StarBorder<T extends ElementType = "button">({
  as,
  className,
  color,
  speed = "6s",
  children,
  ...props
}: StarBorderProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof StarBorderProps<T>>) {
  const Component = as || "button"
  const defaultColor = color || "white"

  return (
    <Component 
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-lg p-[1px]",
        className
      )} 
      {...props}
    >
      <span
        className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] opacity-0 group-hover:opacity-100 transition-opacity bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#333333_50%,#000000_100%)]"
        style={{ animationDuration: speed }}
      />
      <span
        className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl"
      >
        {children}
      </span>
    </Component>
  )
} 