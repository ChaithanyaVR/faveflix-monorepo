declare module 'tailwindcss' {
    export interface Config {
      theme?: Record<string, any>
      plugins?: any[]
      content?: string[] | { files: string[]; extract?: any }
      darkMode?: 'media' | 'class' | false
      prefix?: string
      corePlugins?: Record<string, boolean>
      important?: boolean | string
      separator?: string
      safelist?: string[]
    }
  }
  