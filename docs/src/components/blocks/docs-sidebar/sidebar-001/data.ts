import {
  LuAtom,
  LuBaseline,
  LuBook,
  LuBookOpen,
  LuBraces,
  LuChevronDown,
  LuCode,
  LuCookingPot,
  LuHeading,
  LuImage,
  LuLayoutDashboard,
  LuList,
  LuNewspaper,
  LuPanelRight,
  LuPanelTop,
  LuRecycle,
  LuSlack,
  LuSquareMousePointer,
  LuText,
} from 'react-icons/lu'

export const navigationDropdownOptions = [
  {
    icon: LuBook,
    value: 'docs',
    title: 'Documentation',
    description: 'Get started with Chakra UI',
  },
  {
    icon: LuBookOpen,
    value: 'guides',
    title: 'Guides',
    description: 'Learn how to use Chakra UI',
  },
]

export const externalLinks = [
  { href: '#', label: 'Dashboard', icon: LuLayoutDashboard },
  { href: '#', label: 'Community', icon: LuSlack },
  { href: '#', label: 'Blog', icon: LuNewspaper },
]

export const navigationGroups = [
  {
    id: 'get-started',
    title: 'Get Started',
    icon: LuBook,
    items: [
      { id: 'installation', title: 'Installation', href: '#', isActive: true },
      { id: 'quickstart', title: 'Quickstart', href: '#' },
      { id: 'contributing', title: 'Contributing', href: '#' },
    ],
  },
  {
    id: 'components',
    title: 'Components',
    icon: LuLayoutDashboard,
    items: [
      { id: 'accordion', title: 'Accordion', href: '#', icon: LuChevronDown },
      { id: 'cards', title: 'Cards', href: '#', icon: LuSquareMousePointer },
      { id: 'code', title: 'Code', href: '#', icon: LuCode },
      { id: 'heading', title: 'Heading', href: '#', icon: LuHeading },
      { id: 'images', title: 'Images', href: '#', icon: LuImage },
      { id: 'lists', title: 'Lists and tables', href: '#', icon: LuList },
      { id: 'panel', title: 'Panel', href: '#', icon: LuPanelRight },
      { id: 'tabs', title: 'Tabs', href: '#', icon: LuPanelTop },
      { id: 'text', title: 'Text', href: '#', icon: LuText },
    ],
  },
  {
    id: 'theming',
    title: 'Theming',
    icon: LuAtom,
    items: [
      { id: 'overview', title: 'Overview', href: '#', icon: LuAtom },
      { id: 'tokens', title: 'Tokens', href: '#', icon: LuBraces },
      { id: 'animations', title: 'Animations', href: '#', icon: LuImage },
      { id: 'recipes', title: 'Recipes', href: '#', icon: LuCookingPot },
      { id: 'text-styles', title: 'Text Styles', href: '#', icon: LuBaseline },
      {
        id: 'reusable-styles',
        title: 'Reusable Styles',
        href: '#',
        icon: LuRecycle,
      },
    ],
  },
]

