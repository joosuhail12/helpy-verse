
import * as React from "react"
import { ChartContext } from "./ChartContext"
import { ChartConfig } from "./types"

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
  id: string
  children: React.ReactNode
}

export function ChartContainer({
  config,
  id,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div data-chart={id} className={className} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}
