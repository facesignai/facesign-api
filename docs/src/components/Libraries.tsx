import Image from 'next/image'

import { Button } from '@/components/Button'
import { Heading } from '@/components/Heading'
import logoGo from '@/images/logos/go.svg'
import logoNode from '@/images/logos/node.svg'
import logoPhp from '@/images/logos/php.svg'
import logoPython from '@/images/logos/python.svg'
import logoRuby from '@/images/logos/ruby.svg'

const libraries = [
  {
    href: 'https://www.npmjs.com/package/@facesignai/api',
    name: 'TypeScript/JavaScript',
    description:
      'Official TypeScript SDK with full type safety and IntelliSense support for Node.js and browser environments.',
    logo: logoNode,
    status: 'available',
    buttonText: 'View on npm',
  },
  {
    href: 'https://pypi.org/project/facesign-api/',
    name: 'Python',
    description:
      'Python SDK for server-side integrations with Django, Flask, and FastAPI.',
    logo: logoPython,
    status: 'available',
    buttonText: 'View on PyPI',
  },
  {
    href: 'https://pkg.go.dev/github.com/facesignai/facesign-go',
    name: 'Go',
    description:
      'Lightweight Go SDK for high-performance server applications.',
    logo: logoGo,
    status: 'available',
    buttonText: 'View on pkg.go.dev',
  },
]

const upcomingLibraries = [
  {
    name: 'PHP',
    description:
      'PHP SDK for Laravel, Symfony, and vanilla PHP applications.',
    logo: logoPhp,
    status: 'planned',
    timeline: 'Q3 2024',
  },
  {
    name: 'Ruby',
    description:
      'Ruby SDK for Rails applications and Ruby web frameworks.',
    logo: logoRuby,
    status: 'planned',
    timeline: 'Q4 2024',
  },
]

export function Libraries() {
  return (
    <div className="my-16 xl:max-w-none">
      <Heading level={2} id="official-libraries">
        Available SDKs
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 border-t border-zinc-900/5 pt-10 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3 dark:border-white/5">
        {libraries.map((library) => (
          <div key={library.name} className="flex flex-row-reverse gap-6">
            <div className="flex-auto">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {library.name}
                </h3>
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
                  Available
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {library.description}
              </p>
              <p className="mt-4">
                <Button href={library.href} variant="text" arrow="right">
                  {library.buttonText}
                </Button>
              </p>
            </div>
            <Image
              src={library.logo}
              alt=""
              className="h-12 w-12"
              unoptimized
            />
          </div>
        ))}
      </div>

      <Heading level={2} id="upcoming-libraries" className="mt-16">
        Planned SDKs
      </Heading>
      <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 border-t border-zinc-900/5 pt-10 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3 dark:border-white/5">
        {upcomingLibraries.map((library) => (
          <div key={library.name} className="flex flex-row-reverse gap-6 opacity-75">
            <div className="flex-auto">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {library.name}
                </h3>
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20">
                  {library.timeline}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {library.description}
              </p>
              <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
                Coming soon - join our waitlist to be notified
              </p>
            </div>
            <Image
              src={library.logo}
              alt=""
              className="h-12 w-12 opacity-50"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  )
}
