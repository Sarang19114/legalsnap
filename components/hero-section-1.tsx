import React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Menu, X, Gavel, Scale } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import { Spotlight } from '@/components/ui/spotlight-new'
import { FlipWords } from '@/components/ui/flip-words'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden bg-black">
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,rgba(0,0,0,0.08)_0,rgba(0,0,0,0.02)_50%,rgba(0,0,0,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.06)_0,rgba(0,0,0,0.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,0,0,0.04)_0,rgba(0,0,0,0.02)_80%,transparent_100%)]" />
                </div>
                <section className="bg-black relative overflow-hidden">
                    <Spotlight />
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20" children={undefined}>
                        </AnimatedGroup>
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,black_90%)]" />
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full bg-blue-600 px-5 py-1 text-white font-semibold text-sm shadow-lg">
                                      <Gavel className="w-4 h-4 mr-2" />
                                      Lag Gaye Law
                                    </div>
                                    <h1
                                        className="mt-8 max-w-4xl mx-auto text-balance text-5xl md:text-7xl lg:mt-16 xl:text-[4.5rem] text-white font-bold ">
                                            Legal Help that’s <br /><span className="text-blue-400"><FlipWords words={["No Cap", "Lowkey Smart", "AI-Pilled", "Built Different"]} /></span>
                                    </h1>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-blue-600/10 rounded-[14px] p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base bg-blue-600 text-white hover:bg-blue-700">
                                            <Link href="/dashboard">
                                                <span className="text-nowrap">Start Legal Consultation</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5 text-white hover:text-blue-400 border border-blue-600/30">
                                        <Link href="#how-it-works">
                                            <span className="text-nowrap">See How It Works</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-gradient-to-b from-transparent from-35% to-black absolute inset-0 z-10"
                                />
                                <div className="relative mx-auto max-w-6xl rounded-2xl p-1">
                                    <div className="absolute inset-0 z-0 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 blur-[6px] opacity-70" />
                                    <div className="relative rounded-2xl bg-black border border-zinc-700 p-1">
                                        <img
                                            className="aspect-15/8 rounded-2xl"
                                            src="/hero.png"
                                            alt="app screen"
                                            width="2700"
                                            height="1440"
                                        />
                                    </div>
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Features', href: '#link' },
    { name: 'Solution', href: '#link' },
    { name: 'Pricing', href: '#link' },
    { name: 'About', href: '#link' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2 group">
                <div className={cn(
                  'mx-auto mt-4 max-w-4xl rounded-2xl border border-white/10 bg-black/80 backdrop-blur-lg px-6 transition-all duration-300 lg:px-12',
                  isScrolled && 'shadow-lg'
                )}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Scale className="h-6 w-6 text-white" />
                                <span className="font-bold text-xl tracking-tight text-white">LegalSnap</span>
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200 text-white" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 text-white" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-gray-300 hover:text-white block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-zinc-900/80 group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-zinc-700 p-6 shadow-2xl shadow-zinc-950/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-gray-300 hover:text-white block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <SignedIn>
                                    <div className="flex items-center justify-center gap-3">
                                        <Button
                                            asChild
                                            size="sm"
                                            className={cn('border-zinc-600 text-white hover:bg-zinc-800')}
                                        >
                                            <Link href="/dashboard">
                                                <span>Dashboard</span>
                                            </Link>
                                        </Button>
                                        <UserButton afterSignOutUrl="/" />
                                    </div>
                                </SignedIn>
                                <SignedOut>
                                    <Button
                                        asChild
                                        size="sm"
                                        className={cn(isScrolled && 'lg:hidden', 'border-zinc-600 text-white hover:bg-zinc-800')}>
                                        <Link href="/sign-in">
                                            <span>Login</span>
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                        className={cn(isScrolled && 'lg:hidden', 'border-zinc-600 text-white hover:bg-zinc-800')}>
                                        <Link href="/sign-up">
                                            <span>Sign Up</span>
                                        </Link>
                                    </Button>
                                </SignedOut>
                                <SignedOut>
                                    <Button
                                        asChild
                                        size="sm"
                                        className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                        <Link href="/sign-up">
                                            <span>Get Started</span>
                                        </Link>
                                    </Button>
                                </SignedOut>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
