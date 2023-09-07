import Link from 'next/link'
import React from 'react'

type Props = {}

const page = (props: Props) => {
    return (
        <main className="h-full mt-36">
            <section className='w-[85vw] md:w-[70vw] mx-auto'>
                <h4 className="text-gray-800 text-3xl font-medium text-center mb-2">
                    Welcome to Mann-Note
                </h4>
                <p className="text-center text-gray-400 text-sm mb-3">
                    Empower Your Productivity!
                </p>
                <hr />
                <br />
                <span className="text-sm text-gray-500 font-light tracking-wider leading-5">
                    At Mann-Note, we believe that productivity is not just about
                    doing more tasks in less time, but also about staying
                    organized, focused, and inspired. Our platform is designed
                    to be your ultimate companion in achieving your productivity
                    goals by seamlessly merging notes and plans into one
                    cohesive system. In today's fast-paced world, keeping track
                    of your thoughts, ideas, and to-do lists can be
                    overwhelming. With Mann-Note, we simplify the process by
                    offering a unified platform where you can jot down your
                    notes, create detailed plans, and bring your ideas to
                    life—all in one place. No more switching between multiple
                    apps or losing track of important information.
                </span>

                <h5 className="text-base text-gray-600 font-medium my-4">
                    Key Features:
                </h5>
                <ol className="list-decimal ml-10 text-sm font-light tracking-wider text-gray-500 space-y-2">
                    <li>
                        <b className="font-medium text-gray-700">
                            Note Taking:{' '}
                        </b>
                        Capture your thoughts, ideas, and inspirations
                        effortlessly with our intuitive note-taking interface.
                        Whether you're in a meeting, attending a lecture, or
                        simply brainstorming, Mann-Note provides you with a
                        clean canvas to record your thoughts in real-time.{' '}
                    </li>
                    <li>
                        <b className="font-medium text-gray-700">
                            Task Management:{' '}
                        </b>
                        Transform your notes into actionable tasks with a click
                        of a button. Easily prioritize and organize your to-do
                        lists, ensuring that you stay on top of your commitments
                        and responsibilities.
                    </li>
                    <li>
                        <b className="font-medium text-gray-700">
                            Planning and Scheduling:{' '}
                        </b>
                        Plan your days, weeks, and months ahead with our
                        powerful scheduling tools. Set reminders, deadlines, and
                        milestones to keep yourself accountable and on track to
                        achieve your goals.
                    </li>
                    <li>
                        <b className="font-medium text-gray-700">
                            Collaboration:{' '}
                        </b>
                        Collaborate seamlessly with colleagues, friends, or
                        family members by sharing your notes and plans. Whether
                        it's a project at work, a group study session, or
                        planning a family vacation, Mann-Note makes teamwork a
                        breeze.{' '}
                    </li>
                    <li>
                        <b className="font-medium text-gray-700">
                            Customization:{' '}
                        </b>
                        Personalize your Mann-Note experience to suit your
                        unique style and preferences. Choose from various
                        themes, fonts, and layouts to make your workspace truly
                        yours
                    </li>
                </ol>

                <h5 className="text-base text-gray-600 font-medium mt-5">
                    Our Mission:
                </h5>
                <span className="text-sm text-gray-500 font-light tracking-wider leading-5">
                    Mann-Note is more than just a productivity tool; it's a
                    commitment to helping you realize your full potential. Our
                    mission is to empower individuals and teams to unlock their
                    creativity, streamline their workflows, and achieve their
                    goals with ease. We're here to simplify the complexities of
                    modern life, making productivity a natural part of your
                    daily routine
                </span>
                <h5 className="text-base text-gray-600 font-medium mt-5">
                    Join the Mann-Note Community:
                </h5>
                <p className="text-sm text-gray-500 font-light tracking-wider leading-5">
                    Experience the power of unity between notes and plans with
                    Mann-Note. Whether you're a student, professional,
                    entrepreneur, or anyone striving for greater productivity
                    and organization, Mann-Note is here to support you on your
                    journey. Join our vibrant community and start empowering
                    your productivity today! Together, we'll turn your ideas
                    into action and your plans into achievements. Welcome to
                    Mann-Note: Where Notes and Plans Unite!
                </p>
                <hr />
            </section>

            <div className="border-t h-20 w-full bottom-0 left-0 flex justify-between text-sm text-gray-500 items-center px-8 md:px-24 mt-5">
                <span>
                    <Link href={'/Feeback'}>Share Feedback</Link>
                </span>
                <p>All rights Reserved</p>
                <Link href={'https://github.com/pranay101/Mannote'}>
                    Github
                </Link>
            </div>
        </main>
    )
}

export default page