export const collapsibleNavigationGroups = [
  {
    id: 'components',
    title: 'Components',
    sections: [
      {
        title: 'Layout',
        children: [
          { id: 'aspect-ratio', title: 'Aspect Ratio', href: '#' },
          { id: 'bleed', title: 'Bleed', href: '#' },
          { id: 'box', title: 'Box', href: '#' },
          { id: 'center', title: 'Center', href: '#' },
          { id: 'container', title: 'Container', href: '#' },
          { id: 'flex', title: 'Flex', href: '#' },
          { id: 'float', title: 'Float', href: '#' },
          { id: 'grid', title: 'Grid', href: '#' },
          { id: 'group', title: 'Group', href: '#' },
        ],
      },

      {
        title: 'Typography',
        children: [
          { id: 'blockquote', title: 'Blockquote', href: '#' },
          { id: 'code', title: 'Code', href: '#' },
          { id: 'code-block', title: 'Code Block', href: '#' },
          { id: 'em', title: 'Emphasis', href: '#' },
          { id: 'heading', title: 'Heading', href: '#' },
          { id: 'highlight', title: 'Highlight', href: '#' },
          { id: 'kbd', title: 'Kbd', href: '#' },
          { id: 'link', title: 'Link', href: '#' },
          { id: 'list', title: 'List', href: '#' },
          { id: 'mark', title: 'Mark', href: '#' },
        ],
      },

      {
        title: 'Buttons',
        children: [
          { id: 'button', title: 'Button', href: '#' },
          { id: 'close-button', title: 'Close Button', href: '#' },
          { id: 'icon-button', title: 'Icon Button', href: '#' },
          { id: 'download-trigger', title: 'Download Trigger', href: '#' },
        ],
      },

      {
        title: 'Forms',
        children: [
          { id: 'checkbox', title: 'Checkbox', href: '#' },
          { id: 'field', title: 'Field', href: '#' },
          { id: 'fieldset', title: 'Fieldset', href: '#' },
          { id: 'input', title: 'Input', href: '#' },
          { id: 'radio', title: 'Radio', href: '#' },
          { id: 'rating', title: 'Rating', href: '#' },
          { id: 'switch', title: 'Switch', href: '#' },
          { id: 'textarea', title: 'Textarea', href: '#' },
        ],
      },
    ],
  },
]

export const apiReferenceData = [
  {
    category: 'SDK',
    items: [
      { method: 'POST', title: 'Generate SDK', href: '#', active: false },
      {
        method: 'GET',
        title: 'Get SDK Generation Status',
        href: '#',
        active: false,
      },
    ],
  },
  {
    category: 'Snippets',
    items: [
      {
        method: 'POST',
        title: 'Get snippet for endpoint',
        href: '#',
        active: true,
      },
      { method: 'POST', title: 'Load all snippets', href: '#', active: false },
      { method: 'PUT', title: 'Update a snippet', href: '#', active: false },
    ],
  },
  {
    category: 'Tokens',
    items: [
      { method: 'POST', title: 'Generate token', href: '#', active: false },
      { method: 'PATCH', title: 'Revoke token', href: '#', active: false },
      { method: 'DELETE', title: 'Delete a token', href: '#', active: false },
    ],
  },
  {
    category: 'Blocks',
    items: [
      { method: 'GET', title: 'Get all blocks', href: '#', active: false },
      { method: 'GET', title: 'Get a block', href: '#', active: false },
      { method: 'POST', title: 'Create a block', href: '#', active: false },
      { method: 'PATCH', title: 'Update a block', href: '#', active: false },
      { method: 'DELETE', title: 'Delete a block', href: '#', active: false },
    ],
  },
]

export const apiReferenceGroupedData = [
  {
    category: 'Overview',
    items: [
      { title: 'Introduction', href: '#', active: true },
      { title: 'API keys', href: '#', active: false },
      { title: 'Rate limits', href: '#', active: false },
    ],
  },
  {
    category: 'APIs',
    items: [
      {
        title: 'Links API',
        children: [
          { method: 'POST', title: 'Create a link', href: '#', active: false },
          { method: 'PATCH', title: 'Update a link', href: '#', active: false },
          { method: 'PUT', title: 'Upsert a link', href: '#', active: false },
          {
            method: 'DELETE',
            title: 'Delete a link',
            href: '#',
            active: false,
          },
          { method: 'GET', title: 'Get a link', href: '#', active: false },
          {
            method: 'GET',
            title: 'Get a list of links',
            href: '#',
            active: false,
          },
        ],
      },
      {
        title: 'Analytics API',
        children: [
          { method: 'GET', title: 'Get analytics', href: '#', active: false },
          {
            method: 'GET',
            title: 'Get a list of events',
            href: '#',
            active: false,
          },
        ],
      },
      {
        title: 'Tags API',
        children: [
          { method: 'POST', title: 'Create a tag', href: '#', active: false },
          {
            method: 'GET',
            title: 'Get a list of tags',
            href: '#',
            active: false,
          },
          { method: 'PATCH', title: 'Update a tag', href: '#', active: false },
        ],
      },
    ],
  },
]
