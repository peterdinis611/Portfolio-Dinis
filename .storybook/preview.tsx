import type { Decorator, Preview } from '@storybook/react-vite'
import { SettingsContext } from '../src/context/AppProviders'
import '../src/index.css'
import '../src/styles/notion-shell.css'

const withProviders: Decorator = (Story, context) => {
  const layout = context.parameters.layout
  const bare = layout === 'fullscreen' || context.parameters.bare === true

  return (
    <SettingsContext.Provider>
      {bare ? (
        <div className="bg-background text-foreground">
          <Story />
        </div>
      ) : (
        <div className="min-h-[120px] bg-background p-6 text-foreground">
          <Story />
        </div>
      )}
    </SettingsContext.Provider>
  )
}

const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme as 'light' | 'dark') ?? 'light'
  document.documentElement.dataset.theme = theme
  document.documentElement.classList.toggle('dark', theme === 'dark')
  return <Story />
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'padded',
    options: {
      storySort: {
        order: [
          'Shell',
          'Pages',
          'Notion',
          ['ProductPreview', 'ProjectShowcaseBlocks', 'PageCover', 'ProjectIcon', '*'],
          'UI',
          'Icons',
          'Chrome',
        ],
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Notion light / dark theme',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withTheme, withProviders],
  tags: ['autodocs'],
}

export default preview
